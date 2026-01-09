import { create } from 'zustand';
import { toast } from 'sonner';
import { getEthereum, isMetaMaskInstalled } from '@/features/wallet/core/getProvider';
import { readWalletState, connectWallet } from '@/features/wallet/api/walletApi';
import { attachWalletListeners } from '@/features/wallet/core/events';
import { setupFallbackSync } from '@/features/wallet/core/sync';
import { shortAddress } from '@/utils';
import type { WalletState } from '@/store/types';

interface WalletStore extends WalletState {
  // Actions
  init: () => Promise<void>;
  connect: () => Promise<void>;
  sync: () => Promise<void>;
  clearError: () => void;
  disconnectLocal: () => void;
}

/**
 * Zustand store: Single source of truth cho wallet state
 * 
 * TẠI SAO ZUSTAND SINGLE SOURCE OF TRUTH?
 * - Tất cả components subscribe vào cùng một store
 * - Khi state thay đổi, tất cả components tự động re-render
 * - Tránh stale UI: UI luôn reflect đúng state hiện tại
 * - Epoch tracking: đảm bảo chỉ apply updates mới nhất (tránh race conditions)
 */
export const useWalletStore = create<WalletStore>((set, get) => ({
  // Initial state
  installed: false,
  status: 'idle',
  account: null,
  accounts: [],
  chainIdHex: null,
  chainIdDec: null,
  lastError: null,
  epoch: 0,
  listenersAttached: false,
  cleanup: undefined,

  // Initialize wallet
  init: async () => {
    const installed = isMetaMaskInstalled();
    set({ installed });

    if (!installed) {
      return;
    }

    const ethereum = getEthereum();
    if (!ethereum) {
      return;
    }

    // Guard: Chỉ attach listeners một lần để tránh duplicate toasts
    // Tránh duplicate registration trong React StrictMode hoặc HMR
    const { listenersAttached, cleanup } = get();
    if (listenersAttached && cleanup) {
      return;
    }

    // Cleanup existing listeners nếu có (HMR protection)
    if (cleanup) {
      cleanup();
    }

    // Đọc initial state (non-interactive, không trigger popup)
    try {
      const state = await readWalletState(ethereum);

      set({
        status: state.account ? 'connected' : 'idle',
        account: state.account,
        accounts: state.accounts,
        chainIdHex: state.chainIdHex,
        chainIdDec: state.chainIdDec,
        lastError: null,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize wallet';
      set({
        status: 'error',
        lastError: errorMessage,
      });
      // Log error for debugging (non-blocking)
      if (process.env.NODE_ENV === 'development') {
        console.error('[Wallet] Init error:', error);
      }
    }

    // Gắn event listeners (chỉ một lần nhờ guard ở trên)
    const handlers = {
      onAccountsChanged: (accounts: string[]) => {
        // MetaMask bắn event accountsChanged khi đổi account

        if (accounts.length > 0) {
          // Có accounts: user đã switch account hoặc connect
          const nextAccount = accounts[0];
          const prevAccount = get().account;
          
          // Guard: Nếu account không thay đổi, return early (tránh duplicate toast)
          if (nextAccount === prevAccount) {
            return;
          }
          
          set((state: WalletState) => ({
            account: nextAccount,
            accounts,
            status: 'connected',
            lastError: null, // Clear error khi account thay đổi
            epoch: state.epoch + 1,
          }));
          
          // Toast notification cho account switch - dùng fixed id để replace thay vì stack
          toast.info(`Switched account: ${shortAddress(nextAccount)}`, { id: 'account-changed' });
        } else {
          // accountsChanged([]) nghĩa là người dùng đã ngắt kết nối dApp khỏi MetaMask
          // accountsChanged([]) = user disconnect dApp
          set((state: WalletState) => ({
            account: null,
            accounts: [],
            status: 'idle',
            lastError: null, // Clear error khi disconnect
            epoch: state.epoch + 1,
          }));
          
          // Toast warning cho disconnect - dùng fixed id để replace thay vì stack
          toast.warning('Wallet disconnected', { id: 'wallet-disconnected' });
        }
      },
      onChainChanged: (chainId: string) => {
        const chainIdDec = parseInt(chainId, 16);
        set((state: WalletState) => ({
          chainIdHex: chainId,
          chainIdDec,
          epoch: state.epoch + 1,
        }));
      },
    };

    const cleanupListeners = attachWalletListeners(ethereum, handlers);

    // Setup fallback sync
    const cleanupFallback = setupFallbackSync(
      ethereum,
      {
        chainIdHex: get().chainIdHex,
        accounts: get().accounts,
      },
      (newState) => {
        set((state: WalletState) => ({
          account: newState.account,
          accounts: newState.accounts,
          chainIdHex: newState.chainIdHex,
          chainIdDec: newState.chainIdDec,
          status: newState.account ? 'connected' : 'idle',
          epoch: state.epoch + 1,
        }));
      }
    );

    // Combined cleanup - reset flag khi cleanup để có thể re-init
    const combinedCleanup = () => {
      cleanupListeners();
      cleanupFallback();
      // Reset flag để có thể re-attach listeners nếu cần
      set({ listenersAttached: false, cleanup: undefined });
    };

    set({
      listenersAttached: true,
      cleanup: combinedCleanup,
    });
  },

  // Connect wallet
  /**
   * Kết nối MetaMask wallet
   * - MetaMask được inject vào window.ethereum khi extension được cài đặt
   * - Gọi eth_requestAccounts để trigger MetaMask popup
   * - Xử lý 3 trường hợp: success, user rejection (4001), technical error
   */
  connect: async () => {
    const ethereum = getEthereum();
    if (!ethereum) {
      set({
        status: 'error',
        lastError: 'MetaMask not installed',
      });
      return;
    }

    set({ status: 'connecting', lastError: null });

    try {
      // Gọi eth_requestAccounts - trigger MetaMask popup
      const state = await connectWallet(ethereum);

      set({
        status: 'connected',
        account: state.account,
        accounts: state.accounts,
        chainIdHex: state.chainIdHex,
        chainIdDec: state.chainIdDec,
        lastError: null,
        epoch: get().epoch + 1,
      });

      // Toast success
      toast.success('Wallet connected successfully');
    } catch (error: unknown) {
      // Xử lý user rejection: error.code === 4001 là người dùng từ chối kết nối
      const errorObj = error as { code?: number; message?: string };
      if (errorObj.code === 4001 || errorObj.message?.toLowerCase().includes('user rejected')) {
        set({
          status: 'idle',
          lastError: 'Connection request was rejected by user',
        });
        // Toast warning cho user rejection
        toast.warning('Connection request was rejected');
      } else {
        // Technical error
        const errorMessage = errorObj.message || 'Failed to connect wallet';
        set({
          status: 'error',
          lastError: errorMessage,
        });
        // Toast error cho technical error
        toast.error('Failed to connect wallet');
        // Log error for debugging (non-blocking)
        if (process.env.NODE_ENV === 'development') {
          console.error('[Wallet] Connect error:', error);
        }
      }
    }
  },

  // Sync wallet state (manual trigger)
  sync: async () => {
    const ethereum = getEthereum();
    if (!ethereum) {
      return;
    }

    try {
      const state = await readWalletState(ethereum);
      const current = get();

      // Check if state changed
      const chainChanged = state.chainIdHex !== current.chainIdHex;
      // Shallow comparison for arrays (more efficient than JSON.stringify)
      const accountsChanged = 
        state.accounts.length !== current.accounts.length ||
        state.accounts.some((acc, idx) => acc !== current.accounts[idx]);

      if (chainChanged || accountsChanged) {
        set({
          account: state.account,
          accounts: state.accounts,
          chainIdHex: state.chainIdHex,
          chainIdDec: state.chainIdDec,
          status: state.account ? 'connected' : 'idle',
          epoch: current.epoch + 1,
        });
      }
    } catch (error: unknown) {
      // Log error for debugging (non-blocking, sync is best-effort)
      if (process.env.NODE_ENV === 'development') {
        console.error('[Wallet] Sync error:', error);
      }
    }
  },

  // Clear error
  clearError: () => {
    set({ lastError: null });
  },

  // Disconnect local (clear state only)
  /**
   * TẠI SAO CHỈ CÓ disconnectLocal?
   * - MetaMask KHÔNG hỗ trợ programmatic disconnect
   * - User phải disconnect từ MetaMask extension
   * - disconnectLocal chỉ clear local state, không thực sự disconnect wallet
   * 
   * MetaMask không cho phép disconnect bằng code, chỉ clear state phía ứng dụng
   */
  disconnectLocal: () => {
    set({
      status: 'idle',
      account: null,
      accounts: [],
      chainIdHex: null,
      chainIdDec: null,
      lastError: null,
      epoch: get().epoch + 1,
    });
    
    // Toast info cho disconnect
    toast.info('Disconnected from app');
  },
}));

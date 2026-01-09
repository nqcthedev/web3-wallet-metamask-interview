import { create } from 'zustand';
import { toast } from 'sonner';
import { Web3 } from 'web3';
import { getEthereum } from '@/features/wallet/core/getProvider';
import { getTokenConfig } from '@/config/tokens';
import { getErc20Balance } from '@/features/tokens/core/erc20';
import { TokenKey } from '@/features/tokens/config/tokens';

export interface TokenBalanceState {
  address: string | null;
  value: string | null; // formatted balance
  status: 'ok' | 'na' | 'error';
  decimals?: number;
}

interface TokenBalancesStore {
  balances: {
    USDC: TokenBalanceState;
    USDT: TokenBalanceState;
  };
  loading: boolean;
  lastUpdated: number | null;
  error: string | null;
  fetchEpoch: number; // Local epoch để prevent stale updates - increment mỗi lần fetch starts

  // Actions
  fetchBalances: (params: { account: string | null; chainId: number | null; epoch: number; isManualRefresh?: boolean }) => Promise<void>;
  reset: () => void;
}

const initialBalanceState: TokenBalanceState = {
  address: null,
  value: null,
  status: 'na',
};

export const useTokenBalancesStore = create<TokenBalancesStore>((set, get) => ({
  balances: {
    USDC: { ...initialBalanceState },
    USDT: { ...initialBalanceState },
  },
  loading: false,
  lastUpdated: null,
  error: null,
  fetchEpoch: 0,

  reset: () => {
    set({
      balances: {
        USDC: { ...initialBalanceState },
        USDT: { ...initialBalanceState },
      },
      loading: false,
      lastUpdated: null,
      error: null,
      fetchEpoch: 0,
    });
  },

  fetchBalances: async ({ account, chainId, epoch, isManualRefresh = false }) => {
    // TẠI SAO DÙNG EPOCH ĐỂ PREVENT STALE DATA?
    // - Khi user switch account/chain nhanh, nhiều requests có thể chạy song song
    // - fetchEpoch increment mỗi lần fetch starts => chỉ commit results nếu epoch matches latest
    // - Tránh race condition: request cũ không thể overwrite request mới
    const currentEpoch = get().fetchEpoch + 1;
    set({ fetchEpoch: currentEpoch, loading: true, error: null });

    // Không fetch nếu không có account hoặc chainId
    if (!account || !chainId) {
      set({
        balances: {
          USDC: { ...initialBalanceState },
          USDT: { ...initialBalanceState },
        },
        loading: false,
        lastUpdated: null,
      });
      return;
    }

    const ethereum = getEthereum();
    if (!ethereum) {
      set({ loading: false, error: 'MetaMask not available' });
      return;
    }

    try {
      // Create Web3 instance với MetaMask provider
      const web3 = new Web3(ethereum);

      // Get token addresses for current chainId (chain-aware resolution)
      const usdcConfig = getTokenConfig(chainId, 'USDC');
      const usdtConfig = getTokenConfig(chainId, 'USDT');
      const usdcAddr = usdcConfig?.address || null;
      const usdtAddr = usdtConfig?.address || null;

      // Fetch balances for both tokens in parallel
      // Token có thể N/A tùy network - chỉ query nếu có address
      const tokens: TokenKey[] = ['USDC', 'USDT'];
      const balancePromises = tokens.map(async (tokenKey) => {
        const tokenConfig = getTokenConfig(chainId, tokenKey);

        // Nếu token không có config cho chain này => N/A (không phải lỗi)
        if (!tokenConfig) {
          return {
            tokenKey,
            state: {
              address: null,
              value: '—',
              status: 'na' as const,
            },
          };
        }

        try {
          // Gọi balanceOf + decimals để tính số dư token ERC-20
          const result = await getErc20Balance(web3, tokenConfig.address, account);

          // Check if this request is still current (stale protection với epoch)
          if (get().fetchEpoch !== currentEpoch) {
            // Request is stale, ignore result
            return null;
          }

          return {
            tokenKey,
            state: {
              address: tokenConfig.address,
              value: result.formatted,
              status: 'ok' as const,
              decimals: result.decimals,
            },
          };
        } catch (error: unknown) {
          // Technical error fetching balance
          
          // Check if still current request (stale protection với epoch)
          if (get().fetchEpoch !== currentEpoch) {
            return null;
          }

          // Log error for debugging (non-blocking)
          if (process.env.NODE_ENV === 'development') {
            console.error(`[TokenBalances] Error fetching ${tokenKey}:`, error);
          }

          return {
            tokenKey,
            state: {
              address: tokenConfig.address,
              value: null,
              status: 'error' as const,
            },
          };
        }
      });

      const results = await Promise.all(balancePromises);

      // Final stale check với epoch
      if (get().fetchEpoch !== currentEpoch) {
        return; // Ignore stale results
      }

      // Update balances
      const newBalances = {
        USDC: { ...initialBalanceState },
        USDT: { ...initialBalanceState },
      };

      let usdcValue = 'N/A';
      let usdtValue = 'N/A';

      for (const result of results) {
        if (result) {
          newBalances[result.tokenKey] = result.state;
          if (result.tokenKey === 'USDC') {
            usdcValue = result.state.value || 'N/A';
          } else if (result.tokenKey === 'USDT') {
            usdtValue = result.state.value || 'N/A';
          }
        }
      }

      set({
        balances: newBalances,
        loading: false,
        lastUpdated: Date.now(),
        error: null,
      });

      // TẠI SAO TRÁNH TOAST SPAM?
      // - Auto-refresh xảy ra mỗi khi account/chain thay đổi => có thể rất thường xuyên
      // - Toast mỗi lần refresh sẽ làm user annoyed và distract
      // - Chỉ toast khi manual refresh (user click button) hoặc có error thực sự
      // - isManualRefresh flag để phân biệt auto vs manual refresh
      if (isManualRefresh) {
        toast.success('Balances updated');
      }
    } catch (error: unknown) {
      // Final stale check với epoch
      if (get().fetchEpoch !== currentEpoch) {
        return;
      }

      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch token balances';
      
      // Log error for debugging (non-blocking)
      if (process.env.NODE_ENV === 'development') {
        console.error('[TokenBalances] Fetch error:', error);
      }
      
      // Only toast on genuine technical errors (not 'na' status) và manual refresh
      if (isManualRefresh) {
        toast.error(errorMessage);
      }
      
      set({
        loading: false,
        error: errorMessage,
      });
    }
  },
}));

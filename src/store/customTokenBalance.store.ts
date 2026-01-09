import { create } from 'zustand';
import { toast } from 'sonner';
import { Web3 } from 'web3';
import { getEthereum } from '@/features/wallet/core/getProvider';
import { getErc20Balance } from '../features/tokens/core/erc20';
import { isValidEthereumAddress } from '@/utils';

interface CustomTokenBalanceStore {
  // State
  contractAddress: string;
  loading: boolean;
  balance: string | null; // formatted balance
  decimals: number | null;
  error: string | null;
  fetchEpoch: number; // Local epoch để prevent stale updates

  // Actions
  setContractAddress: (address: string) => void;
  checkBalance: (account: string, isManualCheck?: boolean) => Promise<void>;
  reset: () => void;
}

/**
 * Store quản lý custom token balance
 * 
 * TẠI SAO balanceOf ĐỌC TỪ TOKEN CONTRACT?
 * - Token ERC-20 lưu số dư của mỗi address trong mapping: mapping(address => uint256) balances
 * - balanceOf(address) là hàm public trong token contract để đọc số dư
 * - Wallet accounts là EOAs (Externally Owned Accounts), không phải contracts
 * - Khi user nhận token, token contract cập nhật mapping balances[userAddress] = amount
 * - balanceOf(userAddress) trả về giá trị từ mapping này
 * 
 * TẠI SAO balance CÓ THỂ = 0?
 * - Nếu wallet chưa nhận token nào từ contract này => balance = 0
 * - Đây là hành vi bình thường, không phải lỗi
 * - Token balance được lưu trong contract, không phải trong wallet
 */
export const useCustomTokenBalanceStore = create<CustomTokenBalanceStore>((set, get) => ({
  // Initial state
  contractAddress: '',
  loading: false,
  balance: null,
  decimals: null,
  error: null,
  fetchEpoch: 0,

  // Set contract address (with validation)
  setContractAddress: (address: string) => {
    set({ contractAddress: address, error: null });
  },

  // Check balance for custom token
  // isManualCheck: true khi user click button, false khi auto-refresh từ debounce
  checkBalance: async (account: string, isManualCheck = true) => {
    const { contractAddress } = get();

    // Validate address format
    if (!contractAddress.trim()) {
      set({ error: 'Please enter a contract address' });
      toast.error('Please enter a contract address');
      return;
    }

    // Normalize address (trim whitespace)
    const normalizedAddress = contractAddress.trim();

    if (!isValidEthereumAddress(normalizedAddress)) {
      const errorMsg = 'Invalid Ethereum address format';
      set({ error: errorMsg, balance: null, decimals: null });
      // Chỉ toast khi manual check (user input invalid)
      if (isManualCheck) {
        toast.error(errorMsg);
      }
      return;
    }

    // TẠI SAO DÙNG EPOCH ĐỂ PREVENT STALE DATA?
    // - Khi user type nhanh, debounce có thể trigger nhiều requests
    // - fetchEpoch increment mỗi lần fetch starts => chỉ commit results nếu epoch matches latest
    const currentEpoch = get().fetchEpoch + 1;
    set({ fetchEpoch: currentEpoch, loading: true, error: null, balance: null, decimals: null });

    const ethereum = getEthereum();
    if (!ethereum) {
      const errorMsg = 'MetaMask not available';
      set({ loading: false, error: errorMsg });
      toast.error(errorMsg);
      return;
    }

    try {
      // Create Web3 instance với MetaMask provider
      const web3 = new Web3(ethereum);

      // Gọi balanceOf + decimals để tính số dư token ERC-20
      // balanceOf đọc từ token contract mapping balances[account]
      const result = await getErc20Balance(web3, normalizedAddress, account);

      // Check if still current request (stale protection với epoch)
      if (get().fetchEpoch !== currentEpoch) {
        return; // Ignore stale result
      }

      // Success: update state with balance
      set({
        loading: false,
        balance: result.formatted,
        decimals: result.decimals,
        error: null,
      });

      // TẠI SAO TRÁNH TOAST SPAM?
      // - Auto-refresh từ debounce xảy ra mỗi khi address thay đổi
      // - Chỉ toast khi manual check (user click button) để tránh spam
      if (isManualCheck) {
        if (result.formatted === '0') {
          toast.info('Token balance is 0 (wallet has not received tokens from this contract)');
        } else {
          toast.success(`Balance: ${result.formatted}`);
        }
      }
    } catch (error: unknown) {
      // Handle different error types
      let errorMessage = 'Failed to fetch token balance';

      // Check error message for common cases
      const errorObj = error instanceof Error ? error : { message: '' };
      const errorMsg = errorObj.message?.toLowerCase() || '';
      
      // Log error for debugging (non-blocking)
      if (process.env.NODE_ENV === 'development') {
        console.error('[CustomTokenBalance] Check balance error:', error);
      }
      
      if (errorMsg.includes('execution reverted') || errorMsg.includes('invalid opcode')) {
        // Contract không phải ERC-20 hoặc không có hàm balanceOf/decimals
        errorMessage = 'Contract is not a valid ERC-20 token or does not support balanceOf/decimals';
      } else if (errorMsg.includes('network') || errorMsg.includes('rpc')) {
        // RPC/Network error
        errorMessage = 'Network error. Please check your connection and try again';
      } else if (errorMsg.includes('not deployed') || errorMsg.includes('does not exist')) {
        // Contract không tồn tại trên network hiện tại
        errorMessage = 'Contract not found on current network';
      } else if (errorObj.message) {
        // Use specific error message if available
        errorMessage = errorObj.message;
      }

      // Check if still current request (stale protection với epoch)
      if (get().fetchEpoch !== currentEpoch) {
        return; // Ignore stale result
      }

      set({
        loading: false,
        balance: null,
        decimals: null,
        error: errorMessage,
      });

      // Chỉ toast khi manual check để tránh spam
      if (isManualCheck) {
        toast.error(errorMessage);
      }
    }
  },

  // Reset state
  reset: () => {
    set({
      contractAddress: '',
      loading: false,
      balance: null,
      decimals: null,
      error: null,
      fetchEpoch: 0,
    });
  },
}));

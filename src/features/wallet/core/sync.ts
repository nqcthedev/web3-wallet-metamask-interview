import type { EIP1193Provider } from './getProvider';
import { readWalletState } from '../api/walletApi';
import type { WalletReadResult } from '../../../store/types';

/**
 * Fallback sync: Đọc lại wallet state từ MetaMask
 * 
 * TẠI SAO CẦN FALLBACK SYNC?
 * - MetaMask KHÔNG LUÔN emit chainChanged event trong một số UI flows
 *   (ví dụ: user switch network từ extension dropdown nhưng event không fire)
 * - Fallback sync đảm bảo UI luôn reflect đúng state của MetaMask
 * - Trigger khi:
 *   + Window focus (user quay lại tab)
 *   + Document visibility change (tab trở nên visible)
 * 
 * => Đây là best practice để đảm bảo reliability
 */
export async function syncWalletState(
  ethereum: EIP1193Provider,
  currentState: {
    chainIdHex: string | null;
    accounts: string[];
  },
  onStateChanged: (state: WalletReadResult) => void
): Promise<void> {
  try {
    const newState = await readWalletState(ethereum);

    // Chỉ update nếu có thay đổi (tránh unnecessary re-renders)
    const chainChanged = newState.chainIdHex !== currentState.chainIdHex;
    const accountsChanged = JSON.stringify(newState.accounts) !== JSON.stringify(currentState.accounts);

    if (chainChanged || accountsChanged) {
      onStateChanged(newState);
    }
  } catch (error) {
    // Error handled silently
  }
}

/**
 * Setup fallback sync triggers
 * - Window focus: user quay lại tab
 * - Visibility change: tab trở nên visible
 */
export function setupFallbackSync(
  ethereum: EIP1193Provider,
  currentState: {
    chainIdHex: string | null;
    accounts: string[];
  },
  onStateChanged: (state: WalletReadResult) => void
): () => void {
  const handleFocus = () => {
    syncWalletState(ethereum, currentState, onStateChanged);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      syncWalletState(ethereum, currentState, onStateChanged);
    }
  };

  window.addEventListener('focus', handleFocus);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Return cleanup
  return () => {
    window.removeEventListener('focus', handleFocus);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}

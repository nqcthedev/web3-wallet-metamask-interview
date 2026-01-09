import type { EIP1193Provider } from './getProvider';

export interface WalletEventHandlers {
  onAccountsChanged: (accounts: string[]) => void;
  onChainChanged: (chainId: string) => void;
}

/**
 * Gắn EIP-1193 event listeners cho MetaMask
 * 
 * TẠI SAO DÙNG EIP-1193 EVENTS?
 * - chainChanged: MetaMask emit khi user switch network (nhưng không phải lúc nào cũng emit)
 * - accountsChanged: MetaMask emit khi user switch account hoặc disconnect
 * - Đây là cách chuẩn để theo dõi thay đổi từ wallet extension
 * 
 * LƯU Ý: MetaMask có thể không emit chainChanged trong một số UI flows
 * => Cần fallback sync (xem sync.ts)
 */
export function attachWalletListeners(
  ethereum: EIP1193Provider,
  handlers: WalletEventHandlers
): () => void {
  const handleAccountsChanged = (...args: unknown[]) => {
    const accounts = args[0] as string[];
    handlers.onAccountsChanged(accounts);
  };

  const handleChainChanged = (...args: unknown[]) => {
    const chainId = args[0] as string;
    handlers.onChainChanged(chainId);
  };

  // Gắn listeners
  ethereum.on('accountsChanged', handleAccountsChanged);
  ethereum.on('chainChanged', handleChainChanged);

  // Return cleanup function để remove listeners (tránh memory leak + HMR issues)
  return () => {
    if (ethereum.removeListener) {
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
      ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };
}

/**
 * EIP-1193 Provider type definition
 * EIP-1193 là standard interface cho Ethereum providers (MetaMask, Coinbase Wallet, etc.)
 */
export interface EIP1193Provider {
  isMetaMask?: boolean;
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on(event: 'accountsChanged' | 'chainChanged' | 'disconnect', handler: (...args: unknown[]) => void): void;
  removeListener(event: 'accountsChanged' | 'chainChanged' | 'disconnect', handler: (...args: unknown[]) => void): void;
}

declare global {
  interface Window {
    ethereum?: EIP1193Provider & {
      providers?: EIP1193Provider[];
    };
  }
}

/**
 * Lấy MetaMask provider từ window.ethereum
 * Hỗ trợ trường hợp có nhiều providers (MetaMask + Coinbase Wallet)
 */
export function getEthereum(): EIP1193Provider | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // Nếu có nhiều providers, tìm MetaMask
  if (window.ethereum && Array.isArray(window.ethereum.providers)) {
    const metamaskProvider = window.ethereum.providers.find((p) => p.isMetaMask);
    if (metamaskProvider) {
      return metamaskProvider as EIP1193Provider;
    }
  }

  // Fallback: single provider với isMetaMask check
  if (window.ethereum && window.ethereum.isMetaMask) {
    return window.ethereum as EIP1193Provider;
  }

  return null;
}

/**
 * Kiểm tra MetaMask đã được cài đặt chưa
 */
export function isMetaMaskInstalled(): boolean {
  return getEthereum() !== null;
}

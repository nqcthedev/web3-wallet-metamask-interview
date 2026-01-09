import type { EIP1193Provider } from '../core/getProvider';
import type { WalletReadResult } from '../../../store/types';

/**
 * Đọc wallet state từ MetaMask (KHÔNG trigger popup)
 * Sử dụng eth_chainId và eth_accounts (non-interactive methods)
 */
export async function readWalletState(ethereum: EIP1193Provider): Promise<WalletReadResult> {
  const [chainIdHex, accounts] = await Promise.all([
    ethereum.request({ method: 'eth_chainId' }) as Promise<string>,
    ethereum.request({ method: 'eth_accounts' }) as Promise<string[]>,
  ]);

  const chainIdDec = parseInt(chainIdHex, 16);
  const account = accounts[0] ?? null;

  return {
    chainIdHex,
    chainIdDec,
    accounts,
    account,
  };
}

/**
 * Kết nối wallet (trigger MetaMask popup)
 * Sử dụng eth_requestAccounts (interactive method)
 */
export async function connectWallet(ethereum: EIP1193Provider): Promise<WalletReadResult> {
  // Request accounts (trigger popup)
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];

  // Read chainId
  const chainIdHex = await ethereum.request({ method: 'eth_chainId' }) as string;
  const chainIdDec = parseInt(chainIdHex, 16);
  const account = accounts[0] ?? null;

  return {
    chainIdHex,
    chainIdDec,
    accounts,
    account,
  };
}

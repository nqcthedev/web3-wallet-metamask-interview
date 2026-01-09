/**
 * Wallet state types
 */

export type WalletStatus = 'idle' | 'connecting' | 'connected' | 'error';

export interface WalletState {
  installed: boolean;
  status: WalletStatus;
  account: string | null;
  accounts: string[];
  chainIdHex: string | null;
  chainIdDec: number | null;
  lastError: string | null;
  epoch: number;
  listenersAttached: boolean;
  cleanup?: () => void;
}

export interface WalletReadResult {
  chainIdHex: string;
  chainIdDec: number;
  accounts: string[];
  account: string | null;
}

/**
 * Token types and interfaces
 * Re-export from config for backward compatibility
 */

export type TokenKey = 'USDC' | 'USDT';

export interface TokenConfig {
  address: string;
  symbol: TokenKey;
  name: string;
}

// Re-export from centralized config
export { getTokenConfig, getTokenAddress } from '@/config/tokens';

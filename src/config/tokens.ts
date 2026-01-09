/**
 * Token configuration - Config-driven để thêm chain/token không sửa core logic
 * Token có thể N/A tùy network (không phải lỗi)
 */

import type { TokenKey } from '@/features/tokens/config/tokens';

export interface TokenConfig {
  address: string;
  symbol: TokenKey;
  name: string;
}

/**
 * Token address map by chainId (decimal)
 * Token có thể N/A tùy network - set address = null nếu không có trên chain đó
 */
export const TOKEN_MAP: Record<number, Record<TokenKey, TokenConfig | null>> = {
  // Ethereum Mainnet (1)
  1: {
    USDC: {
      address: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      name: 'USD Coin',
    },
    USDT: null, // Not available on Ethereum mainnet in this config
  },
  // Ethereum Sepolia (11155111)
  11155111: {
    USDC: null, // Not configured for Sepolia testnet
    USDT: null,
  },
  // BNB Chain Mainnet (56)
  56: {
    USDC: null, // Not configured for BNB mainnet
    USDT: null,
  },
  // BNB Chain Testnet (97)
  97: {
    USDT: {
      address: '0x222D12d538b7FB8B17723322aF40379D51C70372',
      symbol: 'USDT',
      name: 'Tether USD',
    },
    USDC: {
      address: '0xb32B8625D2708FC7E7041BE4169EB188eeea3c14',
      symbol: 'USDC',
      name: 'USD Coin',
    },
  },
  // Base Mainnet (8453)
  8453: {
    USDC: null, // Not configured for Base mainnet
    USDT: null,
  },
  // Base Sepolia (84532)
  84532: {
    USDC: null, // Not configured for Base Sepolia
    USDT: null,
  },
};

/**
 * Get token address for a specific chainId and token symbol
 * @param symbol - Token symbol (USDC or USDT)
 * @param chainId - Chain ID (decimal)
 * @returns Token address or null if not available on that chain
 */
export function getTokenAddress(symbol: TokenKey, chainId: number | null): string | null {
  if (!chainId) return null;
  const tokenConfig = TOKEN_MAP[chainId]?.[symbol];
  return tokenConfig?.address ?? null;
}

/**
 * Get full token config for a specific chainId and token symbol
 * @param chainId - Chain ID (decimal)
 * @param symbol - Token symbol (USDC or USDT)
 * @returns Token config or null if not available on that chain
 */
export function getTokenConfig(chainId: number | null, symbol: TokenKey): TokenConfig | null {
  if (!chainId) return null;
  return TOKEN_MAP[chainId]?.[symbol] ?? null;
}

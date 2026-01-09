/**
 * Chain configuration - Config-driven để thêm chain/token không sửa core logic
 * Single source of truth cho tất cả supported chains
 */

export type ChainEnvironment = 'mainnet' | 'testnet';

export interface ChainConfig {
  id: number;
  name: string;
  env: ChainEnvironment;
  nativeCurrency: {
    symbol: string;
    decimals: number;
  };
  blockExplorerUrl?: string;
  rpcUrl?: string;
}

/**
 * Supported chains configuration
 * - Ethereum: Mainnet + Sepolia
 * - BNB Chain: Mainnet + Testnet
 * - Base: Mainnet + Sepolia
 */
export const CHAINS: ChainConfig[] = [
  // Ethereum Mainnet
  {
    id: 1,
    name: 'Ethereum',
    env: 'mainnet',
    nativeCurrency: {
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://eth.llamarpc.com',
  },
  // Ethereum Sepolia
  {
    id: 11155111,
    name: 'Ethereum',
    env: 'testnet',
    nativeCurrency: {
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    rpcUrl: 'https://rpc.sepolia.org',
  },
  // BNB Chain Mainnet
  {
    id: 56,
    name: 'BNB Chain',
    env: 'mainnet',
    nativeCurrency: {
      symbol: 'BNB',
      decimals: 18,
    },
    blockExplorerUrl: 'https://bscscan.com',
    rpcUrl: 'https://bsc-dataseed.binance.org',
  },
  // BNB Chain Testnet
  {
    id: 97,
    name: 'BNB Chain',
    env: 'testnet',
    nativeCurrency: {
      symbol: 'BNB',
      decimals: 18,
    },
    blockExplorerUrl: 'https://testnet.bscscan.com',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  },
  // Base Mainnet
  {
    id: 8453,
    name: 'Base',
    env: 'mainnet',
    nativeCurrency: {
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrl: 'https://basescan.org',
    rpcUrl: 'https://mainnet.base.org',
  },
  // Base Sepolia
  {
    id: 84532,
    name: 'Base',
    env: 'testnet',
    nativeCurrency: {
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrl: 'https://sepolia.basescan.org',
    rpcUrl: 'https://sepolia.base.org',
  },
];

/**
 * Chain config map by chainId for quick lookup
 */
const CHAIN_MAP = new Map<number, ChainConfig>();
CHAINS.forEach((chain) => {
  CHAIN_MAP.set(chain.id, chain);
});

/**
 * Get chain config by chainId
 * @param chainId - Chain ID (decimal)
 * @returns Chain config or undefined if not found
 */
export function getChainById(chainId: number | null): ChainConfig | undefined {
  if (!chainId) return undefined;
  return CHAIN_MAP.get(chainId);
}

/**
 * Check if chain is supported
 * @param chainId - Chain ID (decimal)
 * @returns true if chain is supported, false otherwise
 */
export function isSupportedChain(chainId: number | null): boolean {
  if (!chainId) return false;
  return CHAIN_MAP.has(chainId);
}

/**
 * Get all supported chain IDs
 */
export function getSupportedChainIds(): number[] {
  return CHAINS.map((chain) => chain.id);
}

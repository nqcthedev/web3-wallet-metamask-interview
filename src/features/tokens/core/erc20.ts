import { Web3 } from 'web3';

/**
 * Minimal ERC-20 ABI for balance and decimals
 */
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
] as const;

export interface Erc20BalanceResult {
  raw: string; // Big integer string
  decimals: number;
  formatted: string; // Human readable with max 6 decimals, trimmed
}

/**
 * Gọi balanceOf + decimals để tính số dư token ERC-20
 * 
 * @param web3 - Web3 instance với MetaMask provider
 * @param tokenAddress - ERC-20 token contract address
 * @param account - User wallet address
 * @returns Balance result với raw, decimals, và formatted value
 */
export async function getErc20Balance(
  web3: Web3,
  tokenAddress: string,
  account: string
): Promise<Erc20BalanceResult> {
  // Create contract instance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contract = new web3.eth.Contract(ERC20_ABI as any, tokenAddress);

  // Fetch balance and decimals in parallel
  const [rawBalance, decimals] = await Promise.all([
    contract.methods.balanceOf(account).call() as Promise<string>,
    contract.methods.decimals().call() as Promise<string>,
  ]);

  const decimalsNum = Number(decimals);
  const rawBalanceStr = String(rawBalance);

  // Format: divide by 10^decimals, show max 6 decimals, trim trailing zeros
  // Use web3.utils.fromWei approach but handle custom decimals
  const divisor = BigInt(10 ** decimalsNum);
  const balanceBigInt = BigInt(rawBalanceStr);
  
  // Calculate integer and fractional parts
  const integerPart = balanceBigInt / divisor;
  const fractionalPart = balanceBigInt % divisor;
  
  // Format fractional part with leading zeros if needed
  const fractionalStr = fractionalPart.toString().padStart(decimalsNum, '0');
  
  // Take up to 6 decimals (or less if decimalsNum < 6)
  const maxDecimals = Math.min(6, decimalsNum);
  let fractionalDisplay = fractionalStr.slice(0, maxDecimals);
  
  // Trim trailing zeros
  fractionalDisplay = fractionalDisplay.replace(/0+$/, '');
  
  // Combine integer and fractional parts
  const formatted = fractionalDisplay
    ? `${integerPart.toString()}.${fractionalDisplay}`
    : integerPart.toString();

  return {
    raw: rawBalanceStr,
    decimals: decimalsNum,
    formatted,
  };
}

/**
 * Validation utilities
 */

/**
 * Validate Ethereum address format
 * @param address - Address string to validate
 * @returns true if valid Ethereum address, false otherwise
 */
export function isValidEthereumAddress(address: string): boolean {
  // Ethereum address format: 0x followed by 40 hexadecimal characters
  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethereumAddressRegex.test(address);
}

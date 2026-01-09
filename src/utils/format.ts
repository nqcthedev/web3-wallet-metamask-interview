/**
 * Format utilities
 */

/**
 * Format address to short version (0x1234…abcd) or "—" when empty
 * @param addr - Ethereum address string (optional)
 * @param left - Number of characters to show from the left (default: 6)
 * @param right - Number of characters to show from the right (default: 4)
 * @returns Shortened address like "0x1234…abcd" or "—" when empty
 */
export function shortAddress(addr?: string | null, left: number = 6, right: number = 4): string {
  if (!addr || addr.trim() === '') return '—';
  return `${addr.slice(0, left)}…${addr.slice(-right)}`;
}

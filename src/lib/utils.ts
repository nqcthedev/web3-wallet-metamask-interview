/**
 * Simple className utility - không cần dependencies
 * Merge class names và loại bỏ duplicates
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs
    .filter(Boolean)
    .join(' ')
    .split(/\s+/)
    .filter((cls, index, arr) => arr.indexOf(cls) === index) // Remove duplicates
    .join(' ')
    .trim();
}

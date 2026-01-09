import { useState, useEffect, useRef } from 'react';

/**
 * useSoftRefresh - Smooth transition animation hook
 * 
 * When the key changes, sets animating=true for a brief duration,
 * then automatically sets it back to false. This creates a smooth
 * transition effect when wallet state changes (account/network switch).
 * 
 * @param key - The value to watch for changes (e.g., account-chainId combination)
 * @param durationMs - Animation duration in milliseconds (default: 200)
 * @returns { animating: boolean } - Whether the animation is currently active
 */
export function useSoftRefresh(key: string, durationMs: number = 200): { animating: boolean } {
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevKeyRef = useRef<string>(key);

  useEffect(() => {
    // Only trigger animation if key actually changed
    if (key !== prevKeyRef.current) {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Set animating to true
      setAnimating(true);

      // Auto-reset after duration
      timerRef.current = setTimeout(() => {
        setAnimating(false);
        timerRef.current = null;
      }, durationMs);

      // Update previous key
      prevKeyRef.current = key;
    }

    // Cleanup on unmount or key change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [key, durationMs]);

  return { animating };
}

import { useEffect, useCallback, useRef, type RefObject } from 'react';

/**
 * Hook to handle clicks outside of a referenced element
 * @param ref - React ref to the element
 * @param handler - Callback function when click outside is detected
 * @param enabled - Whether the listener should be active
 * 
 * Uses useRef to store handler to avoid re-attaching listeners on every render
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent) => void,
  enabled: boolean = true
) {
  // Store handler in ref to avoid re-attaching listeners
  const handlerRef = useRef(handler);
  
  // Update handler ref when it changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handlerRef.current(event);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, enabled]);
}

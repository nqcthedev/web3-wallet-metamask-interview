import { useEffect, useRef } from 'react';
import { Toaster } from 'sonner';
import { useWalletStore } from '@/store';

/**
 * WalletBootstrap: Initialize wallet on app mount
 * - Detect MetaMask
 * - Read initial state
 * - Attach event listeners
 * - Setup fallback sync
 * - Setup toast provider (sonner)
 * 
 * TẠI SAO CẦN CLEANUP TRONG useEffect?
 * - React StrictMode chạy effect 2 lần trong development
 * - HMR (Hot Module Replacement) có thể re-run effect
 * - Cleanup đảm bảo chỉ có 1 set listeners được attach
 * - Tránh duplicate toasts khi switch account
 * 
 * Guard trong store.init() đảm bảo listeners chỉ attach 1 lần
 * Cleanup ở đây đảm bảo listeners được remove khi component unmount
 * 
 * TẠI SAO DÙNG useRef CHO CLEANUP?
 * - useRef giữ reference đến cleanup function mới nhất
 * - Tránh stale closure khi cleanup được gọi sau khi component unmount
 * - Đảm bảo cleanup function luôn là version mới nhất từ store
 */
export function WalletBootstrap() {
  const init = useWalletStore((state) => state.init);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    init();

    // Update cleanup ref when store changes
    const updateCleanup = () => {
      cleanupRef.current = useWalletStore.getState().cleanup;
    };
    
    // Initial update
    updateCleanup();
    
    // Subscribe to cleanup changes in store
    const unsubscribe = useWalletStore.subscribe(
      (state) => state.cleanup,
      (cleanup) => {
        cleanupRef.current = cleanup;
      }
    );

    // Cleanup khi component unmount hoặc effect re-run
    return () => {
      unsubscribe();
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = undefined;
      }
    };
  }, [init]);

  return <Toaster position="top-right" richColors />;
}

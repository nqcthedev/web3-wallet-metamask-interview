import { useEffect } from 'react';
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
 */
export function WalletBootstrap() {
  const init = useWalletStore((state) => state.init);

  useEffect(() => {
    init();

    // Cleanup khi component unmount hoặc effect re-run
    // Lấy cleanup từ store để tránh stale closure
    return () => {
      const currentCleanup = useWalletStore.getState().cleanup;
      if (currentCleanup) {
        currentCleanup();
      }
    };
  }, [init]);

  return <Toaster position="top-right" richColors />;
}

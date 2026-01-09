/**
 * Empty State - UI only
 * Displays message when wallet is not connected
 */
export function EmptyState() {
  return (
    <div className="text-center py-6 sm:py-8 px-4 border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-lg bg-slate-50/50 dark:bg-slate-800/20 opacity-75 cursor-default">
      <div className="flex flex-col items-center gap-3">
        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">Connect your wallet to view token balances.</p>
      </div>
    </div>
  );
}

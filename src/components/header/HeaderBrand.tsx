import { Badge } from '../ui/badge';

/**
 * Header Brand - Left side logo + title + Beta badge
 * Pure UI component for the app branding
 */
export function HeaderBrand() {
  return (
    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0">
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate min-w-0">
          <span className="hidden sm:inline">Wallet Dashboard</span>
          <span className="sm:hidden">Wallet</span>
        </h1>
        <Badge variant="secondary" className="text-xs shrink-0">Beta</Badge>
      </div>
    </div>
  );
}

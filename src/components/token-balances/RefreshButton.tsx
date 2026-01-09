import { Button } from '../ui/button';

interface RefreshButtonProps {
  loading: boolean;
  onRefresh: () => void;
}

/**
 * Refresh Button - UI only
 * Button to manually refresh token balances
 */
export function RefreshButton({ loading, onRefresh }: RefreshButtonProps) {
  return (
    <Button
      onClick={onRefresh}
      disabled={loading}
      variant="outline"
      size="sm"
      className="w-full sm:w-auto"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-2" />
          Updating...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </>
      )}
    </Button>
  );
}

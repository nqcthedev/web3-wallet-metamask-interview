import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

interface WalletState_ErrorCardProps {
  error: string;
  onRetry: () => void;
  onDismiss: () => void;
}

export function WalletState_ErrorCard({ error, onRetry, onDismiss }: WalletState_ErrorCardProps) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-red-500/10 rounded-lg flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg sm:text-xl">Connection Error</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Something went wrong
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm sm:text-base break-words">{error}</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={onRetry} className="flex-1 sm:flex-initial">
            Retry Connection
          </Button>
          <Button onClick={onDismiss} variant="outline" className="flex-1 sm:flex-initial">
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

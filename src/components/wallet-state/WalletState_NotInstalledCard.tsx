import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

interface WalletState_NotInstalledCardProps {
  onInstallClick: () => void;
}

export function WalletState_NotInstalledCard({ onInstallClick }: WalletState_NotInstalledCardProps) {
  return (
    <Card className="border-l-4 border-l-amber-500 dark:border-l-amber-500/50 bg-amber-50/60 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/25">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-amber-500/10 dark:bg-amber-500/20 rounded-lg flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg sm:text-xl text-slate-900 dark:text-slate-100">MetaMask Not Installed</CardTitle>
            <CardDescription className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              Install MetaMask to connect your wallet.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-3">
          <Button
            onClick={onInstallClick}
            className="w-full sm:w-auto"
          >
            Install MetaMask
          </Button>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Opens the official MetaMask site.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

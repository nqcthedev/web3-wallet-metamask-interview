import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

export function WalletState_ConnectingCard() {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg flex-shrink-0">
            <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg sm:text-xl">Connecting...</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Please approve the connection in MetaMask
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          Waiting for you to approve the connection request in your MetaMask extension.
        </p>
      </CardContent>
    </Card>
  );
}

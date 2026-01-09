import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

interface WalletState_DisconnectedCardProps {
  isConnecting: boolean;
  onConnect: () => void;
}

export function WalletState_DisconnectedCard({ isConnecting, onConnect }: WalletState_DisconnectedCardProps) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg sm:text-xl">Connect Wallet</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Connect your MetaMask wallet to get started
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm sm:text-base">
          Click the button below to connect your MetaMask wallet. You'll be prompted to approve the connection.
        </p>
        <Button onClick={onConnect} className="w-full sm:w-auto" disabled={isConnecting}>
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </CardContent>
    </Card>
  );
}

import { Accordion } from '../ui/accordion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { WalletState_DeveloperDetailsSection } from './WalletState_DeveloperDetailsSection';
import { WalletState_NetworkInfoRow } from './WalletState_NetworkInfoRow';
import { WalletState_UnsupportedNetworkBanner } from './WalletState_UnsupportedNetworkBanner';

interface WalletState_ConnectedCardProps {
  account: string;
  chainIdHex: string | null;
  chainIdDec: number | null;
  epoch: number;
  lastError: string | null;
  networkName: string;
  isSupported: boolean;
  isMainnet: boolean;
}

export function WalletState_ConnectedCard({
  account,
  chainIdHex,
  chainIdDec,
  epoch,
  lastError,
  networkName,
  isSupported,
  isMainnet,
}: WalletState_ConnectedCardProps) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-green-500/10 rounded-lg flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl">Wallet Connected</CardTitle>
            <CardDescription className="text-xs sm:text-sm truncate">
              {account.slice(0, 6)}...{account.slice(-4)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
        {/* Network Info */}
        {chainIdDec && (
          <WalletState_NetworkInfoRow
            networkName={networkName}
            isSupported={isSupported}
            isMainnet={isMainnet}
          />
        )}

        {/* Unsupported Network Warning */}
        {chainIdDec && !isSupported && (
          <WalletState_UnsupportedNetworkBanner />
        )}

        {/* Developer Details Accordion */}
        <Accordion title="Developer Details" defaultOpen={false}>
          <WalletState_DeveloperDetailsSection
            chainIdHex={chainIdHex}
            chainIdDec={chainIdDec}
            account={account}
            epoch={epoch}
            lastError={lastError}
          />
        </Accordion>
      </CardContent>
    </Card>
  );
}

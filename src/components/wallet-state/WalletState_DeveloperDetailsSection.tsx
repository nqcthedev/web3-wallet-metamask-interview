import { WalletState_CopyAddressButton } from './WalletState_CopyAddressButton';

interface WalletState_DeveloperDetailsSectionProps {
  chainIdHex: string | null;
  chainIdDec: number | null;
  account: string | null;
  epoch: number;
  lastError: string | null;
}

export function WalletState_DeveloperDetailsSection({
  chainIdHex,
  chainIdDec,
  account,
  epoch,
  lastError,
}: WalletState_DeveloperDetailsSectionProps) {
  return (
    <div className="space-y-2 text-xs font-mono overflow-hidden">
      {/* Chain ID (Hex) */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 min-w-0">
        <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">Chain ID (Hex):</span>
        <span className="text-slate-800 dark:text-slate-100 font-medium break-all sm:break-normal sm:truncate sm:text-right">{chainIdHex || 'N/A'}</span>
      </div>
      {/* Chain ID (Dec) */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 min-w-0">
        <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">Chain ID (Dec):</span>
        <span className="text-slate-800 dark:text-slate-100 font-medium break-all sm:break-normal sm:text-right">{chainIdDec !== null ? chainIdDec : 'N/A'}</span>
      </div>
      {/* Account */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 min-w-0">
        <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">Account:</span>
        {account ? (
          <div className="min-w-0 flex-1 sm:flex sm:justify-end">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-slate-800 dark:text-slate-100 font-medium break-all min-w-0 flex-1">{account}</span>
              <WalletState_CopyAddressButton address={account} />
            </div>
          </div>
        ) : (
          <span className="text-slate-800 dark:text-slate-100 font-medium">N/A</span>
        )}
      </div>
      {/* Epoch */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 min-w-0">
        <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">Epoch:</span>
        <span className="text-slate-800 dark:text-slate-100 font-medium break-all sm:break-normal sm:text-right">{epoch}</span>
      </div>
      {/* Last Error */}
      {lastError && (
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 min-w-0">
          <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">Last Error:</span>
          <span className="text-red-600 dark:text-red-400 break-words sm:text-right min-w-0 font-medium">{lastError}</span>
        </div>
      )}
    </div>
  );
}

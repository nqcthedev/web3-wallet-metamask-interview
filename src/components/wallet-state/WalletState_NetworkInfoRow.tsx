import { Badge } from '../ui/badge';

interface WalletState_NetworkInfoRowProps {
  networkName: string;
  isSupported: boolean;
  isMainnet: boolean;
}

export function WalletState_NetworkInfoRow({ networkName, isSupported, isMainnet }: WalletState_NetworkInfoRowProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/30 rounded-lg gap-2 border border-slate-200 dark:border-slate-700/50">
      <div className="min-w-0 flex-1">
        <div className="text-xs text-slate-600 dark:text-slate-500 mb-1">Network</div>
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
          {networkName}
        </div>
      </div>
      <Badge variant={isSupported ? (isMainnet ? 'success' : 'warning') : 'error'} className="flex-shrink-0 text-xs">
        {isSupported ? (isMainnet ? 'Mainnet' : 'Testnet') : 'Unsupported'}
      </Badge>
    </div>
  );
}

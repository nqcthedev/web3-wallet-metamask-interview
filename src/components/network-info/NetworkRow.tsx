import { Badge } from '../ui/badge';

interface NetworkRowProps {
  chainName: string;
  chainIdDec: number;
  isMainnet: boolean;
}

/**
 * Network Row - UI only
 * Displays network name, badge, and chain ID
 */
export function NetworkRow({ chainName, chainIdDec, isMainnet }: NetworkRowProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-300">Network:</span>
        <span className="text-sm font-semibold text-slate-100">{chainName}</span>
      </div>
      <Badge variant={isMainnet ? 'success' : 'warning'}>
        {isMainnet ? 'Mainnet' : 'Testnet'}
      </Badge>
      <span className="text-xs text-slate-500">(Chain ID: {chainIdDec})</span>
    </div>
  );
}

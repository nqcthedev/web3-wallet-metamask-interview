import { CopyableText } from '@/shared/ui/CopyableText';
import { shortAddress } from '@/utils';
import { Badge } from '../ui/badge';

interface TokenRowProps {
  tokenKey: string;
  tokenName: string;
  tokenIcon: string;
  balance: {
    value: string | null;
    status: 'ok' | 'na' | 'error';
    address: string | null;
  };
  loading: boolean;
}

/**
 * Token Row - UI only
 * Displays a single token balance row
 */
export function TokenRow({ tokenKey, tokenName, tokenIcon, balance, loading }: TokenRowProps) {
  const hasValue = balance.value !== null && balance.value !== undefined;
  const displayValue = hasValue && balance.value !== '—' ? balance.value : '—';

  return (
    <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-100 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-800/50 transition-colors">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {/* Token Icon */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
          {tokenIcon}
        </div>

        {/* Token Info - min-w-0 để prevent overflow */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">{tokenKey}</span>
            <Badge
              variant={
                balance.status === 'ok'
                  ? 'success'
                  : balance.status === 'na'
                  ? 'na'
                  : 'error'
              }
              className="text-xs flex-shrink-0"
            >
              {balance.status === 'ok' ? 'OK' : balance.status === 'na' ? 'N/A' : 'ERROR'}
            </Badge>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">{tokenName}</div>
        </div>

        {/* Balance - flex-shrink-0 để không bị compress */}
        <div className="text-right flex-shrink-0 ml-2 sm:ml-4 min-w-0">
          {loading ? (
            <div className="flex items-center gap-2 justify-end">
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Updating...</span>
            </div>
          ) : (
            <>
              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 break-words">{displayValue}</div>
              {balance.address && (
                <div className="mt-1 flex justify-end">
                  <CopyableText
                    text={balance.address}
                    displayText={shortAddress(balance.address)}
                    label="Contract address"
                    className="text-xs justify-end border-0 bg-transparent hover:bg-transparent p-0"
                  />
                </div>
              )}
              {balance.status === 'na' && (
                <div className="text-xs text-slate-500 italic mt-1">
                  N/A on this network
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

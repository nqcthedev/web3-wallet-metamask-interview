import { useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { useTokenBalancesStore } from '@/store/tokenBalances.store';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { EmptyState } from './EmptyState';
import { RefreshButton } from './RefreshButton';
import { TokenRow } from './TokenRow';

interface TokenBalancesListProps {
  account: string | null;
  chainId: number | null;
  epoch: number;
}

// Static tokens array - moved outside component to prevent recreation on each render
const TOKENS = [
  { key: 'USDC' as const, name: 'USD Coin', icon: '💵' },
  { key: 'USDT' as const, name: 'Tether USD', icon: '💵' },
] as const;

/**
 * Token Balances List - Production-grade token list UI
 * 
 * TẠI SAO TRÁNH NaN?
 * - NaN xuất hiện khi parse số không hợp lệ hoặc tính toán sai
 * - Luôn validate và format đúng: nếu balance null/undefined => hiển thị "—" hoặc "0"
 * - Tránh confusion cho user: số dư phải luôn là số hợp lệ hoặc placeholder rõ ràng
 * 
 * TẠI SAO BALANCES REFRESH KHI ĐỔI ACCOUNT/CHAIN?
 * - Khi user switch account trong MetaMask => số dư token khác nhau
 * - Khi user switch network => token addresses khác nhau, cần query lại
 * - Auto-refresh đảm bảo UI luôn sync với MetaMask state
 * - Không cần user phải click Refresh button mỗi lần đổi
 */
export function TokenBalancesList({ account, chainId, epoch }: TokenBalancesListProps) {
  const { balances, loading, lastUpdated, fetchBalances } = useTokenBalancesStore();

  // Tự động refetch khi account hoặc chainId thay đổi
  // TẠI SAO CẦN AUTO-REFRESH?
  // - Khi user switch account/network trong MetaMask, balances phải update ngay
  // - useEffect với dependencies [account, chainId, epoch] sẽ trigger fetch tự động
  // - Không toast ở đây để tránh spam (chỉ toast khi manual refresh)
  // Note: fetchBalances từ Zustand store is stable, but we include it for completeness
  useEffect(() => {
    if (account && chainId) {
      fetchBalances({ account, chainId, epoch, isManualRefresh: false });
    }
  }, [account, chainId, epoch, fetchBalances]);

  // Manual refresh button - memoized to prevent unnecessary re-renders
  const handleRefresh = useCallback(() => {
    if (!account || !chainId) return;
    fetchBalances({ account, chainId, epoch, isManualRefresh: true });
    toast.info('Refreshing balances...');
  }, [account, chainId, epoch, fetchBalances]);

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        {/* Responsive header: stack on mobile, row on sm+ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-purple-500/10 rounded-lg flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg sm:text-xl">Token Balances</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                USDC and USDT balances for your account
              </CardDescription>
            </div>
          </div>
          {account && chainId && (
            <RefreshButton loading={loading} onRefresh={handleRefresh} />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        {!account || !chainId ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {TOKENS.map((token) => {
              const balance = balances[token.key];
              return (
                <TokenRow
                  key={token.key}
                  tokenKey={token.key}
                  tokenName={token.name}
                  tokenIcon={token.icon}
                  balance={balance}
                  loading={loading}
                />
              );
            })}

            {/* Last Updated */}
            {lastUpdated && !loading && (
              <div className="text-xs text-slate-600 dark:text-slate-500 text-center pt-2">
                Last updated: {new Date(lastUpdated).toLocaleTimeString()}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

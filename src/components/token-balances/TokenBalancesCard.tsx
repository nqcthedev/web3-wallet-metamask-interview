import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { NetworkInfo } from '@/components/network-info';
import { isSupportedChain } from '@/config/chains';
import { useWalletStore } from '@/store';
import { shortAddress } from '@/utils';
import { useTokenBalancesStore } from '@/store/tokenBalances.store';

export function TokenBalancesCard() {
  const { account, chainIdDec, epoch } = useWalletStore();
  const { balances, loading, error, lastUpdated, fetchBalances, reset } = useTokenBalancesStore();

  // Trigger fetch when account, chainId, or epoch changes
  useEffect(() => {
    if (account && chainIdDec) {
      fetchBalances({ account, chainId: chainIdDec, epoch });
    } else {
      // Reset balances when disconnected
      reset();
    }
  }, [account, chainIdDec, epoch, fetchBalances, reset]);

  // Show card even when not connected (but with empty state)
  // This ensures UI is visible immediately after connect
  return (
    <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/60">
      <CardHeader>
        <CardTitle className="text-slate-100">Token Balances</CardTitle>
        <CardDescription className="text-slate-400">
          USDC and USDT balances for current account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Network Info */}
        {chainIdDec && <NetworkInfo />}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Not Connected State */}
        {(!account || !chainIdDec) && (
          <div className="text-center py-8 text-slate-400">
            <p>Connect your wallet to view token balances</p>
          </div>
        )}

        {/* Unsupported Network Warning */}
        {chainIdDec && !isSupportedChain(chainIdDec) && account && (
          <div className="text-center py-8 text-slate-400">
            <p>Switch to a supported network to view token balances</p>
          </div>
        )}

        {/* Token Cards */}
        {account && chainIdDec && isSupportedChain(chainIdDec) && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* USDC Card */}
              <TokenCard
                tokenKey="USDC"
                balance={balances.USDC}
                loading={loading}
                chainId={chainIdDec}
              />

              {/* USDT Card */}
              <TokenCard
                tokenKey="USDT"
                balance={balances.USDT}
                loading={loading}
                chainId={chainIdDec}
              />
            </div>

            {/* Last Updated Timestamp */}
            {lastUpdated && (
              <div className="text-xs text-slate-500 text-center mt-4">
                Last updated: {new Date(lastUpdated).toLocaleTimeString()}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface TokenCardProps {
  tokenKey: 'USDC' | 'USDT';
  balance: {
    address: string | null;
    value: string | null;
    status: 'ok' | 'na' | 'error';
    decimals?: number;
  };
  loading: boolean;
  chainId: number;
}

function TokenCard({ tokenKey, balance, loading, chainId }: TokenCardProps) {
  const tokenName = tokenKey === 'USDC' ? 'USD Coin' : 'Tether USD';

  // Map status to badge variant
  const badgeVariant = 
    balance.status === 'ok' ? 'success' :
    balance.status === 'na' ? 'na' :
    'error';

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">{tokenKey}</h3>
            <p className="text-sm text-slate-400">{tokenName}</p>
          </div>
          <Badge variant={badgeVariant}>
            {balance.status === 'ok' ? 'OK' : balance.status === 'na' ? 'N/A' : 'ERROR'}
          </Badge>
        </div>

        {/* Balance */}
        <div className="mb-4">
          <div className="text-sm text-slate-500 mb-1">Balance</div>
          {loading ? (
            <div className="h-8 bg-slate-700/50 rounded animate-pulse" />
          ) : (
            <div className="text-2xl font-bold text-slate-100">
              {balance.value || 'N/A'}
            </div>
          )}
        </div>

        {/* Contract Address */}
        {balance.address ? (
          <div>
            <div className="text-xs text-slate-500 mb-1">Contract Address</div>
            <div className="text-xs font-mono text-slate-300 break-all">
              {shortAddress(balance.address)}
            </div>
          </div>
        ) : balance.status === 'na' ? (
          <div className="text-xs text-slate-500 italic">
            N/A on this network (Chain ID: {chainId})
          </div>
        ) : (
          <div className="text-xs text-slate-500">—</div>
        )}
      </CardContent>
    </Card>
  );
}

import { WalletBootstrap } from './providers/WalletBootstrap';
import { Header } from '@/components/header/Header';
import { WalletStateCard } from '@/components/wallet-state';
import { TokenBalancesList } from '@/components/token-balances';
import { CustomTokenBalanceCard } from '@/components/custom-token/CustomTokenBalanceCard';
import { useWalletStore } from '@/store';
import { useSoftRefresh } from '@/hooks';
import { useTheme } from '@/hooks';

/**
 * App Shell - Production-grade Web3 dashboard layout
 * Background với gradient glow blobs để tạo depth nhưng vẫn đảm bảo text readability
 */
function App() {
  // Apply theme globally - hook runs on mount to initialize theme
  useTheme();
  
  const { account, chainIdDec, epoch } = useWalletStore();

  // Build refresh key from account + chainId to trigger animation on changes
  const refreshKey = `${account ?? 'no-account'}-${chainIdDec ?? 'no-chain'}`;
  const { animating } = useSoftRefresh(refreshKey, 200);

  return (
    <>
      <WalletBootstrap />
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 relative overflow-hidden transition-colors">
        {/* Gradient Glow Blobs - Tạo depth nhưng không làm mất readability */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <Header />

        {/* Main Content - Centered container với responsive padding */}
        <main className={`relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 transition-all duration-200 ease-out ${animating ? 'opacity-60 translate-y-[2px]' : 'opacity-100 translate-y-0'}`}>
          <div className="space-y-4 sm:space-y-6">
            {/* Wallet State Card */}
            <WalletStateCard />

            {/* Token Balances List */}
            <TokenBalancesList account={account} chainId={chainIdDec} epoch={epoch} />

            {/* Custom Token Balance Card */}
            <CustomTokenBalanceCard />
          </div>
        </main>
      </div>
    </>
  );
}

export default App;

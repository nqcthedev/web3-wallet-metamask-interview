import { getChainById } from '@/config/chains';
import { useWalletStore } from '@/store';
import { shortAddress } from '@/utils';
import { HeaderBrand } from './HeaderBrand';
import { ThemeMenu } from './ThemeMenu';
import { WalletMenu } from './WalletMenu';

/**
 * Header - Main header component
 * Composes Brand, WalletMenu, and ThemeMenu
 */
export function Header() {
  const { installed, status, account, chainIdDec, connect, disconnectLocal } = useWalletStore();
  const chain = chainIdDec ? getChainById(chainIdDec) ?? null : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: App Icon + Title + Beta */}
          <HeaderBrand />

          {/* Right: Wallet Menu + Theme Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <WalletMenu
              installed={installed}
              status={status}
              account={account}
              chain={chain}
              connect={connect}
              disconnectLocal={disconnectLocal}
              shortAddress={shortAddress}
            />
            <ThemeMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

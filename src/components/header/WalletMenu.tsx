import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { useClickOutside } from './useClickOutside';

interface WalletMenuProps {
  installed: boolean;
  status: 'idle' | 'connecting' | 'connected' | 'error';
  account: string | null;
  chain: { blockExplorerUrl?: string } | null | undefined;
  connect: () => void;
  disconnectLocal: () => void;
  shortAddress: (address: string) => string;
}

/**
 * Wallet Menu - Wallet connect button + dropdown (copy/explorer/disconnect)
 * Handles wallet connection state and dropdown menu
 */
export function WalletMenu({
  installed,
  status,
  account,
  chain,
  connect,
  disconnectLocal,
  shortAddress,
}: WalletMenuProps) {
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const walletMenuRef = useRef<HTMLDivElement>(null);
  const isConnected = status === 'connected';

  // Close dropdown when clicking outside
  useClickOutside(walletMenuRef, () => setWalletMenuOpen(false), walletMenuOpen);

  // Copy address handler
  const handleCopyAddress = async () => {
    if (!account) return;
    try {
      await navigator.clipboard.writeText(account);
      toast.success('Copied address');
      setWalletMenuOpen(false);
    } catch (error) {
      toast.error('Copy failed');
    }
  };

  // Explorer link handler
  const handleExplorerLink = () => {
    if (!account || !chain?.blockExplorerUrl) {
      toast.info('Explorer not configured for this network');
      return;
    }
    window.open(`${chain.blockExplorerUrl}/address/${account}`, '_blank');
    setWalletMenuOpen(false);
  };

  // Disconnect handler
  const handleDisconnect = () => {
    disconnectLocal();
    setWalletMenuOpen(false);
  };

  if (!installed) {
    return (
      <Button
        onClick={() => window.open('https://metamask.io/', '_blank')}
        variant="outline"
        size="sm"
        className="shrink-0"
      >
        Install MetaMask
      </Button>
    );
  }

  if (isConnected && account) {
    return (
      <div className="relative" ref={walletMenuRef}>
        <button
          onClick={() => setWalletMenuOpen(!walletMenuOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors shrink-0 h-9 sm:h-10"
        >
          <span className="text-sm font-mono">{shortAddress(account)}</span>
          <svg
            className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform ${
              walletMenuOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Wallet Dropdown Menu */}
        {walletMenuOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/95 backdrop-blur-xl shadow-lg z-50 overflow-hidden">
            {/* Full Address */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700/50">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Connected Wallet</div>
              <div className="text-sm font-mono text-slate-900 dark:text-slate-100 break-all select-text">
                {account}
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {/* Copy Address */}
              <button
                onClick={handleCopyAddress}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy address</span>
              </button>

              {/* View on Explorer */}
              <button
                onClick={handleExplorerLink}
                disabled={!chain?.blockExplorerUrl}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title={!chain?.blockExplorerUrl ? 'Explorer not configured' : 'View on explorer'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>View on explorer</span>
              </button>

              {/* Disconnect */}
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button onClick={connect} disabled={status === 'connecting'} size="sm" className="shrink-0">
      {status === 'connecting' ? 'Connecting...' : 'Connect'}
    </Button>
  );
}

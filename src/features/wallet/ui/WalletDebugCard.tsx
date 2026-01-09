import { shortAddress } from '@/utils';
import { useWalletStore } from '@/store';
import { WalletActions } from './WalletActions';

export function WalletDebugCard() {
  const {
    installed,
    status,
    account,
    accounts,
    chainIdHex,
    chainIdDec,
    epoch,
    lastError,
  } = useWalletStore();

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Web3 Wallet Debug
            </h1>
            <p className="text-slate-400">MetaMask Integration with Zustand</p>
          </div>

          {/* MetaMask Not Installed */}
          {!installed && (
            <div className="text-center py-12">
              <div className="mb-4">
                <div className="inline-block p-4 bg-yellow-500/10 rounded-full">
                  <svg
                    className="w-16 h-16 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-slate-100 mb-2">
                MetaMask Not Installed
              </h2>
              <p className="text-slate-400 mb-6">
                Please install MetaMask to use this wallet
              </p>
              <a
                href="https://metamask.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Install MetaMask
              </a>
            </div>
          )}

          {/* Wallet State */}
          {installed && (
            <div className="space-y-6">
              {/* Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="text-sm text-slate-500 mb-1">MetaMask Installed</div>
                  <div className="text-xl font-semibold text-green-400">✅ Yes</div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="text-sm text-slate-500 mb-1">Status</div>
                  <div className="text-xl font-semibold text-slate-100 capitalize">{status}</div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="text-sm text-slate-500 mb-1">Account (Short)</div>
                  <div className="text-xl font-semibold text-slate-100 font-mono">
                    {shortAddress(account)}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="text-sm text-slate-500 mb-1">Account (Full)</div>
                  <div className="text-sm font-mono text-slate-100 break-all">
                    {account || 'N/A'}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="text-sm text-slate-500 mb-1">Chain ID (Hex)</div>
                  <div className="text-xl font-semibold text-slate-100 font-mono">
                    {chainIdHex || 'N/A'}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="text-sm text-slate-500 mb-1">Chain ID (Decimal)</div>
                  <div className="text-xl font-semibold text-slate-100">
                    {chainIdDec !== null ? chainIdDec : 'N/A'}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="text-sm text-slate-500 mb-1">Accounts Count</div>
                  <div className="text-xl font-semibold text-slate-100">{accounts.length}</div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="text-sm text-slate-500 mb-1">Epoch</div>
                  <div className="text-xl font-semibold text-blue-400">{epoch}</div>
                </div>
              </div>

              {/* Error Message */}
              {lastError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      className="w-5 h-5 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-semibold text-red-400">Error</span>
                  </div>
                  <p className="text-red-300 text-sm">{lastError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-slate-700/50">
                <WalletActions />
              </div>
            </div>
          )}
        </div>
  );
}

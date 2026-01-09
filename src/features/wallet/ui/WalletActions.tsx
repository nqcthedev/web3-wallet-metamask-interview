import { shortAddress } from '@/utils';
import { useWalletStore } from '@/store';

export function WalletActions() {
  const { 
    installed, 
    status, 
    account,
    chainIdHex,
    connect, 
    sync, 
    disconnectLocal, 
    clearError, 
    lastError 
  } = useWalletStore();

  return (
    <div className="space-y-4">
      {/* MetaMask Detection Status */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500">MetaMask Status</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            installed 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {installed ? 'Installed' : 'Not Installed'}
          </span>
        </div>
        {!installed && (
          <p className="text-xs text-slate-400 mt-2">
            Please install MetaMask
          </p>
        )}
      </div>

      {/* Connection Status */}
      {installed && (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Connection Status</span>
              <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                status === 'connected' 
                  ? 'bg-green-500/20 text-green-400'
                  : status === 'connecting'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : status === 'error'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-slate-500/20 text-slate-400'
              }`}>
                {status}
              </span>
            </div>
            
            {account && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Account</span>
                  <span className="text-sm font-mono text-slate-100">
                    {shortAddress(account)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Full Address</span>
                  <span className="text-xs font-mono text-slate-300 break-all text-right">
                    {account}
                  </span>
                </div>
              </>
            )}
            
            {chainIdHex && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Chain ID</span>
                <span className="text-sm font-mono text-slate-100">
                  {chainIdHex}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {lastError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-red-400">{lastError}</span>
            <button
              onClick={clearError}
              className="text-xs text-red-300 hover:text-red-200 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={connect}
          disabled={!installed || status === 'connecting'}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'connecting' ? 'Connecting...' : 'Connect MetaMask'}
        </button>

        <button
          onClick={sync}
          disabled={!installed}
          className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sync Now
        </button>

        <button
          onClick={disconnectLocal}
          disabled={!installed || status === 'idle'}
          className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}

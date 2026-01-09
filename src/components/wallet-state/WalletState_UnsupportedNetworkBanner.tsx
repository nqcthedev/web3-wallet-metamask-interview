export function WalletState_UnsupportedNetworkBanner() {
  return (
    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
      <div className="flex items-start gap-2">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="flex-1 min-w-0">
          <div className="text-xs sm:text-sm font-medium text-yellow-400 mb-1">Unsupported Network</div>
          <div className="text-xs text-yellow-300">
            Please switch to: <strong>Ethereum</strong> (Mainnet/Sepolia), <strong>BNB Chain</strong> (Mainnet/Testnet), or <strong>Base</strong> (Mainnet/Sepolia).
          </div>
        </div>
      </div>
    </div>
  );
}

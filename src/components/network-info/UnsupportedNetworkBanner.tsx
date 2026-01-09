interface UnsupportedNetworkBannerProps {
  chainIdDec: number;
}

/**
 * Unsupported Network Banner - UI only
 * Displays warning when network is not supported
 */
export function UnsupportedNetworkBanner({ chainIdDec }: UnsupportedNetworkBannerProps) {
  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <svg
          className="w-5 h-5 text-yellow-400"
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
        <h3 className="font-semibold text-yellow-400">Unsupported Network</h3>
      </div>
      <p className="text-sm text-yellow-300 mb-2">
        Current network (Chain ID: {chainIdDec}) is not supported.
      </p>
      <p className="text-sm text-yellow-200">
        Please switch to: <strong>Ethereum</strong> (Mainnet/Sepolia), <strong>BNB Chain</strong> (Mainnet/Testnet), or <strong>Base</strong> (Mainnet/Sepolia).
      </p>
    </div>
  );
}

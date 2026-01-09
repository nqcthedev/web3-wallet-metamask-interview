import { getChainById, isSupportedChain } from '@/config/chains';
import { useWalletStore } from '@/store';
import { WalletState_ConnectedCard } from './WalletState_ConnectedCard';
import { WalletState_ConnectingCard } from './WalletState_ConnectingCard';
import { WalletState_DisconnectedCard } from './WalletState_DisconnectedCard';
import { WalletState_ErrorCard } from './WalletState_ErrorCard';
import { WalletState_NotInstalledCard } from './WalletState_NotInstalledCard';

/**
 * Wallet State Card - Hiển thị trạng thái wallet với UX rõ ràng
 * 
 * This component orchestrates wallet state display by:
 * 1. Reading wallet state from store
 * 2. Computing derived values (chain info, support status)
 * 3. Rendering appropriate state-specific UI component
 * 
 * All wallet logic stays here; child components are presentational only.
 */
export function WalletStateCard() {
  const {
    installed,
    status,
    account,
    chainIdHex,
    chainIdDec,
    epoch,
    lastError,
    connect,
    clearError,
  } = useWalletStore();

  // Compute derived values
  const chain = chainIdDec ? getChainById(chainIdDec) : null;
  const isSupported = isSupportedChain(chainIdDec);
  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';
  const hasError = status === 'error';

  // Compute network name for display
  const networkName = chain
    ? `${chain.name} ${chain.env === 'mainnet' ? 'Mainnet' : 'Testnet'}`
    : 'Unknown';

  // State 1: MetaMask Not Installed
  if (!installed) {
    return (
      <WalletState_NotInstalledCard
        onInstallClick={() => window.open('https://metamask.io/', '_blank')}
      />
    );
  }

  // State 2: Disconnected
  if (!isConnected && !isConnecting && !hasError) {
    return (
      <WalletState_DisconnectedCard
        isConnecting={isConnecting}
        onConnect={connect}
      />
    );
  }

  // State 3: Connecting
  if (isConnecting) {
    return <WalletState_ConnectingCard />;
  }

  // State 4: Connected
  if (isConnected && account) {
    return (
      <WalletState_ConnectedCard
        account={account}
        chainIdHex={chainIdHex}
        chainIdDec={chainIdDec}
        epoch={epoch}
        lastError={lastError}
        networkName={networkName}
        isSupported={isSupported}
        isMainnet={chain?.env === 'mainnet'}
      />
    );
  }

  // State 5: Error
  if (hasError && lastError) {
    return (
      <WalletState_ErrorCard
        error={lastError}
        onRetry={connect}
        onDismiss={clearError}
      />
    );
  }

  return null;
}

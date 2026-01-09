import { getChainById, isSupportedChain } from '@/config/chains';
import { useWalletStore } from '@/store';
import { NetworkRow } from './NetworkRow';
import { UnsupportedNetworkBanner } from './UnsupportedNetworkBanner';

export function NetworkInfo() {
  const { chainIdDec } = useWalletStore();
  const chain = chainIdDec ? getChainById(chainIdDec) : null;
  const isSupported = isSupportedChain(chainIdDec);

  if (!chainIdDec) {
    return null;
  }

  if (!isSupported) {
    return <UnsupportedNetworkBanner chainIdDec={chainIdDec} />;
  }

  return (
    <NetworkRow
      chainName={chain?.name || 'Unknown'}
      chainIdDec={chainIdDec}
      isMainnet={chain?.env === 'mainnet'}
    />
  );
}

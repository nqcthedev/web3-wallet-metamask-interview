import { toast } from 'sonner';

interface WalletState_CopyAddressButtonProps {
  address: string;
}

export function WalletState_CopyAddressButton({ address }: WalletState_CopyAddressButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success('Copied address');
    } catch (error) {
      toast.error('Copy failed');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700/50 rounded transition-colors flex-shrink-0 cursor-pointer"
      title="Copy address"
      aria-label="Copy address"
    >
      <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    </button>
  );
}

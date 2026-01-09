import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useWalletStore } from '@/store';
import { shortAddress } from '@/utils';
import { isValidEthereumAddress } from '@/utils';
import { CopyableText } from '@/shared/ui/CopyableText';
import { useCustomTokenBalanceStore } from '@/store/customTokenBalance.store';

/**
 * Custom Token Balance Card - Manual query only
 * Token balance is queried ONLY when user clicks "Check Balance" or presses Enter.
 */
export function CustomTokenBalanceCard() {
  const { account } = useWalletStore();
  const {
    contractAddress,
    loading,
    balance,
    decimals,
    error,
    setContractAddress,
    checkBalance,
    reset,
  } = useCustomTokenBalanceStore();

  const [inputValue, setInputValue] = useState(contractAddress);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setContractAddress(value);
    // Clear errors when user types
    if (error) {
      useCustomTokenBalanceStore.setState({ error: null });
    }
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleCheckBalance = () => {
    if (!account) {
      return;
    }

    const trimmedAddress = inputValue.trim();
    
    if (!trimmedAddress) {
      setValidationError('Please enter a contract address');
      return;
    }

    if (!isValidEthereumAddress(trimmedAddress)) {
      setValidationError('Invalid Ethereum address format');
      return;
    }

    setValidationError(null);
    checkBalance(account, true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      handleCheckBalance();
    }
  };

  const handleReset = () => {
    setInputValue('');
    reset();
  };

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-indigo-500/10 rounded-lg flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg sm:text-xl">Custom Token Balance</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Check ERC-20 token balance by contract address
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        {/* Not Connected State */}
        {!account && (
          <div className="text-center py-6 sm:py-8 px-4 border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-lg bg-slate-50/50 dark:bg-slate-800/20 opacity-75 cursor-default">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">Connect your wallet to check ERC-20 balances.</p>
            </div>
          </div>
        )}

        {/* Connected State */}
        {account && (
          <div className="space-y-3 sm:space-y-4">
            {/* Input Section - Responsive: full width on mobile */}
            <div className="space-y-2">
              <label htmlFor="token-address" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                Token Contract Address
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="token-address"
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="0x..."
                  className="flex-1 w-full px-3 sm:px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 font-mono text-xs sm:text-sm min-w-0 dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-slate-100 dark:placeholder-slate-500"
                  disabled={loading}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCheckBalance}
                    disabled={loading || !inputValue.trim()}
                    className="flex-1 sm:flex-initial px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {loading ? 'Checking...' : 'Check Balance'}
                  </button>
                  {(balance !== null || error) && (
                    <button
                      onClick={handleReset}
                      className="px-3 sm:px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-500">
                Enter a valid ERC-20 token contract address (0x...)
              </p>
              {/* Inline Validation Error */}
              {validationError && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {validationError}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0"
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
                  <span className="font-semibold text-red-400 text-xs sm:text-sm">Error</span>
                </div>
                <p className="text-red-300 text-xs sm:text-sm break-words">{error}</p>
              </div>
            )}

            {/* Balance Result */}
            {balance !== null && !error && (
              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 sm:p-6 border border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">Token Balance</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">Contract: {shortAddress(contractAddress)}</p>
                  </div>
                  <Badge variant="success" className="flex-shrink-0 text-xs">OK</Badge>
                </div>

                {/* Balance Display */}
                <div className="mb-3 sm:mb-4">
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-500 mb-1">Balance</div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 break-words">{balance}</div>
                  {decimals !== null && (
                    <div className="text-xs text-slate-600 dark:text-slate-500 mt-1">Decimals: {decimals}</div>
                  )}
                </div>

                {/* Contract Address */}
                <div className="min-w-0">
                  <div className="text-xs text-slate-600 dark:text-slate-500 mb-1">Contract Address</div>
                  <CopyableText
                    text={contractAddress}
                    label="Contract address"
                    className="text-xs justify-start"
                  />
                </div>

                {/* Info about balance = 0 */}
                {balance === '0' && (
                  <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-xs text-blue-300">
                      <strong>Note:</strong> Balance is 0. This means your wallet has not received any tokens from this contract. This is normal if you haven't received tokens yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6 border border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-slate-700 dark:text-slate-300">Fetching token balance...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

# Web3 Wallet – MetaMask Integration

Production-ready React + Web3 wallet integration using MetaMask, focusing on correct EIP-1193 behavior, robust state management, and real-world MetaMask edge cases.

## Tech Stack

- **React 18** (Vite)
- **TypeScript**
- **Tailwind CSS v4** (@tailwindcss/vite)
- **Zustand** (state management)
- **web3.js v4**

**Note:** This project explicitly does NOT use wagmi or ethers.js. All Web3 interactions are implemented directly using web3.js and EIP-1193 provider interface.

## Project Structure

```
src/
  app/
    App.tsx
    main.tsx
    providers/
      WalletBootstrap.tsx
  features/
    wallet/
      api/
        walletApi.ts
      core/
        getProvider.ts
        events.ts
        sync.ts
      model/
        types.ts
        wallet.store.ts
      ui/
        WalletDebugCard.tsx
        WalletActions.tsx
  shared/
    lib/
      format.ts
  styles/
    globals.css
```

## Features

- **MetaMask detection**: Automatic detection of MetaMask extension
- **Wallet connect**: Standard `eth_requestAccounts` flow with proper error handling
- **Read wallet state without popup**: Uses `eth_chainId` and `eth_accounts` (non-interactive methods)
- **Multi-account support**: Handles account switching via `accountsChanged` event
- **Network change handling**: EIP-1193 `chainChanged` event listener
- **Fallback sync**: Window focus and document visibility change handlers to catch network changes when MetaMask doesn't emit events
- **Zustand single source of truth**: All components subscribe to the same store, ensuring UI consistency
- **Clean UI with Tailwind**: Modern, responsive interface with dark/light theme support

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Acceptance Criteria

- **Initial load**: App reads and displays current chainId without requiring user interaction
- **Connect**: Clicking connect shows account address and network information
- **Network switching**: Switching network in MetaMask extension updates UI immediately
- **Fallback sync**: If MetaMask does not emit `chainChanged` event, switching browser tabs or window focus triggers fallback sync to update UI
- **No disconnect/reconnect required**: UI stays in sync with MetaMask state without manual reconnection

## Key Design Decisions

1. **EIP-1193 events first**: Primary mechanism for detecting wallet changes. Listens to `accountsChanged` and `chainChanged` events.

2. **Fallback sync**: MetaMask does not always emit `chainChanged` events (e.g., when switching networks via extension dropdown). Fallback sync on window focus and document visibility change ensures UI remains accurate.

3. **Zustand as single source of truth**: All components subscribe to the same Zustand store. When state changes, all subscribers re-render automatically, preventing stale UI.

4. **Local disconnect only**: MetaMask does not support programmatic disconnect. The app only clears local state; users must disconnect from MetaMask extension directly.

## Non-Goals

- No wagmi library
- No ethers.js library
- No forced network switching UI (users switch networks via MetaMask)
- No backend server required

## Notes for Reviewers

This implementation emphasizes real-world MetaMask behavior and defensive handling of edge cases:

- **Event reliability**: MetaMask events are not guaranteed. The fallback sync mechanism ensures UI accuracy even when events fail to fire.

- **State synchronization**: Epoch-based tracking prevents race conditions when multiple state updates occur rapidly.

- **Error handling**: Distinguishes between user rejection (4001) and technical errors, providing appropriate feedback.

- **Clean architecture**: Feature-based structure with clear separation of concerns (api, core, model, ui).

- **Extensibility**: Architecture supports adding additional wallet providers or features without major refactoring.

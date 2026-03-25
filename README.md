# ShiftFlow Arc Edition

ShiftFlow Arc Edition is a premium dark, bridge-style MVP that now uses **Arc Testnet for the final onchain step**.

## What is real in this version

- MetaMask / Rabby wallet connection
- Arc Testnet network switching
- Live transaction on Arc
- Mint through your deployed GiftArc contract
- Arc explorer link after completion

## What is still mocked

- Email magic link auth
- Quote engine
- Bridge routing backend
- Cross-chain attestation logic

## Required environment variables

Create `.env.local`:

```bash
NEXT_PUBLIC_APP_NAME=ShiftFlow
NEXT_PUBLIC_DEFAULT_SOURCE_CHAIN=base
NEXT_PUBLIC_DEFAULT_DEST_CHAIN=arc
NEXT_PUBLIC_ARC_CHAIN_ID=5042002
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_EXPLORER_URL=https://testnet.arcscan.app
NEXT_PUBLIC_ARC_NETWORK_NAME=Arc Testnet
NEXT_PUBLIC_GIFTARC_CONTRACT=0x92Bd737bA6b7401c79bF9DD79991E4ABe27ddc85
```

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`

## Notes

- Do **not** put private keys in this frontend app.
- The wallet signs directly in MetaMask or Rabby.
- The final transfer action mints a receipt-style NFT on Arc through the existing GiftArc contract.

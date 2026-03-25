export const ARC_NETWORK = {
  chainIdHex: "0x4cef52",
  chainIdDec: 5042002,
  chainName: process.env.NEXT_PUBLIC_ARC_NETWORK_NAME || "Arc Testnet",
  rpcUrls: [process.env.NEXT_PUBLIC_ARC_RPC_URL || "https://rpc.testnet.arc.network"],
  blockExplorerUrls: [process.env.NEXT_PUBLIC_ARC_EXPLORER_URL || "https://testnet.arcscan.app"],
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 6
  }
} as const;

export const GIFTARC_CONTRACT = process.env.NEXT_PUBLIC_GIFTARC_CONTRACT || "";

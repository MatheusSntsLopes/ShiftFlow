export type ChainKey = "arc" | "base" | "arbitrum" | "ethereum";

export type ChainInfo = {
  key: ChainKey;
  name: string;
  symbol: string;
  accent: string;
  description: string;
};

export type QuoteResponse = {
  sourceChain: ChainKey;
  destinationChain: ChainKey;
  asset: "USDC";
  amount: number;
  estimatedReceive: number;
  fee: number;
  eta: string;
  routeLabel: string;
};

export type TransferRequest = {
  email: string;
  sourceChain: ChainKey;
  destinationChain: ChainKey;
  amount: number;
  designName?: string;
};

export type TransferStatus =
  | "wallet_ready"
  | "approval_pending"
  | "bridging"
  | "attesting"
  | "minting"
  | "completed";

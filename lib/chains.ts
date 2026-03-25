import type { ChainInfo } from "./types";

export const CHAINS: ChainInfo[] = [
  {
    key: "base",
    name: "Base",
    symbol: "BASE",
    accent: "#4f7cff",
    description: "Fast source chain for deposits"
  },
  {
    key: "arc",
    name: "Arc",
    symbol: "ARC",
    accent: "#19d29d",
    description: "Destination chain optimized for spending"
  },
  {
    key: "arbitrum",
    name: "Arbitrum",
    symbol: "ARB",
    accent: "#70b8ff",
    description: "High-throughput route option"
  },
  {
    key: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    accent: "#8b93ff",
    description: "Main settlement route"
  }
];

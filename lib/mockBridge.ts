import type { QuoteResponse, TransferRequest, TransferStatus } from "./types";

export async function getMockQuote(req: TransferRequest): Promise<QuoteResponse> {
  const fee = Math.max(0.35, req.amount * 0.0035);
  return {
    sourceChain: req.sourceChain,
    destinationChain: req.destinationChain,
    asset: "USDC",
    amount: req.amount,
    estimatedReceive: Number((req.amount - fee).toFixed(2)),
    fee: Number(fee.toFixed(2)),
    eta: "~2-5 min",
    routeLabel: req.destinationChain === "arc" ? "Arc settlement route" : "Email-first USDC route"
  };
}

export async function simulateTransferProgress(
  onUpdate: (status: TransferStatus) => void,
  arcMode = false
) {
  const steps: TransferStatus[] = [
    "wallet_ready",
    "approval_pending",
    "bridging",
    "attesting",
    arcMode ? "minting" : "minting"
  ];

  for (const step of steps) {
    onUpdate(step);
    await new Promise((r) => setTimeout(r, 700));
  }
}

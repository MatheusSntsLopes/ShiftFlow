"use client";

import { Header } from "@/components/Header";
import { TransferForm } from "@/components/TransferForm";
import { Container } from "@/components/ui";
import { ArcStatusCard } from "@/components/ArcStatusCard";
import type { QuoteResponse, TransferRequest, TransferStatus } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { simulateTransferProgress } from "@/lib/mockBridge";
import { useArcWallet } from "@/components/ArcWalletProvider";
import { SHIFT_DESIGNS } from "@/lib/designs";
import { getGiftArcWriteContract } from "@/lib/giftarc";
import { ARC_NETWORK } from "@/lib/arc";

export default function DashboardPage() {
  const params = useSearchParams();
  const email = params.get("email") || "demo@shiftflow.app";
  const { provider } = useArcWallet();

  async function handleQuote(req: TransferRequest): Promise<QuoteResponse> {
    const res = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req)
    });

    if (!res.ok) throw new Error("quote failed");
    return res.json();
  }

  async function handleTransfer(
    req: TransferRequest,
    onProgress: (status: TransferStatus) => void
  ) {
    if (!provider) throw new Error("Wallet provider missing");

    await simulateTransferProgress(onProgress, true);

    const design = SHIFT_DESIGNS[Math.min(2, Math.max(0, Math.floor(req.amount / 100)))];
    const contract = await getGiftArcWriteContract(provider);
    const mintFee = await contract.mintFee();
    const tx = await contract.mintGift(
      design.rarity,
      Math.max(1, Math.round(req.amount)),
      design.id,
      design.imageURI,
      `ShiftFlow receipt for ${req.email}`,
      { value: mintFee }
    );
    const receipt = await tx.wait();

    let tokenId: string | null = null;
    const log = receipt?.logs?.find((entry: any) => entry?.fragment?.name === "GiftMinted");
    if (log?.args?.[1] !== undefined) {
      tokenId = String(log.args[1]);
    }

    onProgress("completed");
    const parsedTokenId: string | number | undefined = undefined;
    return {
      hash: tx.hash,
      explorerUrl: `${process.env.NEXT_PUBLIC_ARC_EXPLORER_URL || ARC_NETWORK.blockExplorerUrls[0]}/tx/${tx.hash}`,
     tokenId: parsedTokenId ? parsedTokenId : undefined
    };
  }

  return (
    <main className="min-h-screen bg-[#535353] text-white">
      <Header />
      <section className="py-14">
        <Container>
          <div className="mb-8">
            <div className="text-sm uppercase tracking-[0.18em] text-white/35">Dashboard</div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">Arc-first settlement flow</h1>
            <p className="mt-3 max-w-2xl text-white/55">
              This version still uses a clean bridge-style quote experience, but the final action is no longer fake: it connects your wallet, switches to Arc Testnet, and mints a live GiftArc NFT as the transfer receipt.
            </p>
          </div>
          <div className="mb-6">
            <ArcStatusCard />
          </div>
          <TransferForm email={email} onQuote={handleQuote} onTransfer={handleTransfer} />
        </Container>
      </section>
    </main>
  );
}

"use client";

import { Header } from "@/components/Header";
import { TransferForm } from "@/components/TransferForm";
import { Container } from "@/components/ui";
import { ARC_NETWORK } from "@/lib/arc";
import { SHIFT_DESIGNS } from "@/lib/designs";
import { extractMintedTokenId, fetchMintedNftPreview, getGiftArcWriteContract } from "@/lib/giftarc";
import type { QuoteResponse, TransferRequest, TransferResult, TransferStatus } from "@/lib/types";
import { BrowserProvider } from "ethers";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

export default function DashboardClient({ email }: { email: string }) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      setProvider(new BrowserProvider(window.ethereum));
    }
  }, []);

  async function handleQuote(req: TransferRequest): Promise<QuoteResponse> {
    const res = await fetch("/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req)
    });

    if (!res.ok) {
      throw new Error("Failed to fetch quote");
    }

    return res.json();
  }

  async function handleTransfer(
    req: TransferRequest,
    onProgress: (status: TransferStatus) => void
  ): Promise<TransferResult> {
    if (!provider || !window.ethereum) {
      throw new Error("Wallet provider missing");
    }

    onProgress("wallet_ready");

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ARC_NETWORK.chainIdHex }]
    }).catch(async (err: { code?: number }) => {
      if (err?.code === 4902) {
        await window.ethereum?.request({
          method: "wallet_addEthereumChain",
          params: [ARC_NETWORK]
        });
      } else {
        throw err;
      }
    });

    const contract = await getGiftArcWriteContract(provider);
    const design = SHIFT_DESIGNS.find((item) => item.id === req.designName) ?? SHIFT_DESIGNS[1];

    onProgress("approval_pending");
    const mintFee = await contract.mintFee();

    onProgress("bridging");
    const tx = await contract.mintGift(
      design.rarity,
      Math.max(1, Math.floor(req.amount || design.amount)),
      design.id,
      design.imageURI,
      `ShiftFlow route for ${req.email}`,
      { value: mintFee }
    );

    onProgress("attesting");
    const receipt = await tx.wait();

    onProgress("minting");
    const tokenId = receipt ? extractMintedTokenId(receipt) : undefined;
    const nft = tokenId ? await fetchMintedNftPreview(provider, tokenId) : undefined;

    onProgress("completed");

    return {
      hash: tx.hash,
      explorerUrl: `${process.env.NEXT_PUBLIC_ARC_EXPLORER_URL || ARC_NETWORK.blockExplorerUrls[0]}/tx/${tx.hash}`,
      tokenId,
      nft: nft || undefined
    };
  }

  return (
    <main className="min-h-screen bg-[#090c12] text-white">
      <Header />
      <section className="py-14">
        <Container>
          <div className="mb-8">
            <div className="text-sm uppercase tracking-[0.18em] text-white/35">Dashboard</div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Move through the flow. Settle on Arc.
            </h1>
            <p className="mt-3 max-w-2xl text-white/55">
              This version completes with a real Arc transaction and mints a receipt-style NFT from your deployed GiftArc contract.
            </p>
          </div>

          <TransferForm
            email={email}
            onQuote={handleQuote}
            onTransfer={handleTransfer}
          />
        </Container>
      </section>
    </main>
  );
}

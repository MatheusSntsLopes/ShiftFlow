"use client";

import { Header } from "@/components/Header";
import { TransferForm } from "@/components/TransferForm";
import { Container } from "@/components/ui";
import type { QuoteResponse, TransferRequest, TransferStatus } from "@/lib/types";
import { ARC_NETWORK } from "@/lib/arc";
import { BrowserProvider, Contract } from "ethers";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const GIFTARC_ABI = [
  "function mintFee() view returns (uint256)",
  "function mintGift(string rarity,uint256 visualAmount,string designName,string imageURI,string message) payable returns (uint256)"
];

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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch quote");
    }

    return res.json();
  }

async function handleTransfer(
  req: TransferRequest,
  onProgress: (status: TransferStatus) => void
): Promise<{
  hash?: string;
  explorerUrl?: string;
  tokenId?: string | number;
}> {
  if (!provider) throw new Error("Wallet provider missing");

  onProgress("wallet_ready");

  // 🔁 garante que está na Arc
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: ARC_NETWORK.chainIdHex }],
  }).catch(async (err: any) => {
    if (err?.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [ARC_NETWORK],
      });
    } else {
      throw err;
    }
  });

  const signer = await provider.getSigner();

  const contract = new Contract(
    process.env.NEXT_PUBLIC_GIFTARC_CONTRACT!,
    GIFTARC_ABI,
    signer
  );

  onProgress("approval_pending");

  // 💰 pega fee do contrato
  const mintFee = await contract.mintFee();

  onProgress("bridging");

  // 🚀 mint real
  const tx = await contract.mintGift(
    "SHIFT", // rarity
    Math.floor(req.amount || 1), // valor visual
    "shiftflow", // design
    "ipfs://placeholder", // pode trocar depois
    `Transfer for ${req.email}`,
    { value: mintFee }
  );

  onProgress("attesting");

  const receipt = await tx.wait();

  onProgress("minting");
  onProgress("completed");

  return {
    hash: tx.hash,
    explorerUrl: `${process.env.NEXT_PUBLIC_ARC_EXPLORER_URL}/tx/${tx.hash}`,
    tokenId: undefined
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
              Move USDC with a softer workflow
            </h1>
            <p className="mt-3 max-w-2xl text-white/55">
              This version is Arc-first and completes with a real onchain action on Arc.
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
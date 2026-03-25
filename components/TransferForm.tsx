"use client";

import { useMemo, useState } from "react";
import { CHAINS } from "@/lib/chains";
import { SHIFT_DESIGNS } from "@/lib/designs";
import type { ChainKey, QuoteResponse, TransferRequest, TransferStatus } from "@/lib/types";
import { Button, Card, Input } from "./ui";
import { RouteCard } from "./RouteCard";
import { StatusStepper } from "./StatusStepper";
import { useArcWallet } from "./ArcWalletProvider";

export function TransferForm({
  email,
  onQuote,
  onTransfer
}: {
  email: string;
  onQuote: (req: TransferRequest) => Promise<QuoteResponse>;
  onTransfer: (req: TransferRequest, onProgress: (status: TransferStatus) => void) => Promise<{ hash?: string; explorerUrl?: string; tokenId?: string | number }>;
}) {
  const { isConnected, isArc, connect, switchToArc } = useArcWallet();
  const [sourceChain, setSourceChain] = useState<ChainKey>("base");
  const [destinationChain, setDestinationChain] = useState<ChainKey>("arc");
  const [amount, setAmount] = useState("250");
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [status, setStatus] = useState<TransferStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [explorerUrl, setExplorerUrl] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | number | null>(null);

  const request = useMemo<TransferRequest>(() => ({
    email,
    sourceChain,
    destinationChain,
    amount: Number(amount || 0),
    designName: SHIFT_DESIGNS[Math.min(2, Math.max(0, Math.floor(Number(amount || 0) / 100)))].id
  }), [email, sourceChain, destinationChain, amount]);

  async function handleQuote() {
    setBusy(true);
    try {
      const result = await onQuote(request);
      setQuote(result);
    } finally {
      setBusy(false);
    }
  }

  async function ensureWalletReady() {
    if (!isConnected) await connect();
    if (!isArc) await switchToArc();
  }

  async function handleTransfer() {
    setBusy(true);
    setTxHash(null);
    setExplorerUrl(null);
    setTokenId(null);
    try {
      await ensureWalletReady();
      const result = await onTransfer(request, setStatus);
      setTxHash(result.hash || null);
      setExplorerUrl(result.explorerUrl || null);
      setTokenId(result.tokenId ?? null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_.95fr]">
      <Card className="p-6">
        <div className="mb-6">
          <div className="text-2xl font-semibold text-white">Create transfer</div>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Get a route quote, then finish the flow with a real Arc transaction that mints a receipt-style NFT on your deployed GiftArc contract.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/50">Recipient email</label>
            <Input value={email} readOnly />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-white/50">Source chain</label>
              <select value={sourceChain} onChange={(e) => setSourceChain(e.target.value as ChainKey)} className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none">
                {CHAINS.map((chain) => <option className="bg-[#0b0f15]" key={chain.key} value={chain.key}>{chain.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/50">Destination chain</label>
              <select value={destinationChain} onChange={(e) => setDestinationChain(e.target.value as ChainKey)} className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none">
                {CHAINS.map((chain) => <option className="bg-[#0b0f15]" key={chain.key} value={chain.key}>{chain.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/50">Amount (USDC)</label>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="250" />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={handleQuote} disabled={busy} className="bg-white text-[#0b0f15]">Get Quote</Button>
            <Button onClick={handleTransfer} disabled={busy || !quote} className="border border-white/10 bg-white/[0.03] text-white">Complete on Arc</Button>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <RouteCard quote={quote} />
        <StatusStepper current={status} />
        {txHash ? (
          <Card className="p-5">
            <div className="text-sm text-white/45">Arc transaction</div>
            <div className="mt-3 break-all text-sm text-white">{txHash}</div>
            {typeof tokenId !== "undefined" && tokenId !== null ? <div className="mt-3 text-sm text-white/65">Minted token id: {String(tokenId)}</div> : null}
            {explorerUrl ? <a className="mt-4 inline-flex text-sm text-emerald-300 underline" href={explorerUrl} target="_blank" rel="noreferrer">View on Arc explorer</a> : null}
          </Card>
        ) : null}
      </div>
    </div>
  );
}

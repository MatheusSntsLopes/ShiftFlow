"use client";

import { useArcWallet } from "./ArcWalletProvider";
import { Card } from "./ui";
import { ARC_NETWORK } from "@/lib/arc";

function shortAddress(address?: string | null) {
  if (!address) return "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ArcStatusCard() {
  const { address, isConnected, isArc, chainId } = useArcWallet();

  return (
    <Card className="p-5">
      <div className="text-sm text-white/45">Arc connection</div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-wide text-white/40">Wallet</div>
          <div className="mt-2 text-sm font-medium text-white">{shortAddress(address)}</div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-wide text-white/40">Chain</div>
          <div className="mt-2 text-sm font-medium text-white">{isArc ? ARC_NETWORK.chainName : chainId ? `Chain ${chainId}` : "Unknown"}</div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-wide text-white/40">Status</div>
          <div className="mt-2 text-sm font-medium text-white">{isConnected ? (isArc ? "Ready on Arc" : "Switch network") : "Connect wallet"}</div>
        </div>
      </div>
    </Card>
  );
}

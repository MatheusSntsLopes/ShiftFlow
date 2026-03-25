"use client";

import { useArcWallet } from "./ArcWalletProvider";
import { Button } from "./ui";

function shortAddress(address?: string | null) {
  if (!address) return "Connect Wallet";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletButton() {
  const { connect, address, isArc, switchToArc, isConnected } = useArcWallet();

  if (isConnected && !isArc) {
    return <Button onClick={switchToArc} className="bg-white text-[#0b0f15]">Switch to Arc</Button>;
  }

  return <Button onClick={connect} className="bg-white text-[#0b0f15]">{shortAddress(address)}</Button>;
}

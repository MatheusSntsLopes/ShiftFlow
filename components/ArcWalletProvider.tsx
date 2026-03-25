"use client";

import { BrowserProvider } from "ethers";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ARC_NETWORK } from "@/lib/arc";

declare global {
  interface Window {
    ethereum?: any;
  }
}

type ArcWalletContextType = {
  address: string | null;
  provider: BrowserProvider | null;
  chainId: number | null;
  isConnected: boolean;
  isArc: boolean;
  connect: () => Promise<void>;
  switchToArc: () => Promise<void>;
  disconnect: () => void;
};

const ArcWalletContext = createContext<ArcWalletContextType | null>(null);

export function ArcWalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;
    const p = new BrowserProvider(window.ethereum);
    setProvider(p);

    window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
      setAddress(accounts?.[0] || null);
    }).catch(() => {});

    window.ethereum.request({ method: "eth_chainId" }).then((id: string) => {
      setChainId(parseInt(id, 16));
    }).catch(() => {});

    const onAccountsChanged = (accounts: string[]) => setAddress(accounts?.[0] || null);
    const onChainChanged = (hexId: string) => setChainId(parseInt(hexId, 16));

    window.ethereum.on?.("accountsChanged", onAccountsChanged);
    window.ethereum.on?.("chainChanged", onChainChanged);

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", onAccountsChanged);
      window.ethereum?.removeListener?.("chainChanged", onChainChanged);
    };
  }, []);

  async function switchToArc() {
    if (!window.ethereum) throw new Error("Wallet not found");
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: ARC_NETWORK.chainIdHex }] });
    } catch (error: any) {
      if (error?.code === 4902) {
        await window.ethereum.request({ method: "wallet_addEthereumChain", params: [ARC_NETWORK] });
      } else {
        throw error;
      }
    }
    setChainId(ARC_NETWORK.chainIdDec);
  }

  async function connect() {
    if (!window.ethereum) throw new Error("MetaMask or Rabby not found");
    const p = provider || new BrowserProvider(window.ethereum);
    setProvider(p);
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAddress(accounts?.[0] || null);
    await switchToArc();
  }

  function disconnect() {
    setAddress(null);
  }

  const value = useMemo(() => ({
    address,
    provider,
    chainId,
    isConnected: !!address,
    isArc: chainId === ARC_NETWORK.chainIdDec,
    connect,
    switchToArc,
    disconnect
  }), [address, provider, chainId]);

  return <ArcWalletContext.Provider value={value}>{children}</ArcWalletContext.Provider>;
}

export function useArcWallet() {
  const ctx = useContext(ArcWalletContext);
  if (!ctx) throw new Error("useArcWallet must be used inside ArcWalletProvider");
  return ctx;
}

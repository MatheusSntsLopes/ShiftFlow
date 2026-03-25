import type { ChainInfo } from "@/lib/types";

export function ChainPill({ chain }: { chain: ChainInfo }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: chain.accent }} />
      {chain.name}
    </div>
  );
}

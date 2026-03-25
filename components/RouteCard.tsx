import type { QuoteResponse } from "@/lib/types";
import { formatUsd } from "@/lib/utils";
import { Card } from "./ui";

export function RouteCard({ quote }: { quote: QuoteResponse | null }) {
  if (!quote) return null;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-white/45">Recommended route</div>
          <div className="mt-2 text-xl font-semibold text-white">{quote.routeLabel}</div>
          <div className="mt-2 text-sm text-white/45">{quote.sourceChain} → {quote.destinationChain}</div>
        </div>
        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
          {quote.eta}
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-wide text-white/40">Amount</div>
          <div className="mt-2 text-lg font-medium text-white">{formatUsd(quote.amount)}</div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-wide text-white/40">Fee</div>
          <div className="mt-2 text-lg font-medium text-white">{formatUsd(quote.fee)}</div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="text-xs uppercase tracking-wide text-white/40">You receive</div>
          <div className="mt-2 text-lg font-medium text-white">{formatUsd(quote.estimatedReceive)}</div>
        </div>
      </div>
    </Card>
  );
}

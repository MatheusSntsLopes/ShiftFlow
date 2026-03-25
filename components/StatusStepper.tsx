import type { TransferStatus } from "@/lib/types";
import { Card } from "./ui";

const labels: Record<TransferStatus, string> = {
  wallet_ready: "Wallet prepared",
  approval_pending: "Approval pending",
  bridging: "Bridging in progress",
  attesting: "Attestation received",
  minting: "Destination minting",
  completed: "Transfer completed"
};

const ordered: TransferStatus[] = [
  "wallet_ready",
  "approval_pending",
  "bridging",
  "attesting",
  "minting",
  "completed"
];

export function StatusStepper({ current }: { current: TransferStatus | null }) {
  if (!current) return null;
  const currentIndex = ordered.indexOf(current);

  return (
    <Card className="p-5">
      <div className="text-sm text-white/45">Transfer progress</div>
      <div className="mt-4 space-y-3">
        {ordered.map((step, index) => {
          const active = index <= currentIndex;
          return (
            <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
              <div className={`h-3.5 w-3.5 rounded-full ${active ? "bg-emerald-400" : "bg-white/15"}`} />
              <div className={`${active ? "text-white" : "text-white/45"}`}>{labels[step]}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

import { Container, Button, Card } from "./ui";
import { WalletButton } from "./WalletButton";

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative overflow-hidden py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-emerald-300">
              Arc-connected transfer UX
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
              Move through a bridge flow. Settle on Arc.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
              ShiftFlow keeps the smoother bridge-style experience, but now the app really connects to Arc Testnet and finishes with a live onchain mint through your deployed GiftArc contract.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button onClick={onStart} className="border border-white/10 bg-white/[0.03] px-6 text-white">Continue with Email</Button>
              <WalletButton />
            </div>
          </div>
          <Card className="p-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div>
                  <div className="text-sm text-white/45">Bridge origin</div>
                  <div className="mt-1 text-xl font-medium text-white">Base / Other</div>
                </div>
                <div className="rounded-full bg-[#4f7cff]/15 px-3 py-1 text-sm text-[#8cabff]">USDC</div>
              </div>
              <div className="flex items-center justify-center text-white/30">↓</div>
              <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div>
                  <div className="text-sm text-white/45">Final settlement</div>
                  <div className="mt-1 text-xl font-medium text-white">Arc Testnet</div>
                </div>
                <div className="rounded-full bg-[#19d29d]/15 px-3 py-1 text-sm text-[#7ce8c8]">Onchain NFT mint</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.06] to-transparent p-5">
                <div className="text-sm text-white/45">Live completion step</div>
                <div className="mt-2 text-3xl font-semibold text-white">GiftArc mint on Arc</div>
                <div className="mt-2 text-sm text-white/45">Connect wallet, switch to Arc, confirm transaction, receive NFT</div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}

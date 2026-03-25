import { Container, Button } from "./ui";
import Link from "next/link";
import { WalletButton } from "./WalletButton";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/6 bg-[#090c12]/80 backdrop-blur-xl">
      <Container>
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400" />
            <div>
              <div className="text-lg font-semibold tracking-tight text-white">ShiftFlow</div>
              <div className="text-xs text-white/45">Arc-first USDC transfer experience</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard?email=demo%40shiftflow.app"><Button className="border border-white/10 bg-transparent text-white">Dashboard</Button></Link>
            <WalletButton />
          </div>
        </div>
      </Container>
    </header>
  );
}

"use client";

import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleContinue(email: string) {
    const safeEmail = encodeURIComponent(email || "demo@shiftflow.app");
    setOpen(false);
    router.push(`/dashboard?email=${safeEmail}`);
  }

  return (
    <main className="min-h-screen bg-[#090c12] text-white">
      <Header />
      <Hero onStart={() => setOpen(true)} />
      <AuthModal open={open} onClose={() => setOpen(false)} onContinue={handleContinue} />
    </main>
  );
}

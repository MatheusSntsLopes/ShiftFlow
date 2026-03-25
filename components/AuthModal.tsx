"use client";

import { useState } from "react";
import { Button, Card, Input } from "./ui";

export function AuthModal({ open, onClose, onContinue }: { open: boolean; onClose: () => void; onContinue: (email: string) => void; }) {
  const [email, setEmail] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6">
        <div className="mb-5">
          <div className="text-2xl font-semibold text-white">Continue with Email</div>
          <p className="mt-2 text-sm leading-6 text-white/55">
            This MVP uses a mocked magic-link flow so the interface is ready before live auth is wired in.
          </p>
        </div>
        <div className="space-y-4">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
          />
          <div className="flex gap-3">
            <Button onClick={onClose} className="flex-1 border border-white/10 bg-transparent text-white">Cancel</Button>
            <Button onClick={() => onContinue(email)} className="flex-1 bg-white text-[#0b0f15]">Send Link</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

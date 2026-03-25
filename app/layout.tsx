import "./globals.css";
import type { Metadata } from "next";
import { ArcWalletProvider } from "@/components/ArcWalletProvider";

export const metadata: Metadata = {
  title: "ShiftFlow",
  description: "Arc-first transfer UX with real onchain settlement"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ArcWalletProvider>{children}</ArcWalletProvider>
      </body>
    </html>
  );
}

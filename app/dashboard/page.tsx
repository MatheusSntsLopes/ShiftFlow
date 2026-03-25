import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

function DashboardFallback() {
  return (
    <main className="min-h-screen bg-[#090c12] text-white">
      <div className="p-8">Loading dashboard...</div>
    </main>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const email = resolvedSearchParams?.email || "demo@shiftflow.app";

  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardClient email={email} />
    </Suspense>
  );
}
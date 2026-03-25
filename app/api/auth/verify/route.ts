import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    walletReady: true,
    session: "mock_session"
  });
}

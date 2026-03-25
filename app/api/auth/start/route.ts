import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({
    ok: true,
    method: "magic_link",
    email: body.email,
    note: "Mock auth start endpoint"
  });
}

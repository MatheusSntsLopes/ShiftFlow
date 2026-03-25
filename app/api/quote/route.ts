import { NextResponse } from "next/server";
import { getMockQuote } from "@/lib/mockBridge";

export async function POST(req: Request) {
  const body = await req.json();
  const quote = await getMockQuote(body);
  return NextResponse.json(quote);
}

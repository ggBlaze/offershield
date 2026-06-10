import { NextResponse } from "next/server";
import { getHealth } from "@/lib/ai/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ...getHealth(),
    timestamp: new Date().toISOString(),
  });
}

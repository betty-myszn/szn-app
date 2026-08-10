import { NextRequest, NextResponse } from "next/server";
import { generateMoneyBlueprint } from "@/lib/money-blueprint/compose/generate";
import type { BirthData } from "@/types/chart";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  try {
    const { birthData, measureMode, measured } = (await req.json()) as {
      birthData: BirthData; measureMode?: boolean; measured?: Record<string, number[]>;
    };
    const r = generateMoneyBlueprint(birthData, { measureMode, measured });
    return new NextResponse(r.html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

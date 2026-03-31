import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { buildWeeklySnapshot } from "@/lib/marketing/analyzer";
import { evaluateAllRules } from "@/lib/marketing/rules";
import type { SalesSnapshot } from "@/types";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServerClient();

    const { data: latestSnapshot } = await supabase
      .from("sales_snapshots")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const snapshot: SalesSnapshot = latestSnapshot ?? (await buildWeeklySnapshot());

    const results = await evaluateAllRules(snapshot);
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Marketing promotions error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate rules" },
      { status: 500 }
    );
  }
}

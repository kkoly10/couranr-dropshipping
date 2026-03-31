import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { buildWeeklySnapshot } from "@/lib/marketing/analyzer";
import { generateCampaign } from "@/lib/marketing/ai-writer";
import { sendCampaign } from "@/lib/marketing/campaign-sender";
import type { SalesSnapshot } from "@/types";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServerClient();

    // Get latest snapshot
    const { data: latestSnapshot } = await supabase
      .from("sales_snapshots")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const snapshot: SalesSnapshot = latestSnapshot ?? (await buildWeeklySnapshot());

    // Get active sitewide promotions
    const { data: activePromos } = await supabase
      .from("promotions")
      .select("*")
      .eq("active", true)
      .eq("type", "sitewide");

    // Determine trigger type
    let trigger: string | null = null;

    if (activePromos && activePromos.length > 0) {
      const promo = activePromos[0];
      if (promo.discount_pct <= 5) {
        trigger = "low_sales_discount";
      } else if (promo.discount_pct >= 10) {
        trigger = "flash_sale";
      }
    } else if (snapshot.total_orders >= 20) {
      trigger = "bestseller_spotlight";
    }

    let campaignSent = false;

    if (trigger) {
      const campaign = await generateCampaign(trigger, snapshot);

      // Get subscriber emails
      const { data: subscribers } = await supabase
        .from("subscribers")
        .select("email");

      const emails = subscribers?.map((s) => s.email) ?? [];

      if (campaign && emails.length > 0) {
        await sendCampaign(campaign, emails);
        campaignSent = true;
      }
    }

    return NextResponse.json({ success: true, campaignSent, trigger });
  } catch (error) {
    console.error("Marketing campaign error:", error);
    return NextResponse.json(
      { error: "Failed to run campaign" },
      { status: 500 }
    );
  }
}

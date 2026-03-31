import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { deactivatePromotion, deactivateAllPromotions } from "@/lib/marketing/levers";

export async function GET() {
  try {
    const supabase = createServerClient();

    const [
      { data: activePromotions },
      { data: recentCampaigns },
      { data: latestSnapshot },
      { data: recentRuleLogs },
      { data: engineSetting },
      { data: rulesSetting },
    ] = await Promise.all([
      supabase
        .from("promotions")
        .select("*")
        .eq("active", true),
      supabase
        .from("ai_campaigns")
        .select("*")
        .order("sent_at", { ascending: false })
        .limit(10),
      supabase
        .from("sales_snapshots")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from("marketing_rule_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("settings")
        .select("*")
        .eq("key", "marketing_engine_enabled")
        .single(),
      supabase
        .from("settings")
        .select("*")
        .eq("key", "marketing_rules")
        .single(),
    ]);

    return NextResponse.json({
      activePromotions: activePromotions ?? [],
      recentCampaigns: recentCampaigns ?? [],
      latestSnapshot: latestSnapshot ?? null,
      recentRuleLogs: recentRuleLogs ?? [],
      engineEnabled: engineSetting?.value ?? false,
      rulesConfig: rulesSetting?.value ?? null,
    });
  } catch (error) {
    console.error("Admin marketing GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch marketing data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    // Handle special actions
    if (body.action) {
      const cronSecret = process.env.CRON_SECRET;
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

      if (body.action === "force_analyze") {
        const res = await fetch(`${baseUrl}/api/marketing/analyze`, {
          method: "GET",
          headers: { authorization: `Bearer ${cronSecret}` },
        });
        const data = await res.json();
        return NextResponse.json({ success: res.ok, result: data });
      }

      if (body.action === "force_campaign") {
        const res = await fetch(`${baseUrl}/api/marketing/campaign`, {
          method: "GET",
          headers: { authorization: `Bearer ${cronSecret}` },
        });
        const data = await res.json();
        return NextResponse.json({ success: res.ok, result: data });
      }

      if (body.action === "pause_all") {
        await deactivateAllPromotions();
        return NextResponse.json({ success: true, message: "All promotions paused" });
      }

      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    // Create promotion
    const { type, discount_pct, scope_id, scope_type, reason, expires_at } = body;

    const { data: promotion, error } = await supabase
      .from("promotions")
      .insert({
        type,
        discount_pct,
        scope_id: scope_id ?? null,
        scope_type: scope_type ?? null,
        reason,
        triggered_by: "manual",
        active: true,
        expires_at: expires_at ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, promotion });
  } catch (error) {
    console.error("Admin marketing POST error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { key, value } = body;

    const validKeys = ["marketing_engine_enabled", "marketing_rules"];
    if (!validKeys.includes(key)) {
      return NextResponse.json(
        { error: "Invalid settings key" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("settings")
      .upsert({ key, value }, { onConflict: "key" });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin marketing PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { promotionId } = body;

    await deactivatePromotion(promotionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin marketing DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to deactivate promotion" },
      { status: 500 }
    );
  }
}

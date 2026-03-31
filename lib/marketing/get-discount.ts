import { createServerClient } from "@/lib/supabase/server";

export async function getActiveDiscount(
  productId?: string,
  categoryId?: string
): Promise<number> {
  try {
    const supabase = createServerClient();
    const now = new Date().toISOString();

    // Check sitewide first
    const { data: sitewide } = await supabase
      .from("promotions")
      .select("discount_pct")
      .eq("type", "sitewide")
      .eq("active", true)
      .gt("expires_at", now)
      .limit(1)
      .single();
    if (sitewide) return sitewide.discount_pct;

    // Check category
    if (categoryId) {
      const { data: catPromo } = await supabase
        .from("promotions")
        .select("discount_pct")
        .eq("type", "category")
        .eq("scope_id", categoryId)
        .eq("active", true)
        .gt("expires_at", now)
        .limit(1)
        .single();
      if (catPromo) return catPromo.discount_pct;
    }

    // Check product
    if (productId) {
      const { data: prodPromo } = await supabase
        .from("promotions")
        .select("discount_pct")
        .eq("type", "product")
        .eq("scope_id", productId)
        .eq("active", true)
        .gt("expires_at", now)
        .limit(1)
        .single();
      if (prodPromo) return prodPromo.discount_pct;
    }

    return 0;
  } catch {
    return 0;
  }
}

export function applyDiscount(price: number, discountPct: number): number {
  if (discountPct === 0) return price;
  return Math.round((price * (1 - discountPct / 100)) * 100) / 100;
}

export async function getActiveSitewidePromotion(): Promise<{
  discount_pct: number;
  expires_at: string;
} | null> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("promotions")
      .select("discount_pct, expires_at")
      .eq("type", "sitewide")
      .eq("active", true)
      .gt("expires_at", new Date().toISOString())
      .limit(1)
      .single();
    return data;
  } catch {
    return null;
  }
}

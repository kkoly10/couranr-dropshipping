import { createServerClient } from "@/lib/supabase/server";
import type { Promotion } from "@/types";

export async function createPromotion(data: {
  type: "sitewide" | "category" | "product" | "clearance";
  discount_pct: number;
  scope_id?: string;
  scope_type?: string;
  reason: string;
  expires_at?: string;
}): Promise<Promotion | null> {
  try {
    const supabase = createServerClient();
    const { data: promo } = await supabase
      .from("promotions")
      .insert({
        type: data.type,
        discount_pct: data.discount_pct,
        scope_id: data.scope_id ?? null,
        scope_type: data.scope_type ?? null,
        reason: data.reason,
        triggered_by: "ai_engine",
        active: true,
        expires_at:
          data.expires_at ??
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    return (promo as Promotion) ?? null;
  } catch {
    return null;
  }
}

export async function deactivatePromotion(id: string): Promise<void> {
  try {
    const supabase = createServerClient();
    await supabase
      .from("promotions")
      .update({ active: false, deactivated_at: new Date().toISOString() })
      .eq("id", id);
  } catch {
    // Fail silently
  }
}

export async function deactivateAllPromotions(): Promise<void> {
  try {
    const supabase = createServerClient();
    await supabase
      .from("promotions")
      .update({ active: false, deactivated_at: new Date().toISOString() })
      .eq("active", true);
  } catch {
    // Fail silently
  }
}

export async function getActiveSitewidePromotion(): Promise<Promotion | null> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("promotions")
      .select("*")
      .eq("type", "sitewide")
      .eq("active", true)
      .gt("expires_at", new Date().toISOString())
      .order("discount_pct", { ascending: false })
      .limit(1)
      .single();

    return (data as Promotion) ?? null;
  } catch {
    return null;
  }
}

export async function applyProductDiscount(
  productId: string,
  pct: number
): Promise<void> {
  try {
    const supabase = createServerClient();

    // Get current product price
    const { data: product } = await supabase
      .from("products")
      .select("price")
      .eq("id", productId)
      .single();

    if (!product) return;

    const newPrice =
      Math.round(product.price * (1 - pct / 100) * 100) / 100;

    // Update product: set compare_price to old price, price to discounted
    await supabase
      .from("products")
      .update({
        compare_price: product.price,
        price: newPrice,
      })
      .eq("id", productId);

    // Create a product-level promotion record
    await createPromotion({
      type: "product",
      discount_pct: pct,
      scope_id: productId,
      scope_type: "product",
      reason: `Auto-discount ${pct}% applied to product`,
    });
  } catch {
    // Fail silently
  }
}

export async function getActiveDiscount(
  productId?: string,
  categoryId?: string
): Promise<number> {
  try {
    const supabase = createServerClient();
    const now = new Date().toISOString();
    let maxDiscount = 0;

    // Check sitewide promotions first
    const { data: sitewide } = await supabase
      .from("promotions")
      .select("discount_pct")
      .eq("type", "sitewide")
      .eq("active", true)
      .gt("expires_at", now);

    if (sitewide) {
      for (const p of sitewide) {
        if (p.discount_pct > maxDiscount) maxDiscount = p.discount_pct;
      }
    }

    // Check category promotions
    if (categoryId) {
      const { data: categoryPromos } = await supabase
        .from("promotions")
        .select("discount_pct")
        .eq("type", "category")
        .eq("scope_id", categoryId)
        .eq("active", true)
        .gt("expires_at", now);

      if (categoryPromos) {
        for (const p of categoryPromos) {
          if (p.discount_pct > maxDiscount) maxDiscount = p.discount_pct;
        }
      }
    }

    // Check product promotions
    if (productId) {
      const { data: productPromos } = await supabase
        .from("promotions")
        .select("discount_pct")
        .eq("type", "product")
        .eq("scope_id", productId)
        .eq("active", true)
        .gt("expires_at", now);

      if (productPromos) {
        for (const p of productPromos) {
          if (p.discount_pct > maxDiscount) maxDiscount = p.discount_pct;
        }
      }
    }

    return maxDiscount;
  } catch {
    return 0;
  }
}

export function applyDiscount(price: number, discountPct: number): number {
  return Math.round(price * (1 - discountPct / 100) * 100) / 100;
}

export async function getProductsWithNoRecentSales(
  days: number
): Promise<Array<{ id: string; name: string; margin_pct: number }>> {
  try {
    const supabase = createServerClient();
    const cutoff = new Date(
      Date.now() - days * 24 * 60 * 60 * 1000
    ).toISOString();

    // Get in-stock products with cost info
    const { data: products } = await supabase
      .from("products")
      .select("id, name, price, cost")
      .eq("in_stock", true);

    if (!products || products.length === 0) return [];

    // Get orders in the time range
    const { data: recentOrders } = await supabase
      .from("orders")
      .select("id")
      .in("status", ["paid", "shipped", "delivered"])
      .gte("created_at", cutoff);

    const orderIds = recentOrders?.map((o) => o.id) ?? [];
    let soldNames: Set<string> = new Set();

    if (orderIds.length > 0) {
      const { data: items } = await supabase
        .from("order_items")
        .select("product_name")
        .in("order_id", orderIds);

      soldNames = new Set(items?.map((i) => i.product_name) ?? []);
    }

    const deadProducts: Array<{ id: string; name: string; margin_pct: number }> = [];

    for (const p of products) {
      if (soldNames.has(p.name)) continue;

      // Calculate margin if cost exists
      const cost = (p as Record<string, unknown>).cost as number | null;
      if (cost == null || p.price <= 0) continue;

      const marginPct = ((p.price - cost) / p.price) * 100;
      deadProducts.push({
        id: p.id,
        name: p.name,
        margin_pct: Math.round(marginPct * 100) / 100,
      });
    }

    return deadProducts;
  } catch {
    return [];
  }
}

export async function getTopSellingProducts(opts: {
  days: number;
  minUnits: number;
}): Promise<Array<{ id: string; name: string }>> {
  try {
    const supabase = createServerClient();
    const cutoff = new Date(
      Date.now() - opts.days * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data: recentOrders } = await supabase
      .from("orders")
      .select("id")
      .in("status", ["paid", "shipped", "delivered"])
      .gte("created_at", cutoff);

    const orderIds = recentOrders?.map((o) => o.id) ?? [];
    if (orderIds.length === 0) return [];

    const { data: items } = await supabase
      .from("order_items")
      .select("product_name, quantity")
      .in("order_id", orderIds);

    if (!items || items.length === 0) return [];

    const counts: Record<string, number> = {};
    for (const item of items) {
      counts[item.product_name] =
        (counts[item.product_name] || 0) + (item.quantity || 1);
    }

    const topNames = Object.entries(counts)
      .filter(([, count]) => count >= opts.minUnits)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);

    if (topNames.length === 0) return [];

    const { data: products } = await supabase
      .from("products")
      .select("id, name")
      .in("name", topNames);

    return (products ?? []).map((p) => ({ id: p.id, name: p.name }));
  } catch {
    return [];
  }
}

export async function getCategoryId(slug: string): Promise<string | null> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .limit(1)
      .single();

    return data?.id ?? null;
  } catch {
    return null;
  }
}

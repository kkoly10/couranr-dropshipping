import { createServerClient } from "@/lib/supabase/server";
import type { SalesSnapshot } from "@/types";

export async function buildWeeklySnapshot(): Promise<SalesSnapshot> {
  const emptySnapshot: SalesSnapshot = {
    id: "",
    week_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    total_orders: 0,
    total_revenue: 0,
    avg_order_value: 0,
    top_product_id: null,
    worst_product_id: null,
    new_subscribers: 0,
    category_breakdown: null,
    active_promotion: null,
    notes: null,
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = createServerClient();
    const sevenDaysAgo = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    ).toISOString();
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    // Query orders from last 7 days with valid statuses
    const { data: orders } = await supabase
      .from("orders")
      .select("id, total, created_at")
      .in("status", ["paid", "shipped", "delivered"])
      .gte("created_at", sevenDaysAgo);

    const totalOrders = orders?.length ?? 0;
    const totalRevenue =
      orders?.reduce((sum, o) => sum + (o.total || 0), 0) ?? 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get order IDs for joining with order_items
    const orderIds = orders?.map((o) => o.id) ?? [];

    // Find top product by frequency in order_items (last 7 days)
    let topProductId: string | null = null;
    let topProductName: string | null = null;

    if (orderIds.length > 0) {
      const { data: items } = await supabase
        .from("order_items")
        .select("product_name, quantity")
        .in("order_id", orderIds);

      if (items && items.length > 0) {
        const productCounts: Record<string, number> = {};
        for (const item of items) {
          productCounts[item.product_name] =
            (productCounts[item.product_name] || 0) + (item.quantity || 1);
        }

        topProductName = Object.entries(productCounts).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0] ?? null;

        if (topProductName) {
          const { data: product } = await supabase
            .from("products")
            .select("id")
            .eq("name", topProductName)
            .limit(1)
            .single();
          topProductId = product?.id ?? null;
        }
      }
    }

    // Find worst product: in-stock products with no sales in 30 days
    let worstProductId: string | null = null;

    const { data: inStockProducts } = await supabase
      .from("products")
      .select("id, name")
      .eq("in_stock", true);

    if (inStockProducts && inStockProducts.length > 0) {
      // Get all order_items from last 30 days
      const { data: recentOrders } = await supabase
        .from("orders")
        .select("id")
        .in("status", ["paid", "shipped", "delivered"])
        .gte("created_at", thirtyDaysAgo);

      const recentOrderIds = recentOrders?.map((o) => o.id) ?? [];
      let recentProductNames: Set<string> = new Set();

      if (recentOrderIds.length > 0) {
        const { data: recentItems } = await supabase
          .from("order_items")
          .select("product_name")
          .in("order_id", recentOrderIds);

        recentProductNames = new Set(
          recentItems?.map((i) => i.product_name) ?? []
        );
      }

      const deadProducts = inStockProducts.filter(
        (p) => !recentProductNames.has(p.name)
      );
      worstProductId = deadProducts[0]?.id ?? null;
    }

    // Category breakdown: group order_items by product category
    let categoryBreakdown: SalesSnapshot["category_breakdown"] = null;

    if (orderIds.length > 0) {
      const { data: allItems } = await supabase
        .from("order_items")
        .select("product_name, quantity, total_price")
        .in("order_id", orderIds);

      if (allItems && allItems.length > 0) {
        const uniqueNames = [...new Set(allItems.map((i) => i.product_name))];
        const { data: products } = await supabase
          .from("products")
          .select("name, category_id")
          .in("name", uniqueNames);

        const productCategoryMap: Record<string, string | null> = {};
        for (const p of products ?? []) {
          productCategoryMap[p.name] = p.category_id;
        }

        // Get category names
        const categoryIds = [
          ...new Set(
            Object.values(productCategoryMap).filter(Boolean) as string[]
          ),
        ];
        const categoryNameMap: Record<string, string> = {};

        if (categoryIds.length > 0) {
          const { data: categories } = await supabase
            .from("categories")
            .select("id, name")
            .in("id", categoryIds);

          for (const c of categories ?? []) {
            categoryNameMap[c.id] = c.name.toLowerCase();
          }
        }

        const desk = { orders: 0, revenue: 0 };
        const home = { orders: 0, revenue: 0 };

        for (const item of allItems) {
          const catId = productCategoryMap[item.product_name];
          const catName = catId ? categoryNameMap[catId] ?? "" : "";

          if (catName.includes("desk")) {
            desk.orders += item.quantity || 1;
            desk.revenue += item.total_price || 0;
          } else if (catName.includes("home")) {
            home.orders += item.quantity || 1;
            home.revenue += item.total_price || 0;
          }
        }

        categoryBreakdown = { desk, home };
      }
    }

    // New subscribers in last 7 days
    let newSubscribers = 0;
    try {
      const { count } = await supabase
        .from("subscribers")
        .select("id", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo);

      newSubscribers = count ?? 0;
    } catch {
      // Table may not exist
    }

    // Active promotions summary
    let activePromotion: string | null = null;
    const { data: promos } = await supabase
      .from("promotions")
      .select("type, discount_pct, reason")
      .eq("active", true);

    if (promos && promos.length > 0) {
      activePromotion = promos
        .map((p) => `${p.type} ${p.discount_pct}%: ${p.reason || "no reason"}`)
        .join("; ");
    }

    // Insert snapshot
    const snapshotData = {
      week_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      total_orders: totalOrders,
      total_revenue: Math.round(totalRevenue * 100) / 100,
      avg_order_value: Math.round(avgOrderValue * 100) / 100,
      top_product_id: topProductId,
      worst_product_id: worstProductId,
      new_subscribers: newSubscribers,
      category_breakdown: categoryBreakdown,
      active_promotion: activePromotion,
      notes: null,
    };

    const { data: inserted } = await supabase
      .from("sales_snapshots")
      .insert(snapshotData)
      .select()
      .single();

    if (inserted) {
      return inserted as SalesSnapshot;
    }

    return { ...emptySnapshot, ...snapshotData };
  } catch {
    return emptySnapshot;
  }
}

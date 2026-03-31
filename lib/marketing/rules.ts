import { createServerClient } from "@/lib/supabase/server";
import type { SalesSnapshot } from "@/types";
import { logRuleEvaluation } from "./logger";
import {
  createPromotion,
  deactivateAllPromotions,
  getActiveSitewidePromotion,
  getProductsWithNoRecentSales,
  getTopSellingProducts,
  applyProductDiscount,
  getCategoryId,
} from "./levers";

export type MarketingRule = {
  name: string;
  description: string;
  check: (snapshot: SalesSnapshot) => Promise<boolean> | boolean;
  action: (snapshot: SalesSnapshot) => Promise<string>;
  emailTrigger: string | null;
};

export const MARKETING_RULES: MarketingRule[] = [
  // Rule 1: Low sales sitewide discount
  {
    name: "low_sales_sitewide_discount",
    description:
      "Apply 5% sitewide discount when weekly orders drop below 10, deactivate when orders reach 15+",
    check: (snapshot) => {
      return snapshot.total_orders < 10;
    },
    action: async (snapshot) => {
      try {
        // If orders >= 15, deactivate existing sitewide discount
        if (snapshot.total_orders >= 15) {
          const existing = await getActiveSitewidePromotion();
          if (existing) {
            const { deactivatePromotion } = await import("./levers");
            await deactivatePromotion(existing.id);
            return "Deactivated sitewide discount — sales recovered to 15+ orders";
          }
          return "No action — sales healthy";
        }

        // Check if there's already a sitewide promo
        const existing = await getActiveSitewidePromotion();
        if (existing) {
          return "Sitewide discount already active";
        }

        await createPromotion({
          type: "sitewide",
          discount_pct: 5,
          reason: `Low sales: only ${snapshot.total_orders} orders this week`,
        });

        return `Created 5% sitewide discount — ${snapshot.total_orders} orders this week`;
      } catch {
        return "Failed to apply low sales discount";
      }
    },
    emailTrigger: "low_sales_discount",
  },

  // Rule 2: Very low sales — deeper discount
  {
    name: "very_low_sales_discount",
    description:
      "Apply 10% sitewide discount when orders < 5 for 2 consecutive weeks",
    check: async (snapshot) => {
      if (snapshot.total_orders >= 5) return false;

      try {
        // Check previous week's snapshot
        const supabase = createServerClient();
        const { data: prevSnapshots } = await supabase
          .from("sales_snapshots")
          .select("total_orders")
          .lt("created_at", snapshot.created_at)
          .order("created_at", { ascending: false })
          .limit(1);

        if (!prevSnapshots || prevSnapshots.length === 0) return false;
        return prevSnapshots[0].total_orders < 5;
      } catch {
        return false;
      }
    },
    action: async (snapshot) => {
      try {
        // Deactivate any existing sitewide before applying stronger one
        await deactivateAllPromotions();

        await createPromotion({
          type: "sitewide",
          discount_pct: 10,
          reason: `Very low sales: ${snapshot.total_orders} orders for 2 consecutive weeks`,
        });

        return `Created 10% sitewide discount — critically low sales for 2 weeks`;
      } catch {
        return "Failed to apply very low sales discount";
      }
    },
    emailTrigger: "flash_sale",
  },

  // Rule 3: Strong sales — remove discounts
  {
    name: "strong_sales_remove_discount",
    description: "Remove all discounts when weekly orders reach 20+",
    check: (snapshot) => {
      return snapshot.total_orders >= 20;
    },
    action: async (snapshot) => {
      try {
        await deactivateAllPromotions();
        return `Deactivated all promotions — strong sales with ${snapshot.total_orders} orders`;
      } catch {
        return "Failed to deactivate promotions";
      }
    },
    emailTrigger: null,
  },

  // Rule 4: Dead product clearance
  {
    name: "dead_product_clearance",
    description:
      "Auto-discount products with 0 sales in 30 days (15% if margin > 45%, 8% if margin > 35%)",
    check: async () => {
      try {
        const deadProducts = await getProductsWithNoRecentSales(30);
        return deadProducts.length > 0;
      } catch {
        return false;
      }
    },
    action: async () => {
      try {
        const deadProducts = await getProductsWithNoRecentSales(30);
        const actions: string[] = [];

        for (const product of deadProducts) {
          let discountPct = 0;
          if (product.margin_pct > 45) {
            discountPct = 15;
          } else if (product.margin_pct > 35) {
            discountPct = 8;
          }

          if (discountPct > 0) {
            await applyProductDiscount(product.id, discountPct);
            actions.push(`${product.name}: ${discountPct}% off`);
          }
        }

        if (actions.length === 0) {
          return "Dead products found but margins too low for discount";
        }

        return `Applied clearance discounts: ${actions.join(", ")}`;
      } catch {
        return "Failed to apply dead product clearance";
      }
    },
    emailTrigger: "low_sales_discount",
  },

  // Rule 5: Winning product amplification
  {
    name: "winning_product_amplification",
    description:
      "Feature products that sell 5+ units in 7 days",
    check: async () => {
      try {
        const topProducts = await getTopSellingProducts({
          days: 7,
          minUnits: 5,
        });
        return topProducts.length > 0;
      } catch {
        return false;
      }
    },
    action: async () => {
      try {
        const supabase = createServerClient();
        const topProducts = await getTopSellingProducts({
          days: 7,
          minUnits: 5,
        });
        const names: string[] = [];

        for (const product of topProducts) {
          await supabase
            .from("products")
            .update({ is_featured: true })
            .eq("id", product.id);
          names.push(product.name);
        }

        return `Featured winning products: ${names.join(", ")}`;
      } catch {
        return "Failed to feature winning products";
      }
    },
    emailTrigger: "bestseller_spotlight",
  },

  // Rule 6: Category imbalance boost
  {
    name: "category_imbalance_boost",
    description:
      "Apply 8% discount to weaker category when gap exceeds 40%",
    check: (snapshot) => {
      if (!snapshot.category_breakdown) return false;
      const desk = snapshot.category_breakdown.desk?.orders ?? 0;
      const home = snapshot.category_breakdown.home?.orders ?? 0;
      const total = desk + home;
      if (total === 0) return false;

      const gap = Math.abs(desk - home) / total;
      return gap > 0.4;
    },
    action: async (snapshot) => {
      try {
        if (!snapshot.category_breakdown) return "No category data";

        const desk = snapshot.category_breakdown.desk?.orders ?? 0;
        const home = snapshot.category_breakdown.home?.orders ?? 0;
        const weakerSlug = desk < home ? "desk" : "home";

        const categoryId = await getCategoryId(weakerSlug);
        if (!categoryId) {
          // Try alternative slugs
          const altSlug =
            weakerSlug === "desk" ? "desk-accessories" : "home-office";
          const altId = await getCategoryId(altSlug);
          if (!altId) return `Could not find category for ${weakerSlug}`;

          await createPromotion({
            type: "category",
            discount_pct: 8,
            scope_id: altId,
            scope_type: "category",
            reason: `Category imbalance: ${weakerSlug} underperforming (desk: ${desk}, home: ${home})`,
          });

          return `Applied 8% discount to ${weakerSlug} category (${altSlug})`;
        }

        await createPromotion({
          type: "category",
          discount_pct: 8,
          scope_id: categoryId,
          scope_type: "category",
          reason: `Category imbalance: ${weakerSlug} underperforming (desk: ${desk}, home: ${home})`,
        });

        return `Applied 8% discount to ${weakerSlug} category`;
      } catch {
        return "Failed to apply category imbalance boost";
      }
    },
    emailTrigger: "category_spotlight",
  },
];

export async function evaluateAllRules(
  snapshot: SalesSnapshot
): Promise<
  Array<{ rule: string; triggered: boolean; action: string | null }>
> {
  const results: Array<{
    rule: string;
    triggered: boolean;
    action: string | null;
  }> = [];

  try {
    // Check which rules are enabled via settings
    let enabledRules: string[] | null = null;

    try {
      const supabase = createServerClient();
      const { data: setting } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "marketing_rules")
        .single();

      if (setting?.value) {
        const parsed =
          typeof setting.value === "string"
            ? JSON.parse(setting.value)
            : setting.value;
        if (Array.isArray(parsed)) {
          enabledRules = parsed as string[];
        }
      }
    } catch {
      // If settings query fails, run all rules
    }

    for (const rule of MARKETING_RULES) {
      // Skip disabled rules
      if (enabledRules && !enabledRules.includes(rule.name)) {
        results.push({ rule: rule.name, triggered: false, action: null });
        continue;
      }

      try {
        const triggered = await rule.check(snapshot);
        let actionResult: string | null = null;

        if (triggered) {
          actionResult = await rule.action(snapshot);
        }

        await logRuleEvaluation(
          rule.name,
          triggered,
          triggered ? "Condition met" : "Condition not met",
          actionResult,
          snapshot.id || null
        );

        results.push({
          rule: rule.name,
          triggered,
          action: actionResult,
        });
      } catch {
        results.push({ rule: rule.name, triggered: false, action: null });
      }
    }
  } catch {
    // Fail silently
  }

  return results;
}

import { createServerClient } from "@/lib/supabase/server";
import type { SalesSnapshot, EmailCampaign } from "@/types";

const PROMPT_TEMPLATES: Record<string, string> = {
  low_sales_discount: `You are the marketing copywriter for Couranr, a modern desk and home accessories store. Write an email campaign for a limited-time discount.

Tone: warm, confident, not desperate. Create curiosity — make the reader feel like they're discovering something special, not being sold to.

Context:
- We're running a {{discount_pct}}% sitewide sale
- This week: {{total_orders}} orders, \${{total_revenue}} revenue
- Top product: {{top_product_name}}
{{extra_context}}

Write a JSON object with these fields:
- subject: catchy email subject (under 50 chars, curiosity-driven, no ALL CAPS)
- preview_text: preview snippet (under 80 chars)
- headline: main email headline
- body: 2-3 short paragraphs of email body (plain text, conversational)
- cta_text: call-to-action button text (under 25 chars)
- cta_url: "/shop"

Return ONLY valid JSON, no markdown fencing.`,

  flash_sale: `You are the marketing copywriter for Couranr, a modern desk and home accessories store. Write a flash sale email campaign.

Tone: urgent but tasteful. Create excitement without being pushy. Think "a friend tipping you off about a great deal."

Context:
- Flash sale: {{discount_pct}}% off everything
- Limited time offer
- Top product: {{top_product_name}}
{{extra_context}}

Write a JSON object with these fields:
- subject: catchy email subject (under 50 chars, urgency without desperation)
- preview_text: preview snippet (under 80 chars)
- headline: main email headline
- body: 2-3 short paragraphs (plain text, conversational, mention the deal)
- cta_text: call-to-action button text (under 25 chars)
- cta_url: "/shop"

Return ONLY valid JSON, no markdown fencing.`,

  bestseller_spotlight: `You are the marketing copywriter for Couranr, a modern desk and home accessories store. Write an email spotlighting our bestselling product.

Tone: warm, proud, social-proof driven. Make it feel like sharing a beloved item with a friend.

Context:
- Bestseller: {{top_product_name}}
- This week: {{total_orders}} orders
- Revenue: \${{total_revenue}}
{{extra_context}}

Write a JSON object with these fields:
- subject: catchy email subject (under 50 chars, curiosity about the product)
- preview_text: preview snippet (under 80 chars)
- headline: main email headline
- body: 2-3 short paragraphs (plain text, why people love this product)
- cta_text: call-to-action button text (under 25 chars)
- cta_url: "/shop"

Return ONLY valid JSON, no markdown fencing.`,

  trending_product: `You are the marketing copywriter for Couranr, a modern desk and home accessories store. Write an email about a trending product.

Tone: excited but genuine. Share the discovery — like telling a friend "you have to see this."

Context:
- Trending product: {{top_product_name}}
- Gaining momentum with {{total_orders}} orders this week
{{extra_context}}

Write a JSON object with these fields:
- subject: catchy email subject (under 50 chars)
- preview_text: preview snippet (under 80 chars)
- headline: main email headline
- body: 2-3 short paragraphs (plain text, storytelling about the trend)
- cta_text: call-to-action button text (under 25 chars)
- cta_url: "/shop"

Return ONLY valid JSON, no markdown fencing.`,

  category_spotlight: `You are the marketing copywriter for Couranr, a modern desk and home accessories store. Write an email promoting a specific category.

Tone: warm, inviting, discovery-focused. Help the reader reimagine their space.

Context:
- Featured category: {{category_name}}
- Special offer: {{discount_pct}}% off this category
- This week: {{total_orders}} orders across the store
{{extra_context}}

Write a JSON object with these fields:
- subject: catchy email subject (under 50 chars, category-focused)
- preview_text: preview snippet (under 80 chars)
- headline: main email headline
- body: 2-3 short paragraphs (plain text, inspire the reader about the category)
- cta_text: call-to-action button text (under 25 chars)
- cta_url: "/shop"

Return ONLY valid JSON, no markdown fencing.`,
};

function fillTemplate(
  template: string,
  vars: Record<string, string | number>
): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), String(value));
  }
  return result;
}

export async function generateCampaign(
  triggerType: string,
  snapshot: SalesSnapshot,
  extraData?: Record<string, unknown>
): Promise<EmailCampaign> {
  const fallback: EmailCampaign = {
    subject: "Something special at Couranr",
    preview_text: "Your workspace deserves an upgrade",
    headline: "Discover What's New",
    body: "We've got something exciting for you at Couranr. Come take a look at our latest collection of desk and home accessories designed to elevate your everyday.",
    cta_text: "Shop Now",
    cta_url: "/shop",
  };

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return fallback;

    // Look up product name for top_product_id
    let topProductName = "our latest collection";
    if (snapshot.top_product_id) {
      try {
        const supabase = createServerClient();
        const { data: product } = await supabase
          .from("products")
          .select("name")
          .eq("id", snapshot.top_product_id)
          .single();
        if (product?.name) topProductName = product.name;
      } catch {
        // Use default
      }
    }

    const template =
      PROMPT_TEMPLATES[triggerType] ?? PROMPT_TEMPLATES.low_sales_discount;

    const vars: Record<string, string | number> = {
      total_orders: snapshot.total_orders,
      total_revenue: snapshot.total_revenue.toFixed(2),
      top_product_name: topProductName,
      discount_pct: (extraData?.discount_pct as number) ?? 5,
      category_name: (extraData?.category_name as string) ?? "desk accessories",
      extra_context: (extraData?.extra_context as string) ?? "",
    };

    const prompt = fillTemplate(template, vars);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) return fallback;

    const data = await response.json();
    const text = data?.content?.[0]?.text ?? "";

    // Parse JSON from response (handle possible markdown fencing)
    let jsonStr = text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonStr) as EmailCampaign;

    const campaign: EmailCampaign = {
      subject: parsed.subject || fallback.subject,
      preview_text: parsed.preview_text || fallback.preview_text,
      headline: parsed.headline || fallback.headline,
      body: parsed.body || fallback.body,
      cta_text: parsed.cta_text || fallback.cta_text,
      cta_url: parsed.cta_url || fallback.cta_url,
    };

    // Insert to ai_campaigns table
    try {
      const supabase = createServerClient();
      await supabase.from("ai_campaigns").insert({
        subject: campaign.subject,
        preview_text: campaign.preview_text,
        headline: campaign.headline,
        body: campaign.body,
        cta_text: campaign.cta_text,
        cta_url: campaign.cta_url,
        featured_products: snapshot.top_product_id
          ? [snapshot.top_product_id]
          : [],
        trigger_reason: triggerType,
        recipients_count: 0,
        revenue_attributed: 0,
        sent_at: new Date().toISOString(),
      });
    } catch {
      // Fail silently on DB insert
    }

    return campaign;
  } catch {
    return fallback;
  }
}

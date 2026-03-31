import { NextResponse } from "next/server";
import { buildFullContext } from "@/lib/ai/flywheel";
import { logAIInteraction } from "@/lib/ai/interaction-logger";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { items, orderId } = await req.json();

    let purchasedItems = items;

    if (orderId && !items) {
      const supabase = createServerComponentClient({ cookies });
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("product_name, unit_price")
        .eq("order_id", orderId);
      purchasedItems = orderItems;
    }

    if (!purchasedItems || purchasedItems.length === 0) {
      return NextResponse.json(
        { error: "No items to analyze" },
        { status: 400 }
      );
    }

    const productContext = await buildFullContext();
    const startTime = Date.now();

    const prompt = `
${productContext}

CUSTOMER JUST PURCHASED:
${purchasedItems.map((i: { product_name: string; unit_price: number }) => `- ${i.product_name} ($${i.unit_price})`).join("\n")}

You are the Couranr Setup Advisor. Based on what they bought, recommend 2-3 products that would most logically complete their setup.

Think like an interior designer: what is clearly missing from this setup that would make the biggest difference?

Rules:
- Never recommend something they already bought
- Lead with highest-impact gap in their setup
- Frame as "completion" not upselling — they're building something
- Keep reasons specific to what they bought

Return ONLY valid JSON:
{
  "completion_message": "one sentence: your setup is almost complete — here's what's missing",
  "recommendations": [
    {
      "product_name": "exact name from catalog",
      "slug": "product-slug",
      "price": 48.00,
      "reason": "one sentence framed as completing what they started"
    }
  ]
}
`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL ?? "claude-sonnet-4-20250514",
        max_tokens: parseInt(process.env.AI_MAX_TOKENS ?? "1000", 10),
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error("Claude API error:", await response.text());
      return NextResponse.json(
        { error: "AI unavailable" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const responseText =
      data.content?.[0]?.type === "text" ? data.content[0].text : "";
    const responseMs = Date.now() - startTime;

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Could not parse AI response" },
        { status: 500 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);

    await logAIInteraction({
      feature: "setup_completer",
      inputData: { purchasedItems },
      productsRecommended: result.recommendations?.map(
        (r: { slug: string }) => r.slug
      ),
      claudePrompt: prompt.slice(0, 2000),
      claudeResponse: responseText.slice(0, 2000),
      responseMs,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Setup completer error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

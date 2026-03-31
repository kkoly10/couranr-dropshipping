import { NextResponse } from "next/server";
import { buildFullContext } from "@/lib/ai/flywheel";
import { logAIInteraction } from "@/lib/ai/interaction-logger";
import type { QuizAnswers } from "@/types";

export async function POST(req: Request) {
  try {
    const answers: QuizAnswers = await req.json();

    if (!answers.spaceType || !answers.budget) {
      return NextResponse.json(
        { error: "Please complete the quiz" },
        { status: 400 }
      );
    }

    const productContext = await buildFullContext();
    const startTime = Date.now();

    const prompt = `
${productContext}

CUSTOMER QUIZ ANSWERS:
- Space type: ${answers.spaceType}
- Aesthetic preference: ${answers.aesthetic}
- Biggest pain point: ${answers.painPoint}
- Budget: ${answers.budget}
- Current setup: ${answers.currentSetup}

You are the Couranr Space Stylist. Recommend 3-5 products from the catalog above that solve this customer's EXACT situation.

Rules:
- Only recommend products from the catalog
- Lead with the product that solves their #1 pain point
- Explain each recommendation in 1-2 sentences using THEIR words
- If their budget is tight, prioritize highest-impact items
- Calculate total and note savings if bundling makes sense

Return ONLY valid JSON:
{
  "headline": "one sentence that speaks to their situation",
  "recommendations": [
    {
      "product_name": "exact name from catalog",
      "slug": "product-slug",
      "price": 48.00,
      "reason": "one sentence why this fits them",
      "priority": 1
    }
  ],
  "bundle_note": "optional note about savings if buying multiple",
  "total": 144.00
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
        { error: "AI stylist unavailable right now. Please try again." },
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
      feature: "space_stylist",
      inputData: answers,
      productsRecommended: result.recommendations?.map(
        (r: { slug: string }) => r.slug
      ),
      claudePrompt: prompt.slice(0, 2000),
      claudeResponse: responseText.slice(0, 2000),
      responseMs,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Space stylist error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

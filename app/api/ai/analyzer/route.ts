import { NextResponse } from "next/server";
import { buildFullContext } from "@/lib/ai/flywheel";
import { logAIInteraction } from "@/lib/ai/interaction-logger";

export async function POST(req: Request) {
  try {
    const { description, imageBase64, mimeType } = await req.json();

    if (!description && !imageBase64) {
      return NextResponse.json(
        { error: "Provide a description or image" },
        { status: 400 }
      );
    }

    const productContext = await buildFullContext();
    const startTime = Date.now();

    const textPrompt = `
${productContext}

${description ? `CUSTOMER'S SPACE DESCRIPTION:\n"${description}"` : "The customer has uploaded a photo of their space."}

You are an expert workspace and home organization consultant for Couranr.
Analyze ${description ? "this space description" : "the photo"} and identify:
1. The 2-3 most impactful problems to solve
2. The specific Couranr products that solve each problem

Be direct and specific. ${description ? "Use the customer's own words back to them." : "Reference visible elements in the photo."}

Return ONLY valid JSON:
{
  "space_assessment": "2-3 sentences diagnosing what could be improved",
  "top_problems": ["problem 1", "problem 2", "problem 3"],
  "recommendations": [
    {
      "product_name": "exact name from catalog",
      "slug": "product-slug",
      "price": 48.00,
      "solves": "the specific problem this addresses",
      "impact": "high"
    }
  ],
  "total": 144.00,
  "transformation_note": "one sentence about what their space will feel like after"
}
`;

    type MessageContent =
      | { type: "text"; text: string }
      | { type: "image"; source: { type: "base64"; media_type: string; data: string } };

    const content: MessageContent[] = [];
    if (imageBase64) {
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: mimeType ?? "image/jpeg",
          data: imageBase64,
        },
      });
    }
    content.push({ type: "text", text: textPrompt });

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
        messages: [{ role: "user", content }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Claude API error:", err);
      return NextResponse.json(
        { error: "AI analysis unavailable right now. Please try again." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const responseText =
      data.content?.[0]?.type === "text" ? data.content[0].text : "";
    const responseMs = Date.now() - startTime;

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Could not parse AI response" },
        { status: 500 }
      );
    }

    const analysis = JSON.parse(jsonMatch[0]);

    await logAIInteraction({
      feature: "space_analyzer",
      inputData: { description: description?.slice(0, 500), hasImage: !!imageBase64 },
      productsRecommended: analysis.recommendations?.map(
        (r: { slug: string }) => r.slug
      ),
      claudePrompt: textPrompt.slice(0, 2000),
      claudeResponse: responseText.slice(0, 2000),
      responseMs,
    });

    return NextResponse.json(analysis);
  } catch (err) {
    console.error("Space analyzer error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

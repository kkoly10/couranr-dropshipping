import { createServerClient } from "@/lib/supabase/server";
import type { AIFeature } from "@/types";

type AIInteractionLog = {
  feature: AIFeature;
  userId?: string | null;
  sessionId?: string;
  inputData?: Record<string, unknown>;
  productsRecommended?: string[];
  claudePrompt?: string;
  claudeResponse?: string;
  responseMs?: number;
};

export async function logAIInteraction(data: AIInteractionLog) {
  try {
    const supabase = createServerClient();
    await supabase.from("ai_interactions").insert({
      feature: data.feature,
      user_id: data.userId ?? null,
      session_id: data.sessionId ?? null,
      input_data: data.inputData ?? null,
      products_recommended: data.productsRecommended ?? [],
      claude_prompt: data.claudePrompt ?? null,
      claude_response: data.claudeResponse ?? null,
      response_ms: data.responseMs ?? null,
    });
  } catch {
    // Fail silently — never break the user experience
  }
}

export async function logAIConversion(
  sessionId: string,
  productId: string
) {
  try {
    const supabase = createServerClient();
    const { data: interaction } = await supabase
      .from("ai_interactions")
      .select("id, products_added")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (interaction) {
      const updatedAdded = [
        ...((interaction.products_added as string[]) || []),
        productId,
      ];
      await supabase
        .from("ai_interactions")
        .update({
          products_added: updatedAdded,
          conversion: true,
        })
        .eq("id", interaction.id);
    }
  } catch {
    // Fail silently
  }
}

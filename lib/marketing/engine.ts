import { createServerClient } from "@/lib/supabase/server";
import type { SalesSnapshot } from "@/types";
import { buildWeeklySnapshot } from "./analyzer";
import { evaluateAllRules } from "./rules";
import { MARKETING_RULES } from "./rules";
import { generateCampaign } from "./ai-writer";
import { sendCampaign } from "./campaign-sender";

export async function runMarketingEngine(): Promise<{
  snapshot: SalesSnapshot | null;
  rulesEvaluated: number;
  actionsTriggered: string[];
  campaignSent: boolean;
}> {
  const defaultResult = {
    snapshot: null,
    rulesEvaluated: 0,
    actionsTriggered: [] as string[],
    campaignSent: false,
  };

  try {
    // Step 1: Check if engine is enabled
    try {
      const supabase = createServerClient();
      const { data: setting } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "marketing_engine_enabled")
        .single();

      if (setting) {
        const value =
          typeof setting.value === "string"
            ? setting.value
            : JSON.stringify(setting.value);
        if (value === "false" || value === "0" || value === '"false"') {
          return defaultResult;
        }
      }
    } catch {
      // If settings table doesn't exist or query fails, proceed anyway
    }

    // Step 2: Build weekly snapshot
    const snapshot = await buildWeeklySnapshot();
    if (!snapshot) return defaultResult;

    // Step 3: Evaluate all rules
    const ruleResults = await evaluateAllRules(snapshot);

    const actionsTriggered = ruleResults
      .filter((r) => r.triggered && r.action)
      .map((r) => r.action as string);

    // Step 4: Determine email trigger from first triggered rule with emailTrigger
    let campaignSent = false;
    const triggeredRuleWithEmail = ruleResults.find((r) => {
      if (!r.triggered) return false;
      const ruleConfig = MARKETING_RULES.find((mr) => mr.name === r.rule);
      return ruleConfig?.emailTrigger != null;
    });

    if (triggeredRuleWithEmail) {
      const ruleConfig = MARKETING_RULES.find(
        (mr) => mr.name === triggeredRuleWithEmail.rule
      );
      const emailTrigger = ruleConfig?.emailTrigger;

      if (emailTrigger) {
        // Step 5: Generate campaign
        const campaign = await generateCampaign(emailTrigger, snapshot);

        // Step 6: Get subscriber emails
        try {
          const supabase = createServerClient();
          const { data: subscribers } = await supabase
            .from("subscribers")
            .select("email");

          const emails = subscribers?.map((s) => s.email).filter(Boolean) ?? [];

          if (emails.length > 0) {
            // Step 7: Send campaign
            const result = await sendCampaign(campaign, emails);
            campaignSent = result.sent > 0;

            // Update ai_campaigns recipients_count
            try {
              await supabase
                .from("ai_campaigns")
                .update({ recipients_count: result.sent })
                .eq("subject", campaign.subject)
                .eq("trigger_reason", emailTrigger);
            } catch {
              // Fail silently
            }
          }
        } catch {
          // No subscribers table or query failed
        }
      }
    }

    return {
      snapshot,
      rulesEvaluated: ruleResults.length,
      actionsTriggered,
      campaignSent,
    };
  } catch {
    return defaultResult;
  }
}

import { createServerClient } from "@/lib/supabase/server";

export async function logRuleEvaluation(
  ruleName: string,
  triggered: boolean,
  reason: string,
  actionTaken: string | null,
  snapshotId: string | null
): Promise<void> {
  try {
    const supabase = createServerClient();
    await supabase.from("marketing_rule_logs").insert({
      rule_name: ruleName,
      triggered,
      reason,
      action_taken: actionTaken,
      snapshot_id: snapshotId,
    });
  } catch {
    // Fail silently
  }
}

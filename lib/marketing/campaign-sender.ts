import type { EmailCampaign } from "@/types";

export async function sendCampaign(
  campaign: EmailCampaign,
  subscriberEmails: string[]
): Promise<{ sent: number }> {
  let sent = 0;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.FROM_EMAIL || "hello@couranr.com";

    for (const email of subscriberEmails) {
      try {
        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: campaign.subject,
          html: buildEmailHtml(campaign),
        });
        sent++;
      } catch {
        // Fail silently per email — don't stop the batch
      }
    }
  } catch {
    // Fail silently
  }

  return { sent };
}

function buildEmailHtml(campaign: EmailCampaign): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${campaign.subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:40px 32px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-size:28px;font-weight:700;color:#111827;margin:0;">Couranr</h1>
    </div>
    <h2 style="font-size:22px;font-weight:600;color:#111827;margin:0 0 16px;">${campaign.headline}</h2>
    <div style="font-size:16px;line-height:1.6;color:#374151;margin-bottom:24px;">
      ${campaign.body.split("\n").map((p) => `<p style="margin:0 0 12px;">${p}</p>`).join("")}
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="https://couranr.com${campaign.cta_url}" style="display:inline-block;background:#111827;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">${campaign.cta_text}</a>
    </div>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;">
    <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0;">
      Couranr &mdash; Modern desk &amp; home accessories
    </p>
  </div>
</body>
</html>`;
}

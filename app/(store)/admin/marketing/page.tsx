"use client";

import { Fragment, useEffect, useState, useCallback } from "react";
import styles from "./page.module.css";

/* ------------------------------------------------------------------ */
/*  Types (mirroring API response, no lib/marketing imports)          */
/* ------------------------------------------------------------------ */

interface Promotion {
  id: string;
  type: "sitewide" | "category" | "product" | "clearance";
  discount_pct: number;
  scope_id: string | null;
  scope_type: string | null;
  reason: string | null;
  triggered_by: "ai_engine" | "manual";
  active: boolean;
  expires_at: string | null;
  deactivated_at: string | null;
  created_at: string;
}

interface Campaign {
  id: string;
  subject: string;
  preview_text: string | null;
  headline: string | null;
  body: string;
  cta_text: string | null;
  cta_url: string | null;
  featured_products: string[];
  trigger_reason: string | null;
  recipients_count: number;
  open_rate: number | null;
  click_rate: number | null;
  revenue_attributed: number;
  resend_broadcast_id: string | null;
  sent_at: string;
}

interface Snapshot {
  id: string;
  week_start: string;
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  top_product_id: string | null;
  worst_product_id: string | null;
  new_subscribers: number;
  category_breakdown: Record<string, { orders: number; revenue: number }> | null;
  active_promotion: string | null;
  notes: string | null;
  created_at: string;
}

interface RuleLog {
  id: string;
  rule_name: string;
  triggered: boolean;
  reason: string | null;
  action_taken: string | null;
  snapshot_id: string | null;
  created_at: string;
}

type RulesConfig = Record<string, boolean>;

interface MarketingData {
  activePromotions: Promotion[];
  recentCampaigns: Campaign[];
  latestSnapshot: Snapshot | null;
  recentRuleLogs: RuleLog[];
  engineEnabled: boolean;
  rulesConfig: RulesConfig | null;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const RULE_NAMES = [
  "low_sales_sitewide_discount",
  "very_low_sales_discount",
  "strong_sales_remove_discount",
  "dead_product_clearance",
  "winning_product_amplification",
  "category_imbalance_boost",
] as const;

const RULE_LABELS: Record<string, string> = {
  low_sales_sitewide_discount: "Low Sales Sitewide Discount",
  very_low_sales_discount: "Very Low Sales Discount",
  strong_sales_remove_discount: "Strong Sales Remove Discount",
  dead_product_clearance: "Dead Product Clearance",
  winning_product_amplification: "Winning Product Amplification",
  category_imbalance_boost: "Category Imbalance Boost",
};

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "--";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return "--";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function pct(val: number | null | undefined): string {
  if (val == null) return "--";
  return `${(val * 100).toFixed(1)}%`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AdminMarketingPage() {
  const [data, setData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* form state */
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<Promotion["type"]>("sitewide");
  const [formDiscount, setFormDiscount] = useState("");
  const [formReason, setFormReason] = useState("");
  const [formExpires, setFormExpires] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  /* campaign preview expansion */
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);

  /* action buttons loading */
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  /* ── Fetch ── */
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/marketing");
      if (!res.ok) throw new Error("Failed to fetch");
      const json: MarketingData = await res.json();
      setData(json);
      setError(null);
    } catch {
      setError("Could not load marketing data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ── Engine toggle ── */
  async function toggleEngine() {
    if (!data) return;
    const newVal = !data.engineEnabled;
    setData({ ...data, engineEnabled: newVal });
    await fetch("/api/admin/marketing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "marketing_engine_enabled", value: newVal }),
    });
  }

  /* ── Rule toggle ── */
  async function toggleRule(ruleName: string) {
    if (!data) return;
    const current: RulesConfig = data.rulesConfig ?? {};
    const updated = { ...current, [ruleName]: !current[ruleName] };
    setData({ ...data, rulesConfig: updated });
    await fetch("/api/admin/marketing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "marketing_rules", value: updated }),
    });
  }

  /* ── Deactivate promotion ── */
  async function deactivatePromotion(id: string) {
    await fetch("/api/admin/marketing", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promotionId: id }),
    });
    setData((prev) =>
      prev
        ? {
            ...prev,
            activePromotions: prev.activePromotions.filter((p) => p.id !== id),
          }
        : prev
    );
  }

  /* ── Add promotion ── */
  async function handleAddPromotion(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const res = await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formType,
          discount_pct: Number(formDiscount),
          reason: formReason,
          expires_at: formExpires || null,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.promotion) {
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  activePromotions: [...prev.activePromotions, json.promotion],
                }
              : prev
          );
        }
        setShowForm(false);
        setFormDiscount("");
        setFormReason("");
        setFormExpires("");
      }
    } finally {
      setFormSubmitting(false);
    }
  }

  /* ── Manual override actions ── */
  async function runAction(action: string) {
    setActionLoading(action);
    try {
      await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      await fetchData();
    } finally {
      setActionLoading(null);
    }
  }

  /* ── Render ── */

  if (loading) {
    return (
      <section className={styles.page}>
        <h1 className={styles.title}>Marketing Control Panel</h1>
        <p className={styles.loading}>Loading...</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className={styles.page}>
        <h1 className={styles.title}>Marketing Control Panel</h1>
        <p className={styles.error}>{error ?? "Unknown error"}</p>
      </section>
    );
  }

  const lastRunLog = data.recentRuleLogs[0] ?? null;
  const rulesConfig: RulesConfig = data.rulesConfig ?? {};

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Marketing Control Panel</h1>

      <div className={styles.grid}>
        {/* ── 1. Engine Status ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>AI Marketing Engine</h2>
              {lastRunLog && (
                <p className={styles.cardSubtitle}>
                  Last run: {fmtDateTime(lastRunLog.created_at)}
                </p>
              )}
            </div>
            <div className={styles.engineRow}>
              <span
                className={
                  data.engineEnabled ? styles.statusOn : styles.statusOff
                }
              >
                {data.engineEnabled ? "ON" : "OFF"}
              </span>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  className={styles.toggleInput}
                  checked={data.engineEnabled}
                  onChange={toggleEngine}
                />
                <span className={styles.toggleTrack} />
              </label>
            </div>
          </div>
        </div>

        {/* ── 2. Active Promotions ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Active Promotions</h2>
          </div>

          {data.activePromotions.length === 0 ? (
            <p className={styles.empty}>No active promotions.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Discount</th>
                  <th>Reason</th>
                  <th>Expires</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.activePromotions.map((p) => (
                  <tr key={p.id}>
                    <td>{p.type}</td>
                    <td>{p.discount_pct}%</td>
                    <td>{p.reason ?? "--"}</td>
                    <td>{fmtDate(p.expires_at)}</td>
                    <td>
                      <button
                        className={styles.btnDanger}
                        onClick={() => deactivatePromotion(p.id)}
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!showForm ? (
            <button
              className={styles.btnOutline}
              onClick={() => setShowForm(true)}
              style={{ marginTop: "var(--space-3)" }}
            >
              + Add Promotion
            </button>
          ) : (
            <form onSubmit={handleAddPromotion} className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Type</label>
                <select
                  value={formType}
                  onChange={(e) =>
                    setFormType(e.target.value as Promotion["type"])
                  }
                >
                  <option value="sitewide">Sitewide</option>
                  <option value="category">Category</option>
                  <option value="product">Product</option>
                  <option value="clearance">Clearance</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Discount %</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={formDiscount}
                  onChange={(e) => setFormDiscount(e.target.value)}
                  placeholder="10"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Reason</label>
                <input
                  type="text"
                  required
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="Spring sale"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Expires</label>
                <input
                  type="date"
                  value={formExpires}
                  onChange={(e) => setFormExpires(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={formSubmitting}
              >
                {formSubmitting ? "Saving..." : "Create"}
              </button>
              <button
                type="button"
                className={styles.btnOutline}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </form>
          )}
        </div>

        {/* ── 3. Campaign History ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Campaign History</h2>
          </div>

          {data.recentCampaigns.length === 0 ? (
            <p className={styles.empty}>No campaigns sent yet.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Recipients</th>
                  <th>Open Rate</th>
                  <th>Revenue</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.recentCampaigns.map((c) => (
                  <Fragment key={c.id}>
                    <tr>
                      <td>{fmtDate(c.sent_at)}</td>
                      <td>{c.subject}</td>
                      <td>{c.recipients_count}</td>
                      <td>{pct(c.open_rate)}</td>
                      <td>{currencyFmt.format(c.revenue_attributed)}</td>
                      <td>
                        <button
                          className={styles.btnOutline}
                          onClick={() =>
                            setExpandedCampaign(
                              expandedCampaign === c.id ? null : c.id
                            )
                          }
                        >
                          {expandedCampaign === c.id ? "Hide" : "Preview"}
                        </button>
                      </td>
                    </tr>
                    {expandedCampaign === c.id && (
                      <tr>
                        <td colSpan={6}>
                          <div className={styles.previewBody}>{c.body}</div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── 4. Rules Status ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Rules Status</h2>
          </div>
          <div className={styles.rulesList}>
            {RULE_NAMES.map((rule) => (
              <div key={rule} className={styles.ruleRow}>
                <span className={styles.ruleName}>
                  {RULE_LABELS[rule] ?? rule}
                </span>
                <div className={styles.engineRow}>
                  <span
                    className={
                      rulesConfig[rule] ? styles.statusOn : styles.statusOff
                    }
                  >
                    {rulesConfig[rule] ? "ON" : "OFF"}
                  </span>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      className={styles.toggleInput}
                      checked={!!rulesConfig[rule]}
                      onChange={() => toggleRule(rule)}
                    />
                    <span className={styles.toggleTrack} />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. Weekly Snapshot ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>This Week&#39;s Snapshot</h2>
            {data.latestSnapshot && (
              <p className={styles.cardSubtitle}>
                Week of {fmtDate(data.latestSnapshot.week_start)}
              </p>
            )}
          </div>
          {data.latestSnapshot ? (
            <div className={styles.snapshotGrid}>
              <div className={styles.snapshotCard}>
                <p className={styles.snapshotLabel}>Orders</p>
                <p className={styles.snapshotValue}>
                  {data.latestSnapshot.total_orders}
                </p>
              </div>
              <div className={styles.snapshotCard}>
                <p className={styles.snapshotLabel}>Revenue</p>
                <p className={styles.snapshotValue}>
                  {currencyFmt.format(data.latestSnapshot.total_revenue)}
                </p>
              </div>
              <div className={styles.snapshotCard}>
                <p className={styles.snapshotLabel}>AOV</p>
                <p className={styles.snapshotValue}>
                  {currencyFmt.format(data.latestSnapshot.avg_order_value)}
                </p>
              </div>
              <div className={styles.snapshotCard}>
                <p className={styles.snapshotLabel}>Top Product</p>
                <p className={styles.snapshotValueSm}>
                  {data.latestSnapshot.top_product_id ?? "None"}
                </p>
              </div>
            </div>
          ) : (
            <p className={styles.empty}>No snapshot data yet.</p>
          )}
        </div>

        {/* ── 6. Manual Override ── */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Manual Override</h2>
          </div>
          <div className={styles.actionsRow}>
            <button
              className={styles.btnPrimary}
              disabled={actionLoading !== null}
              onClick={() => runAction("force_analyze")}
            >
              {actionLoading === "force_analyze"
                ? "Analyzing..."
                : "Force Analyze Now"}
            </button>
            <button
              className={styles.btnPrimary}
              disabled={actionLoading !== null}
              onClick={() => runAction("force_campaign")}
            >
              {actionLoading === "force_campaign"
                ? "Sending..."
                : "Send Campaign Now"}
            </button>
            <button
              className={styles.btnDanger}
              disabled={actionLoading !== null}
              onClick={() => runAction("pause_all")}
            >
              {actionLoading === "pause_all"
                ? "Pausing..."
                : "Pause All Promotions"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

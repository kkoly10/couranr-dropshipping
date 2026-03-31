"use client";

import { useEffect, useState } from "react";
import AILoadingState from "@/components/ai/AILoadingState";
import AIRecommendationCard from "@/components/ai/AIRecommendationCard";
import type { CompleterResult } from "@/types";
import styles from "./SetupCompleter.module.css";

type SetupCompleterProps = {
  items: { product_name: string; unit_price: number }[];
};

export default function SetupCompleter({ items }: SetupCompleterProps) {
  const [result, setResult] = useState<CompleterResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchRecommendations() {
      try {
        const res = await fetch("/api/ai/completer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });

        if (!res.ok) throw new Error("API error");

        const data: CompleterResult = await res.json();
        if (!cancelled) {
          setResult(data);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchRecommendations();

    return () => {
      cancelled = true;
    };
  }, [items]);

  if (error) return null;

  if (loading) {
    return (
      <div className={styles.section}>
        <AILoadingState message="Finding what completes your setup..." />
      </div>
    );
  }

  if (!result || !result.recommendations?.length) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Complete Your Setup</h2>
      {result.completion_message && (
        <p className={styles.subtitle}>{result.completion_message}</p>
      )}
      <div className={styles.cards}>
        {result.recommendations.map((rec) => (
          <AIRecommendationCard key={rec.slug} recommendation={rec} />
        ))}
      </div>
    </section>
  );
}

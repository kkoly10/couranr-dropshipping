"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import styles from "./PriceAlert.module.css";

interface PriceAlertProps {
  productId: string;
  currentPrice: number;
}

export default function PriceAlert({ productId, currentPrice }: PriceAlertProps) {
  const [expanded, setExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [targetPrice, setTargetPrice] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/price-watch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productId, currentPrice }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setTargetPrice(data.targetPrice);
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.success}>
          <svg
            className={styles.checkIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          You&apos;ll be notified if this drops below{" "}
          {targetPrice !== null ? formatPrice(targetPrice) : formatPrice(Math.round(currentPrice * 0.9))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {!expanded ? (
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setExpanded(true)}
        >
          <svg
            className={styles.bellIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          Get notified if price drops
        </button>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            className={styles.emailInput}
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? "Saving..." : "Watch Price"}
          </button>
        </form>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

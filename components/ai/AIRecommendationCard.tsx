"use client";

import Link from "next/link";
import styles from "./AIRecommendationCard.module.css";
import type { AIRecommendation } from "@/types";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export type AIRecommendationCardProps = {
  recommendation: AIRecommendation;
  onAddToCart?: () => void;
};

export default function AIRecommendationCard({
  recommendation: rec,
  onAddToCart,
}: AIRecommendationCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.body}>
        <Link href={`/product/${rec.slug}`} className={styles.name}>
          {rec.product_name}
        </Link>
        <span className={styles.price}>{formatPrice(rec.price)}</span>
        <p className={styles.reason}>{rec.reason || rec.solves}</p>
        {rec.impact && (
          <span className={`${styles.impact} ${styles[rec.impact]}`}>
            {rec.impact} impact
          </span>
        )}
      </div>
      {onAddToCart && (
        <button onClick={onAddToCart} className={styles.addBtn}>
          Add to Cart
        </button>
      )}
    </div>
  );
}

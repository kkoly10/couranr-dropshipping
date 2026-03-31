"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import AILoadingState from "@/components/ai/AILoadingState";
import type { WishlistItem } from "@/types";
import styles from "./page.module.css";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => setItems(data.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const removeItem = useCallback(async (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
    try {
      await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
    } catch {
      // Silently fail — item already removed from UI optimistically
    }
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>My Wishlist</h1>
          <AILoadingState message="Loading your wishlist..." />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>My Wishlist</h1>
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Your wishlist is empty</p>
            <p className={styles.emptyText}>
              Save products you love and track their prices.
            </p>
            <Link href="/shop" className={styles.shopLink}>
              Browse the shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>My Wishlist</h1>
        <div className={styles.grid}>
          {items.map((item) => {
            const product = item.product;
            const primaryImage = product.images?.find((img) => img.is_primary) ?? product.images?.[0];
            const priceDropped = product.price < item.price_at_add;
            const priceIncreased = product.price > item.price_at_add;

            return (
              <div key={item.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  {primaryImage ? (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.alt_text ?? product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 260px"
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.image} />
                  )}
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeItem(product.id)}
                    aria-label={`Remove ${product.name} from wishlist`}
                    type="button"
                  >
                    &times;
                  </button>
                </div>
                <div className={styles.cardBody}>
                  <Link
                    href={`/product/${product.slug}`}
                    className={styles.productName}
                  >
                    {product.name}
                  </Link>
                  <div className={styles.priceRow}>
                    <span className={styles.currentPrice}>
                      {formatPrice(product.price)}
                    </span>
                    {priceDropped && (
                      <span
                        className={`${styles.priceBadge} ${styles.priceDropped}`}
                      >
                        Price dropped!
                      </span>
                    )}
                    {priceIncreased && (
                      <span
                        className={`${styles.priceBadge} ${styles.priceIncreased}`}
                      >
                        Price increased
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

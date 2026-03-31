"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import type { Product } from "@/types";
import styles from "./BundleBuilder.module.css";

type CategoryFilter = "desk" | "home" | "all";

function calculateBundleDiscount(itemCount: number, subtotal: number): number {
  if (itemCount >= 5) return subtotal * 0.15;
  if (itemCount >= 4) return subtotal * 0.12;
  if (itemCount >= 3) return subtotal * 0.10;
  if (itemCount >= 2) return subtotal * 0.05;
  return 0;
}

function getDiscountPercent(itemCount: number): number {
  if (itemCount >= 5) return 15;
  if (itemCount >= 4) return 12;
  if (itemCount >= 3) return 10;
  if (itemCount >= 2) return 5;
  return 0;
}

function getNextTierInfo(itemCount: number): { needed: number; nextPercent: number } | null {
  if (itemCount < 2) return { needed: 2 - itemCount, nextPercent: 5 };
  if (itemCount < 3) return { needed: 3 - itemCount, nextPercent: 10 };
  if (itemCount < 4) return { needed: 4 - itemCount, nextPercent: 12 };
  if (itemCount < 5) return { needed: 5 - itemCount, nextPercent: 15 };
  return null;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

type Props = {
  products: Product[];
};

export default function BundleBuilder({ products }: Props) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredProducts = useMemo(() => {
    if (categoryFilter === "all") return products;
    return products.filter((p) => {
      const catName = p.category?.name?.toLowerCase() ?? "";
      if (categoryFilter === "desk") {
        return catName.includes("desk") || catName.includes("office") || catName.includes("tech");
      }
      return catName.includes("home") || catName.includes("organization") || catName.includes("storage");
    });
  }, [products, categoryFilter]);

  const selectedProducts = useMemo(
    () => products.filter((p) => selectedIds.has(p.id)),
    [products, selectedIds]
  );

  const subtotal = useMemo(
    () => selectedProducts.reduce((sum, p) => sum + p.price, 0),
    [selectedProducts]
  );

  const discount = calculateBundleDiscount(selectedProducts.length, subtotal);
  const discountPercent = getDiscountPercent(selectedProducts.length);
  const total = subtotal - discount;
  const nextTier = getNextTierInfo(selectedProducts.length);

  // Progress toward next tier: 0-1 scale within current tier bracket
  const progressPercent = useMemo(() => {
    const count = selectedProducts.length;
    if (count >= 5) return 100;
    const tiers = [0, 2, 3, 4, 5];
    const currentTierIdx = tiers.findIndex((t) => count < t);
    if (currentTierIdx === -1) return 100;
    const prevTier = tiers[currentTierIdx - 1] ?? 0;
    const nextTierVal = tiers[currentTierIdx];
    const base = ((prevTier) / 5) * 100;
    const segment = ((nextTierVal - prevTier) / 5) * 100;
    const progress = ((count - prevTier) / (nextTierVal - prevTier)) * segment;
    return Math.min(base + progress, 100);
  }, [selectedProducts.length]);

  function toggleProduct(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function removeProduct(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function handleAddToCart() {
    // This would integrate with the cart context/API
    alert(
      `Bundle added! ${selectedProducts.length} items for ${formatPrice(total)} (saved ${formatPrice(discount)})`
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.categories}>
          <button
            className={`${styles.categoryButton} ${categoryFilter === "desk" ? styles.categoryButtonActive : ""}`}
            onClick={() => setCategoryFilter("desk")}
          >
            Desk Setup
          </button>
          <button
            className={`${styles.categoryButton} ${categoryFilter === "home" ? styles.categoryButtonActive : ""}`}
            onClick={() => setCategoryFilter("home")}
          >
            Home Organization
          </button>
          <button
            className={`${styles.categoryButton} ${categoryFilter === "all" ? styles.categoryButtonActive : ""}`}
            onClick={() => setCategoryFilter("all")}
          >
            Mix Both
          </button>
        </div>

        <div className={styles.grid}>
          {filteredProducts.length === 0 && (
            <p className={styles.emptyGrid}>No products found in this category.</p>
          )}
          {filteredProducts.map((product) => {
            const isAdded = selectedIds.has(product.id);
            const primaryImage =
              product.images.find((img) => img.is_primary) ?? product.images[0];

            return (
              <div
                key={product.id}
                className={`${styles.productCard} ${isAdded ? styles.productCardAdded : ""}`}
              >
                {primaryImage && (
                  <div className={styles.productImageWrapper}>
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.alt_text ?? product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className={styles.productImage}
                    />
                  </div>
                )}
                <span className={styles.productName}>{product.name}</span>
                <span className={styles.productPrice}>
                  {formatPrice(product.price)}
                </span>
                <button
                  className={`${styles.addButton} ${isAdded ? styles.addButtonAdded : ""}`}
                  onClick={() => toggleProduct(product.id)}
                >
                  {isAdded ? "Added \u2713" : "Add to Bundle"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <aside className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>Your Bundle</h3>

        {selectedProducts.length === 0 ? (
          <p className={styles.emptyBundle}>
            Select products to start building your bundle.
          </p>
        ) : (
          <>
            <ul className={styles.bundleList}>
              {selectedProducts.map((p) => (
                <li key={p.id} className={styles.bundleItem}>
                  <span>{p.name}</span>
                  <span>
                    <span className={styles.bundleItemPrice}>
                      {formatPrice(p.price)}
                    </span>
                    <button
                      className={styles.bundleItemRemove}
                      onClick={() => removeProduct(p.id)}
                      aria-label={`Remove ${p.name}`}
                    >
                      &times;
                    </button>
                  </span>
                </li>
              ))}
            </ul>

            <hr className={styles.divider} />

            <div className={styles.pricingRow}>
              <span className={styles.pricingLabel}>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className={styles.pricingRow}>
                <span className={styles.pricingLabel}>
                  Bundle Discount ({discountPercent}%)
                </span>
                <span className={styles.savingsAmount}>
                  &minus;{formatPrice(discount)}
                </span>
              </div>
            )}

            <div className={styles.totalRow}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </>
        )}

        <div className={styles.progressSection}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {nextTier && (
            <span className={styles.progressNudge}>
              Add {nextTier.needed} more to save {nextTier.nextPercent}%!
            </span>
          )}
          {!nextTier && selectedProducts.length >= 5 && (
            <span className={styles.progressNudge}>
              Maximum discount unlocked!
            </span>
          )}
        </div>

        <button
          className={styles.addToCartButton}
          disabled={selectedProducts.length < 2}
          onClick={handleAddToCart}
        >
          Add Bundle to Cart
        </button>
      </aside>
    </div>
  );
}

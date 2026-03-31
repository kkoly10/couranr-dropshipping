"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./WishlistButton.module.css";

type WishlistButtonProps = {
  productId: string;
  currentPrice: number;
};

export default function WishlistButton({
  productId,
  currentPrice,
}: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => {
        const found = data.items?.some(
          (item: { product_id: string }) => item.product_id === productId
        );
        if (found) setWishlisted(true);
      })
      .catch(() => {});
  }, [productId]);

  const toggle = useCallback(async () => {
    const next = !wishlisted;
    setWishlisted(next);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    try {
      if (next) {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, currentPrice }),
        });
      } else {
        await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
      }
    } catch {
      setWishlisted(!next);
    }
  }, [wishlisted, productId, currentPrice]);

  const className = [
    styles.button,
    wishlisted ? styles.active : "",
    animating ? styles.animate : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={className}
      onClick={toggle}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      type="button"
    >
      <svg className={styles.icon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

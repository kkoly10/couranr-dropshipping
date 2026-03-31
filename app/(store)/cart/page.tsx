"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart, getCartSubtotal, getCartItemCount } from "@/lib/cart";
import {
  calculateShipping,
  getShippingMessage,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/shipping";
import QuantitySelector from "@/components/store/QuantitySelector";
import Button from "@/components/ui/Button";
import styles from "./page.module.css";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const [loading, setLoading] = useState(false);
  const subtotal = getCartSubtotal(items);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;
  const shippingMessage = getShippingMessage(subtotal);
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Your Cart</h1>
          <div className={styles.empty}>
            <p>Your cart is empty.</p>
            <Link href="/shop" className={styles.shopLink}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Your Cart</h1>

        <div className={styles.layout}>
          {/* Items */}
          <div className={styles.itemsCol}>
            {/* Shipping bar */}
            <div className={styles.shippingBar}>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className={styles.shippingMessage}>{shippingMessage}</p>
            </div>

            {items.map((item) => {
              const primaryImage =
                item.product.images?.find((img) => img.is_primary) ??
                item.product.images?.[0];

              return (
                <div key={item.product.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    {primaryImage && (
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt_text ?? item.product.name}
                        fill
                        sizes="96px"
                        className={styles.itemImg}
                      />
                    )}
                  </div>
                  <div className={styles.itemDetails}>
                    <Link href={`/product/${item.product.slug}`}>
                      <h3 className={styles.itemName}>{item.product.name}</h3>
                    </Link>
                    <p className={styles.itemPrice}>
                      {formatPrice(item.product.price)}
                    </p>
                    <div className={styles.itemActions}>
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(q) => updateQuantity(item.product.id, q)}
                      />
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className={styles.removeBtn}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className={styles.itemTotal}>
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal ({getCartItemCount(items)} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Button
              variant="primary"
              fullWidth
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Redirecting..." : "Proceed to Checkout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

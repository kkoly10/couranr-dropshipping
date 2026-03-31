"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, getCartSubtotal, getCartItemCount } from "@/lib/cart";
import { calculateShipping, getShippingMessage, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import QuantitySelector from "./QuantitySelector";
import styles from "./CartDrawer.module.css";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function CartDrawer() {
  const { items, isOpen, closeDrawer, removeItem, updateQuantity } = useCart();
  const subtotal = getCartSubtotal(items);
  const shipping = calculateShipping(subtotal);
  const shippingMessage = getShippingMessage(subtotal);
  const itemCount = getCartItemCount(items);
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={closeDrawer} />
      <aside className={styles.drawer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Your Cart ({itemCount})</h2>
          <button onClick={closeDrawer} className={styles.close} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Your cart is empty.</p>
            <Link href="/shop" onClick={closeDrawer} className={styles.shopLink}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Shipping threshold bar */}
            <div className={styles.shippingBar}>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className={styles.shippingMessage}>{shippingMessage}</p>
            </div>

            {/* Items */}
            <div className={styles.items}>
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
                          sizes="64px"
                          className={styles.itemImg}
                        />
                      )}
                    </div>
                    <div className={styles.itemDetails}>
                      <h3 className={styles.itemName}>{item.product.name}</h3>
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
                          aria-label={`Remove ${item.product.name}`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <div className={styles.totals}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
              </div>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className={styles.checkoutBtn}
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

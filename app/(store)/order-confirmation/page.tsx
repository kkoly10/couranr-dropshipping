export const dynamic = "force-dynamic";

import Link from "next/link";
import { stripe } from "@/lib/stripe";
import styles from "./page.module.css";

type OrderConfirmationProps = {
  searchParams: { session_id?: string };
};

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default async function OrderConfirmationPage({
  searchParams,
}: OrderConfirmationProps) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Order Not Found</h1>
          <p className={styles.text}>
            We couldn&apos;t find your order. If you just placed an order, check
            your email for a confirmation.
          </p>
          <Link href="/shop" className={styles.cta}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "shipping_cost"],
    });
  } catch {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Order Not Found</h1>
          <p className={styles.text}>
            We couldn&apos;t retrieve your order details. Please check your email
            for a confirmation.
          </p>
          <Link href="/shop" className={styles.cta}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const lineItems = session.line_items?.data ?? [];
  const shippingAddress = session.shipping_details?.address;
  const shippingName = session.shipping_details?.name;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.check}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h1 className={styles.title}>Thank you for your order!</h1>
        <p className={styles.text}>
          A confirmation email has been sent to{" "}
          <strong>{session.customer_details?.email}</strong>. Your items will
          ship from our U.S. suppliers within 2–8 business days.
        </p>

        {/* Order items */}
        <div className={styles.orderCard}>
          <h2 className={styles.cardTitle}>Order Summary</h2>

          <div className={styles.items}>
            {lineItems.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>
                    {item.description}
                  </span>
                  <span className={styles.itemQty}>Qty: {item.quantity}</span>
                </div>
                <span className={styles.itemPrice}>
                  {formatPrice(item.amount_total)}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>{formatPrice(session.amount_subtotal ?? 0)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Shipping</span>
              <span>
                {session.shipping_cost?.amount_total === 0
                  ? "Free"
                  : formatPrice(session.shipping_cost?.amount_total ?? 0)}
              </span>
            </div>
            <div className={`${styles.totalRow} ${styles.totalFinal}`}>
              <span>Total</span>
              <span>{formatPrice(session.amount_total ?? 0)}</span>
            </div>
          </div>

          {shippingAddress && (
            <div className={styles.shipping}>
              <h3 className={styles.shippingTitle}>Shipping to</h3>
              <p className={styles.shippingAddr}>
                {shippingName}
                <br />
                {shippingAddress.line1}
                {shippingAddress.line2 && (
                  <>
                    <br />
                    {shippingAddress.line2}
                  </>
                )}
                <br />
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.postal_code}
              </p>
            </div>
          )}
        </div>

        <Link href="/shop" className={styles.cta}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

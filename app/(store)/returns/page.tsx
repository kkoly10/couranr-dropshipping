import type { Metadata } from "next";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Return & Refund Policy | Couranr",
  description:
    "Learn about Couranr's 30-day return window, refund process, and how to start a return for your desk setup and home organization products.",
};

export default function ReturnsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Return &amp; Refund Policy</h1>
        <p className={styles.updated}>Last updated: March 2026</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>30-Day Return Window</h2>
          <p className={styles.text}>
            Items may be returned within 30 days of delivery. Products must be
            unused, in original packaging, with all tags attached.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How to Start a Return</h2>
          <p className={styles.text}>
            Email{" "}
            <a href="mailto:returns@mail.couranr.com" className={styles.email}>
              returns@mail.couranr.com
            </a>{" "}
            with your order number and reason for return. We&apos;ll respond
            within 1 business day with return instructions.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Return Shipping</h2>
          <p className={styles.text}>
            Customer pays return shipping unless the item is defective or we
            made an error. We recommend using a trackable shipping method.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Refunds</h2>
          <p className={styles.text}>
            Refunds are processed within 5–7 business days of receiving the
            returned item. Refunds are issued to the original payment method.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Defective Items</h2>
          <p className={styles.text}>
            If your item arrives damaged or defective, we&apos;ll replace it at
            no cost to you. Contact us within 48 hours of delivery with photos
            of the damage.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Non-Returnable Items</h2>
          <p className={styles.text}>
            Clearance items marked &ldquo;final sale&rdquo; cannot be returned.
            Bundle discounts are forfeited if individual items from a bundle are
            returned.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact</h2>
          <p className={styles.text}>
            <a href="mailto:returns@mail.couranr.com" className={styles.email}>
              returns@mail.couranr.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

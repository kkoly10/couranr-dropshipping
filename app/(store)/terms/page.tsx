import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Terms of Service | Couranr",
  description:
    "Read the Terms of Service for Couranr, covering products, fulfillment, shipping, pricing, payments, returns, and liability.",
};

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.updated}>Last updated: March 2026</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Products &amp; Fulfillment</h2>
          <p className={styles.text}>
            All products are fulfilled by third-party U.S.-based suppliers. We
            curate, price, and stand behind every product, but shipping and
            handling are performed by our supplier partners.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Shipping</h2>
          <p className={styles.text}>
            Estimated shipping times (2–8 business days) are provided by our
            suppliers and are not guaranteed. We are not responsible for delays
            caused by suppliers, carriers, weather, or other circumstances
            beyond our control.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Pricing</h2>
          <p className={styles.text}>
            All prices are in USD. Prices are subject to change without notice.
            Promotional discounts may be time-limited and cannot be combined
            unless stated otherwise.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Payment</h2>
          <p className={styles.text}>
            We accept major credit cards and Afterpay. Payment is processed
            securely through Stripe. We do not store your payment information.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Returns</h2>
          <p className={styles.text}>
            Please refer to our{" "}
            <Link href="/returns" className={styles.email}>
              Return &amp; Refund Policy
            </Link>{" "}
            for details.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Intellectual Property</h2>
          <p className={styles.text}>
            All content on couranr.com — including text, images, logos, and
            design — is the property of Couranr and may not be reproduced
            without permission.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
          <p className={styles.text}>
            Couranr is not liable for indirect, incidental, or consequential
            damages arising from the use of our products or services. Our total
            liability is limited to the amount paid for the relevant order.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Governing Law</h2>
          <p className={styles.text}>
            These terms are governed by the laws of the Commonwealth of
            Virginia, United States.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact</h2>
          <p className={styles.text}>
            <a href="mailto:hello@mail.couranr.com" className={styles.email}>
              hello@mail.couranr.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

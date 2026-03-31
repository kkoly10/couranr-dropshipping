import type { Metadata } from "next";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Couranr",
  description:
    "Learn how Couranr collects, uses, and protects your personal data when you shop for desk setup and home organization products.",
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: March 2026</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Information We Collect</h2>
          <p className={styles.text}>
            Name, email address, shipping address, and payment information when
            you place an order. Browsing data through cookies (with your
            consent).
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How We Use Your Data</h2>
          <ul className={styles.list}>
            <li>To fulfill and ship your orders.</li>
            <li>To send order confirmation and shipping updates.</li>
            <li>To send marketing emails (only with your consent).</li>
            <li>
              To improve our website and product recommendations.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Third-Party Services</h2>
          <ul className={styles.list}>
            <li>
              <strong>Stripe</strong> — payment processing.
            </li>
            <li>
              <strong>Supabase</strong> — database.
            </li>
            <li>
              <strong>Resend</strong> — email delivery.
            </li>
            <li>
              <strong>Anthropic Claude</strong> — AI product recommendations (no
              personal data sent, only product catalog).
            </li>
            <li>
              <strong>Google Analytics and Meta Pixel</strong> — analytics, with
              consent.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cookies</h2>
          <p className={styles.text}>
            We use analytics cookies (Google Analytics 4) and advertising
            cookies (Meta Pixel). These are only activated after you accept
            cookies via our consent banner.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Rights</h2>
          <p className={styles.text}>
            You may request deletion of your personal data by emailing{" "}
            <a href="mailto:hello@mail.couranr.com" className={styles.email}>
              hello@mail.couranr.com
            </a>
            . We will process your request within 30 days.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Retention</h2>
          <p className={styles.text}>
            Order data is retained for 3 years for tax and legal purposes.
            Marketing data is deleted upon unsubscribe.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Governing Law</h2>
          <p className={styles.text}>
            This policy is governed by the laws of the Commonwealth of Virginia,
            United States.
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

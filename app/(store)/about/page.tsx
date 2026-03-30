import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About Couranr | Our Story",
  description:
    "Couranr curates desk setup and home organization products from trusted U.S. suppliers. Learn about our mission to help you create a space that works.",
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>About Couranr</h1>
          <p className={styles.subtitle}>
            A better way to set up your space.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.heading}>Our Why</h2>
          <p className={styles.text}>
            We started Couranr because we believe your workspace should work as
            hard as you do. Whether you&apos;re running a business from your
            kitchen table or carving out a corner in a studio apartment, the
            right products can turn any space into a place where great work
            happens.
          </p>
          <p className={styles.text}>
            The name Couranr comes from the French word <em>courant</em> —
            meaning current, flowing, present. It reflects our belief that good
            design should feel effortless and natural, like a workspace that
            just works.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>What We Sell</h2>
          <p className={styles.text}>
            We curate desk setup essentials and small-space home organization
            products — monitor stands, cable management, desk organizers, shelf
            systems, and more. Every product is hand-picked for quality, design,
            and practicality.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Our Supplier Promise</h2>
          <div className={styles.promises}>
            <div className={styles.promise}>
              <h3 className={styles.promiseTitle}>U.S. Suppliers Only</h3>
              <p className={styles.promiseText}>
                Every product ships from a warehouse in the United States. No
                overseas drop-shipping, no 30-day waits.
              </p>
            </div>
            <div className={styles.promise}>
              <h3 className={styles.promiseTitle}>2–8 Day Delivery</h3>
              <p className={styles.promiseText}>
                Standard shipping gets your order to your door in 2 to 8
                business days. Free on orders over $75.
              </p>
            </div>
            <div className={styles.promise}>
              <h3 className={styles.promiseTitle}>Quality First</h3>
              <p className={styles.promiseText}>
                We test and vet every supplier. If a product doesn&apos;t meet
                our standards, we don&apos;t list it — simple as that.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

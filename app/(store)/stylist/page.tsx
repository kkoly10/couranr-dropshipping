import type { Metadata } from "next";
import Link from "next/link";
import SpaceStylist from "@/components/ai/SpaceStylist";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "AI Space Stylist | Couranr",
  description:
    "Answer 5 quick questions and get personalized desk setup and space organization recommendations powered by AI.",
};

export default function StylistPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Get your personalized space recommendation in 60 seconds
          </h1>
          <p className={styles.subtitle}>
            Answer 5 quick questions and our AI will build your perfect setup.
          </p>
        </header>

        <SpaceStylist />

        <Link href="/showcase" className={styles.inspirationLink}>
          Need inspiration? See how others set up their space &rarr;
        </Link>
      </div>
    </div>
  );
}

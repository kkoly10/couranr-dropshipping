import { Metadata } from "next";
import SpaceAnalyzer from "@/components/ai/SpaceAnalyzer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Analyze My Space | Couranr",
  description:
    "Use AI-powered space analysis to get personalized product recommendations for your workspace. Describe your space or upload a photo and we'll tell you exactly what to buy.",
};

export default function MySpacePage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Tell us about your space.</h1>
        <p className={styles.subtitle}>
          Describe your workspace or upload a photo and we&apos;ll recommend
          exactly what to buy.
        </p>
        <SpaceAnalyzer />
      </div>
    </main>
  );
}

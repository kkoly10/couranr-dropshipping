import Link from "next/link";
import ShowcaseSubmitForm from "@/components/ai/ShowcaseSubmitForm";
import styles from "./page.module.css";

export const metadata = {
  title: "Share Your Setup | Couranr",
  description: "Show off your workspace and inspire others.",
};

export default function ShowcaseSubmitPage() {
  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Share Your Setup</h1>
        <p className={styles.subtitle}>
          Show off your workspace and inspire others
        </p>
      </div>

      <ShowcaseSubmitForm />

      <Link href="/showcase" className={styles.backLink}>
        &larr; Back to Gallery
      </Link>
    </section>
  );
}

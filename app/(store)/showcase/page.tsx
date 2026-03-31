import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import ShowcaseGallery from "@/components/ai/ShowcaseGallery";
import type { SetupShowcase } from "@/types";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Setup Showcase | Couranr",
  description: "See how others style their spaces with Couranr products.",
};

export default async function ShowcasePage() {
  const supabase = createServerClient();

  const { data } = await supabase
    .from("setup_showcases")
    .select("*")
    .eq("published", true)
    .order("votes", { ascending: false })
    .limit(20);

  const showcases: SetupShowcase[] = data ?? [];

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Setup Showcase</h1>
        <p className={styles.subtitle}>See how others style their spaces</p>
        <Link href="/showcase/submit" className={styles.shareLink}>
          Share Your Setup
        </Link>
      </div>

      <ShowcaseGallery showcases={showcases} />
    </section>
  );
}

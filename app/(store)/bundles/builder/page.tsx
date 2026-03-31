export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import BundleBuilder from "@/components/ai/BundleBuilder";
import type { Product } from "@/types";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Build Your Bundle | Couranr",
  description:
    "Mix and match desk setup and home organization products. The more you add, the more you save.",
};

export default async function BundleBuilderPage() {
  const supabase = createServerClient();

  const { data } = await supabase
    .from("products")
    .select("*, images:product_images(*), category:categories(*)")
    .eq("in_stock", true)
    .eq("is_bundle", false)
    .order("name");

  const products = (data as Product[]) ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Build your perfect setup.</h1>
          <p className={styles.subtitle}>
            The more you add, the more you save.
          </p>
        </div>

        <BundleBuilder products={products} />

        <Link href="/stylist" className={styles.stylistLink}>
          Not sure where to start? Let AI recommend &rarr;
        </Link>
      </div>
    </div>
  );
}

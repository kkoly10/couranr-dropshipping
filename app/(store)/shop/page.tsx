export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { getActiveSitewidePromotion } from "@/lib/marketing/get-discount";
import ProductGrid from "@/components/store/ProductGrid";
import CategoryFilter from "@/components/store/CategoryFilter";
import SortSelect from "@/components/store/SortSelect";
import type { Product, Category } from "@/types";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Shop All Products | Couranr",
  description:
    "Browse our curated collection of desk setup and home organization products. U.S. fulfilled, ships in 2–8 business days.",
};

type ShopPageProps = {
  searchParams: { category?: string; sort?: string };
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const supabase = createServerClient();
  const { category, sort } = searchParams;

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  let query = supabase
    .from("products")
    .select("*, images:product_images(*), category:categories(*)");

  if (category) {
    const cat = (categories as Category[] | null)?.find(
      (c) => c.slug === category
    );
    if (cat) {
      query = query.eq("category_id", cat.id);
    }
  }

  switch (sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("sort_order").order("is_featured", { ascending: false });
      break;
  }

  const { data: products } = await query;

  const sitewidePromo = await getActiveSitewidePromotion();

  return (
    <div className={styles.page}>
      {sitewidePromo && (
        <div className={styles.promoBanner}>
          <p>{sitewidePromo.discount_pct}% off everything — limited time</p>
          <Link href="/shop" className={styles.promoCta}>Shop Now</Link>
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Shop All</h1>
          <p className={styles.count}>
            {(products as Product[] | null)?.length ?? 0} products
          </p>
        </div>

        <div className={styles.toolbar}>
          <Suspense>
            <CategoryFilter
              categories={(categories as Category[]) ?? []}
              activeSlug={category}
            />
          </Suspense>
          <Suspense>
            <SortSelect />
          </Suspense>
        </div>

        <ProductGrid products={(products as Product[]) ?? []} />
      </div>
    </div>
  );
}

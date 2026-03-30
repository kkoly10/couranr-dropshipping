import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import ProductGrid from "@/components/store/ProductGrid";
import CategoryFilter from "@/components/store/CategoryFilter";
import SortSelect from "@/components/store/SortSelect";
import type { Product, Category } from "@/types";
import styles from "../page.module.css";

type CategoryPageProps = {
  params: { category: string };
  searchParams: { sort?: string };
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const supabase = createServerClient();
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.category)
    .single();

  if (!category) return { title: "Category | Couranr" };

  return {
    title: `${(category as Category).name} Products | Couranr`,
    description:
      (category as Category).description ??
      `Shop ${(category as Category).name} products at Couranr. U.S. fulfilled, ships in 2–8 business days.`,
  };
}

export const dynamicParams = true;
export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const supabase = createServerClient();
  const { sort } = searchParams;

  const { data: allCategories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  const currentCategory = (allCategories as Category[] | null)?.find(
    (c) => c.slug === params.category
  );

  if (!currentCategory) notFound();

  let query = supabase
    .from("products")
    .select("*, images:product_images(*), category:categories(*)")
    .eq("category_id", currentCategory.id);

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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{currentCategory.name}</h1>
          <p className={styles.count}>
            {(products as Product[] | null)?.length ?? 0} products
          </p>
        </div>

        {currentCategory.description && (
          <p style={{
            fontSize: "var(--text-base)",
            color: "var(--color-taupe)",
            lineHeight: 1.6,
            marginBottom: "var(--space-6)",
            maxWidth: "640px",
          }}>
            {currentCategory.description}
          </p>
        )}

        <div className={styles.toolbar}>
          <Suspense>
            <CategoryFilter
              categories={(allCategories as Category[]) ?? []}
              activeSlug={params.category}
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

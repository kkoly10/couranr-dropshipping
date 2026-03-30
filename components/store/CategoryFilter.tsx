"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./CategoryFilter.module.css";
import type { Category } from "@/types";

export type CategoryFilterProps = {
  categories: Category[];
  activeSlug?: string;
};

export default function CategoryFilter({ categories, activeSlug }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleFilter(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.pill} ${!activeSlug ? styles.active : ""}`}
        onClick={() => handleFilter(null)}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`${styles.pill} ${activeSlug === cat.slug ? styles.active : ""}`}
          onClick={() => handleFilter(cat.slug)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

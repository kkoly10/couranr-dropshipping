"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types";
import styles from "./ProductImageGallery.module.css";

export type ProductImageGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const [active, setActive] = useState(0);

  if (sorted.length === 0) {
    return (
      <div className={styles.placeholder}>
        <span>No image available</span>
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <Image
          src={sorted[active].url}
          alt={sorted[active].alt_text ?? productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.mainImage}
          priority
        />
      </div>
      {sorted.length > 1 && (
        <div className={styles.thumbs}>
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`${styles.thumb} ${i === active ? styles.thumbActive : ""}`}
            >
              <Image
                src={img.url}
                alt={img.alt_text ?? `${productName} ${i + 1}`}
                fill
                sizes="80px"
                className={styles.thumbImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

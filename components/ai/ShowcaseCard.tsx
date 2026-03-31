"use client";

import Image from "next/image";
import styles from "./ShowcaseCard.module.css";
import type { SetupShowcase } from "@/types";

export type ShowcaseCardProps = {
  showcase: SetupShowcase;
  onVote?: () => void;
};

export default function ShowcaseCard({ showcase, onVote }: ShowcaseCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={showcase.image_url}
          alt={showcase.title || showcase.display_name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={styles.image}
        />
      </div>

      <div className={styles.body}>
        <p className={styles.displayName}>{showcase.display_name}</p>
        {showcase.title && (
          <h3 className={styles.title}>{showcase.title}</h3>
        )}
        {showcase.description && (
          <p className={styles.description}>{showcase.description}</p>
        )}

        <div className={styles.footer}>
          <button
            className={styles.voteBtn}
            onClick={onVote}
            type="button"
            aria-label={`Upvote – ${showcase.votes} votes`}
          >
            <svg
              className={styles.voteIcon}
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M8 3L13 10H3L8 3Z"
                fill="currentColor"
              />
            </svg>
            <span>{showcase.votes}</span>
          </button>

          {showcase.tagged_products.length > 0 && (
            <span className={styles.tagCount}>
              {showcase.tagged_products.length}{" "}
              {showcase.tagged_products.length === 1 ? "product" : "products"}{" "}
              tagged
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

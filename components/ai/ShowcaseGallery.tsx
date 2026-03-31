"use client";

import { useState } from "react";
import ShowcaseCard from "./ShowcaseCard";
import styles from "./ShowcaseGallery.module.css";
import type { SetupShowcase } from "@/types";

export type ShowcaseGalleryProps = {
  showcases: SetupShowcase[];
};

export default function ShowcaseGallery({
  showcases: initial,
}: ShowcaseGalleryProps) {
  const [showcases, setShowcases] = useState(initial);

  async function handleVote(id: string) {
    // Optimistic update
    setShowcases((prev) =>
      prev.map((s) => (s.id === id ? { ...s, votes: s.votes + 1 } : s))
    );

    try {
      const res = await fetch("/api/showcase/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showcaseId: id }),
      });

      if (!res.ok) {
        // Revert on failure
        setShowcases((prev) =>
          prev.map((s) => (s.id === id ? { ...s, votes: s.votes - 1 } : s))
        );
      }
    } catch {
      setShowcases((prev) =>
        prev.map((s) => (s.id === id ? { ...s, votes: s.votes - 1 } : s))
      );
    }
  }

  if (showcases.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No setups shared yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {showcases.map((s) => (
        <ShowcaseCard
          key={s.id}
          showcase={s}
          onVote={() => handleVote(s.id)}
        />
      ))}
    </div>
  );
}

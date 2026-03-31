"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SetupShowcase } from "@/types";
import styles from "./page.module.css";

export default function AdminShowcasePage() {
  const [showcases, setShowcases] = useState<SetupShowcase[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAll() {
    setLoading(true);
    const { data } = await supabase
      .from("setup_showcases")
      .select("*")
      .order("created_at", { ascending: false });

    setShowcases(data ?? []);
    setLoading(false);
  }

  async function handleApprove(id: string) {
    await supabase
      .from("setup_showcases")
      .update({ published: true })
      .eq("id", id);

    setShowcases((prev) =>
      prev.map((s) => (s.id === id ? { ...s, published: true } : s))
    );
  }

  async function handleReject(id: string) {
    await supabase.from("setup_showcases").delete().eq("id", id);

    setShowcases((prev) => prev.filter((s) => s.id !== id));
  }

  if (loading) {
    return (
      <section className={styles.page}>
        <h1 className={styles.title}>Manage Showcases</h1>
        <p className={styles.loading}>Loading...</p>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Manage Showcases</h1>

      {showcases.length === 0 ? (
        <p className={styles.empty}>No showcases submitted yet.</p>
      ) : (
        <div className={styles.list}>
          {showcases.map((s) => (
            <div key={s.id} className={styles.card}>
              <div className={styles.imageWrap}>
                <Image
                  src={s.image_url}
                  alt={s.title || s.display_name}
                  fill
                  sizes="120px"
                  className={styles.image}
                />
              </div>

              <div className={styles.info}>
                <p className={styles.name}>{s.display_name}</p>
                {s.title && <p className={styles.itemTitle}>{s.title}</p>}
                <p className={styles.meta}>
                  Votes: {s.votes} &middot;{" "}
                  {s.published ? (
                    <span className={styles.published}>Published</span>
                  ) : (
                    <span className={styles.pending}>Pending</span>
                  )}
                  {s.is_seeded && " \u00B7 Seeded"}
                </p>
                {s.description && (
                  <p className={styles.desc}>{s.description}</p>
                )}
              </div>

              <div className={styles.actions}>
                {!s.published && (
                  <button
                    className={styles.approveBtn}
                    onClick={() => handleApprove(s.id)}
                  >
                    Approve
                  </button>
                )}
                <button
                  className={styles.rejectBtn}
                  onClick={() => handleReject(s.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

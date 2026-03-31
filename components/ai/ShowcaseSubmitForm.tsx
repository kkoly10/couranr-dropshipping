"use client";

import { useState } from "react";
import styles from "./ShowcaseSubmitForm.module.css";

export default function ShowcaseSubmitForm() {
  const [displayName, setDisplayName] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [taggedProducts, setTaggedProducts] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!displayName.trim() || !imageUrl.trim()) {
      setError("Display name and image URL are required.");
      return;
    }

    setLoading(true);

    try {
      const slugs = taggedProducts
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/showcase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: displayName.trim(),
          title: title.trim() || undefined,
          image_url: imageUrl.trim(),
          description: description.trim() || undefined,
          tagged_products: slugs,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={styles.success}>
        <p>Thanks! Your setup is pending review.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}

      <label className={styles.label}>
        <span className={styles.labelText}>
          Display Name <span className={styles.required}>*</span>
        </span>
        <input
          type="text"
          className={styles.input}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name or alias"
          required
        />
      </label>

      <label className={styles.label}>
        <span className={styles.labelText}>Title</span>
        <input
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. My Minimalist Desk Setup"
        />
      </label>

      <label className={styles.label}>
        <span className={styles.labelText}>
          Image URL <span className={styles.required}>*</span>
        </span>
        <input
          type="url"
          className={styles.input}
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
          required
        />
      </label>

      <label className={styles.label}>
        <span className={styles.labelText}>Description</span>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell us about your setup..."
          rows={4}
        />
      </label>

      <label className={styles.label}>
        <span className={styles.labelText}>Tagged Products</span>
        <input
          type="text"
          className={styles.input}
          value={taggedProducts}
          onChange={(e) => setTaggedProducts(e.target.value)}
          placeholder="product-slug-1, product-slug-2"
        />
        <span className={styles.hint}>Comma-separated product slugs</span>
      </label>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? "Submitting..." : "Share Your Setup"}
      </button>
    </form>
  );
}

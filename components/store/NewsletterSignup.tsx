"use client";

import { useState } from "react";
import styles from "./NewsletterSignup.module.css";

export type NewsletterSignupProps = {
  className?: string;
};

export default function NewsletterSignup({ className = "" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to subscribe");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={`${styles.wrapper} ${className}`}>
        <p className={styles.success}>You&apos;re in! Thanks for subscribing.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${styles.wrapper} ${className}`}>
      <div className={styles.inputGroup}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={styles.button}
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p className={styles.error}>Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

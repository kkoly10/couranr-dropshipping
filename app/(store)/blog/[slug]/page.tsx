export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/types";
import styles from "./page.module.css";

type BlogPostPageProps = {
  params: { slug: string };
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const supabase = createServerClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (!post) return { title: "Blog | Couranr" };

  const p = post as BlogPost;
  return {
    title: p.meta_title ?? `${p.title} | Couranr Blog`,
    description: p.meta_description ?? p.excerpt ?? undefined,
    openGraph: {
      title: p.title,
      description: p.excerpt ?? undefined,
      images: p.cover_image_url ? [p.cover_image_url] : undefined,
      type: "article",
    },
  };
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const supabase = createServerClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (!post) notFound();

  const p = post as BlogPost;

  return (
    <article className={styles.page}>
      <div className={styles.container}>
        <Link href="/blog" className={styles.back}>
          &larr; Back to Blog
        </Link>

        <header className={styles.header}>
          {p.published_at && (
            <time className={styles.date}>{formatDate(p.published_at)}</time>
          )}
          <h1 className={styles.title}>{p.title}</h1>
          {p.excerpt && <p className={styles.excerpt}>{p.excerpt}</p>}
        </header>

        {p.cover_image_url && (
          <div className={styles.coverWrapper}>
            <Image
              src={p.cover_image_url}
              alt={p.title}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className={styles.coverImage}
              priority
            />
          </div>
        )}

        {p.content && (
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: p.content }}
          />
        )}

        {p.tags && p.tags.length > 0 && (
          <div className={styles.tags}>
            {p.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

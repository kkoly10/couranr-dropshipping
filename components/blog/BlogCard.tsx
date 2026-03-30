import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types";
import styles from "./BlogCard.module.css";

export type BlogCardProps = {
  post: BlogPost;
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className={styles.card}>
      {post.cover_image_url && (
        <div className={styles.imageWrapper}>
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.body}>
        {post.published_at && (
          <span className={styles.date}>{formatDate(post.published_at)}</span>
        )}
        <h3 className={styles.title}>{post.title}</h3>
        {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
      </div>
    </Link>
  );
}

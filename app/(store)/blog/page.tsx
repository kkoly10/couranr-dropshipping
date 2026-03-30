export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import BlogCard from "@/components/blog/BlogCard";
import type { BlogPost } from "@/types";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Blog | Couranr",
  description:
    "Desk setup tips, home organization ideas, and remote work productivity guides from Couranr.",
};

export default async function BlogIndexPage() {
  const supabase = createServerClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  const blogPosts = (posts as BlogPost[]) ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>
          Tips, guides, and ideas to help you create a workspace that works.
        </p>

        {blogPosts.length === 0 ? (
          <p className={styles.empty}>
            No posts yet. Check back soon for desk setup tips and organization guides.
          </p>
        ) : (
          <div className={styles.grid}>
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

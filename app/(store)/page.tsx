export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@/lib/supabase/server";
import TrustBar from "@/components/store/TrustBar";
import ProductGrid from "@/components/store/ProductGrid";
import BlogCard from "@/components/blog/BlogCard";
import NewsletterSignup from "@/components/store/NewsletterSignup";
import type { Product, BlogPost, Category } from "@/types";
import styles from "./page.module.css";

export default async function HomePage() {
  const supabase = createServerClient();

  const [
    { data: featuredProducts },
    { data: categories },
    { data: bundleSpotlight },
    { data: blogPosts },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*, images:product_images(*), category:categories(*)")
      .eq("is_featured", true)
      .eq("in_stock", true)
      .order("sort_order")
      .limit(4),
    supabase
      .from("categories")
      .select("*")
      .order("sort_order")
      .limit(2),
    supabase
      .from("products")
      .select("*, images:product_images(*), category:categories(*)")
      .eq("is_bundle", true)
      .eq("is_featured", true)
      .limit(1),
    supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Your space, elevated.</h1>
          <p className={styles.heroSub}>
            Curated desk setup &amp; home organization products, fulfilled from
            U.S. suppliers and shipped to your door in 2&ndash;8 days.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/shop" className={styles.ctaPrimary}>
              Shop Now
            </Link>
            <Link href="/bundles" className={styles.ctaSecondary}>
              Explore Bundles
            </Link>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* Featured Categories */}
      {categories && categories.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Shop by Category</h2>
            <div className={styles.categoryGrid}>
              {(categories as Category[]).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop/${cat.slug}`}
                  className={styles.categoryCard}
                >
                  {cat.image_url && (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={styles.categoryImage}
                    />
                  )}
                  <div className={styles.categoryOverlay}>
                    <h3 className={styles.categoryName}>{cat.name}</h3>
                    {cat.description && (
                      <p className={styles.categoryDesc}>{cat.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Featured Products</h2>
              <Link href="/shop" className={styles.viewAll}>
                View All
              </Link>
            </div>
            <ProductGrid products={featuredProducts as Product[]} />
          </div>
        </section>
      )}

      {/* Bundle Spotlight */}
      {bundleSpotlight && bundleSpotlight.length > 0 && (
        <section className={styles.bundleSection}>
          <div className={styles.container}>
            <div className={styles.bundleInner}>
              <div className={styles.bundleImage}>
                {(bundleSpotlight[0] as Product).images?.[0] && (
                  <Image
                    src={(bundleSpotlight[0] as Product).images[0].url}
                    alt={(bundleSpotlight[0] as Product).name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={styles.bundleImg}
                  />
                )}
              </div>
              <div className={styles.bundleInfo}>
                <span className={styles.bundleLabel}>Bundle &amp; Save</span>
                <h2 className={styles.bundleName}>
                  {(bundleSpotlight[0] as Product).name}
                </h2>
                <p className={styles.bundleDesc}>
                  {(bundleSpotlight[0] as Product).description}
                </p>
                <Link
                  href={`/product/${(bundleSpotlight[0] as Product).slug}`}
                  className={styles.ctaPrimary}
                >
                  Shop This Bundle
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Preview */}
      {blogPosts && blogPosts.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>From the Blog</h2>
              <Link href="/blog" className={styles.viewAll}>
                Read More
              </Link>
            </div>
            <div className={styles.blogGrid}>
              {(blogPosts as BlogPost[]).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className={styles.newsletterSection}>
        <div className={styles.container}>
          <div className={styles.newsletterInner}>
            <h2 className={styles.sectionTitle}>
              Join the Couranr community
            </h2>
            <p className={styles.newsletterText}>
              Get desk setup tips, exclusive deals, and early access to new
              products. No spam, ever.
            </p>
            <div className={styles.newsletterForm}>
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

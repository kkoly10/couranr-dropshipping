import Link from "next/link";
import NewsletterSignup from "./NewsletterSignup";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand}>
          <h2 className={styles.logo}>COURANR</h2>
          <p className={styles.tagline}>
            Curated desk setup &amp; home organization for the modern remote worker.
          </p>
        </div>

        {/* Quick Links */}
        <div className={styles.column}>
          <h3 className={styles.heading}>Quick Links</h3>
          <ul className={styles.linkList}>
            <li><Link href="/shop">Shop All</Link></li>
            <li><Link href="/bundles">Bundles</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className={styles.column}>
          <h3 className={styles.heading}>Legal</h3>
          <ul className={styles.linkList}>
            <li><Link href="/returns">Returns &amp; Refunds</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className={styles.column}>
          <h3 className={styles.heading}>Stay in the Loop</h3>
          <p className={styles.newsletterText}>
            Get desk setup tips and exclusive deals. No spam, ever.
          </p>
          <NewsletterSignup />
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Couranr. All rights reserved.</p>
      </div>
    </footer>
  );
}

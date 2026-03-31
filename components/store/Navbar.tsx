"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart, getCartItemCount } from "@/lib/cart";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { items, toggleDrawer } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartItemCount = mounted ? getCartItemCount(items) : 0;

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <nav className={styles.nav}>
        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`} />
        </button>

        {/* Logo */}
        <Link href="/" className={styles.logo}>
          COURANR
        </Link>

        {/* Desktop Links */}
        <ul className={styles.links}>
          <li><Link href="/shop">Shop</Link></li>
          <li><Link href="/bundles">Bundles</Link></li>
          <li><Link href="/stylist">Get My Setup</Link></li>
          <li><Link href="/showcase">Showcase</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>

        {/* Icons */}
        <div className={styles.icons}>
          {/* Wishlist */}
          <Link href="/account/wishlist" className={styles.iconBtn} aria-label="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>

          {/* Search */}
          <button className={styles.iconBtn} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Account */}
          <Link href="/account" className={styles.iconBtn} aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          {/* Cart */}
          <button
            className={styles.iconBtn}
            onClick={toggleDrawer}
            aria-label="Cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartItemCount > 0 && (
              <span className={styles.cartCount}>{cartItemCount}</span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className={styles.mobileMenu}>
          <li><Link href="/shop" onClick={() => setMenuOpen(false)}>Shop</Link></li>
          <li><Link href="/bundles" onClick={() => setMenuOpen(false)}>Bundles</Link></li>
          <li><Link href="/stylist" onClick={() => setMenuOpen(false)}>Get My Setup</Link></li>
          <li><Link href="/showcase" onClick={() => setMenuOpen(false)}>Showcase</Link></li>
          <li><Link href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link></li>
          <li><Link href="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
        </ul>
      )}
    </header>
  );
}

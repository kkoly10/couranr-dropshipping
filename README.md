# Couranr — Desk Setup & Home Organization

A focused U.S.-fulfilled dropshipping store selling desk setup and small-space home organization products.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Google OAuth + Email)
- **Payments**: Stripe + Afterpay/Affirm
- **Hosting**: Vercel

## Getting Started

1. Copy `.env.local` and fill in your credentials
2. Run `npm install`
3. Run `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

Blueprint to build entire website:
# Couranr — Full Technical Blueprint
**Version:** 1.0  
**Date:** March 2026  
**Owner:** Komlan  
**Domain:** couranr.com

---

## 1. Project Overview

Couranr is a focused U.S.-fulfilled dropshipping store selling desk setup and small-space home organization products. The brand targets productivity-minded remote workers and small business owners. All products ship from U.S.-based suppliers (Zendrop + Spocket) in 2–8 business days.

**Core Goals**
- Reach $500/month revenue by month 6
- Organic traffic via SEO blog + Pinterest + Meta ads ($130/month)
- High-trust, low-friction customer experience
- Minimal operational overhead as a solo operator

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Google OAuth + Email) |
| Storage | Supabase Storage (product images) |
| Payments | Stripe + Afterpay/Affirm |
| Hosting | Vercel |
| Repo | GitHub |
| Email | Resend (transactional) |
| Suppliers | Zendrop + Spocket (CSV import) |

---

## 3. Brand Tokens

All tokens must be defined in `/app/globals.css` as CSS custom properties.

```css
:root {
  /* Colors */
  --color-ivory:      #FAF8F2;
  --color-clay:       #B84C2A;
  --color-clay-hover: #A03E22;
  --color-espresso:   #1C1208;
  --color-sand:       #E4DDD0;
  --color-taupe:      #9A8F83;
  --color-white:      #FFFFFF;
  --color-error:      #C0392B;
  --color-success:    #2D6A4F;

  /* Typography */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body:    'Outfit', system-ui, sans-serif;

  /* Type Scale */
  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 15px;
  --text-lg:   18px;
  --text-xl:   24px;
  --text-2xl:  32px;
  --text-3xl:  44px;
  --text-4xl:  56px;

  /* Spacing */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  24px;
  --space-6:  32px;
  --space-7:  48px;
  --space-8:  64px;
  --space-9:  96px;

  /* Layout */
  --container-max:  1200px;
  --container-pad:  24px;
  --radius-sm:      3px;
  --radius-md:      6px;
  --radius-lg:      12px;

  /* Transitions */
  --transition: 200ms ease;
}
```

**Fonts** — load via Fontsource (npm packages, no Google Fonts CDN dependency):
```bash
npm install @fontsource/playfair-display @fontsource/outfit
```

Import in `/app/layout.tsx`:
```ts
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/700.css'
import '@fontsource/outfit/300.css'
import '@fontsource/outfit/400.css'
import '@fontsource/outfit/500.css'
```

---

## 4. Project Folder Structure

```
couranr/
├── app/
│   ├── (store)/                    # Store layout group
│   │   ├── layout.tsx              # Store shell (nav + footer)
│   │   ├── page.tsx                # Homepage
│   │   ├── shop/
│   │   │   ├── page.tsx            # All products
│   │   │   └── [category]/
│   │   │       └── page.tsx        # Category page (desk, home)
│   │   ├── product/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Product detail page
│   │   ├── bundles/
│   │   │   └── page.tsx            # Bundles / kits page
│   │   ├── cart/
│   │   │   └── page.tsx            # Cart page
│   │   ├── checkout/
│   │   │   └── page.tsx            # Checkout page
│   │   ├── order-confirmation/
│   │   │   └── page.tsx            # Post-purchase confirmation
│   │   ├── account/
│   │   │   ├── page.tsx            # Account dashboard
│   │   │   └── orders/
│   │   │       └── page.tsx        # Order history
│   │   ├── blog/
│   │   │   ├── page.tsx            # Blog index
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Blog post
│   │   ├── about/
│   │   │   └── page.tsx            # About page
│   │   └── contact/
│   │       └── page.tsx            # Contact page
│   ├── (auth)/                     # Auth layout group (no nav/footer)
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (admin)/                    # Admin layout group (protected)
│   │   ├── layout.tsx
│   │   └── admin/
│   │       ├── page.tsx            # Admin dashboard
│   │       ├── products/
│   │       │   ├── page.tsx        # Product list + CSV import
│   │       │   └── [id]/
│   │       │       └── page.tsx    # Edit product
│   │       ├── orders/
│   │       │   └── page.tsx        # Order management
│   │       └── blog/
│   │           ├── page.tsx        # Blog post list
│   │           └── new/
│   │               └── page.tsx    # New/edit post
│   ├── api/
│   │   ├── stripe/
│   │   │   ├── checkout/
│   │   │   │   └── route.ts        # Create Stripe checkout session
│   │   │   └── webhook/
│   │   │       └── route.ts        # Stripe webhook handler
│   │   ├── products/
│   │   │   └── import/
│   │   │       └── route.ts        # CSV import endpoint
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts        # Supabase OAuth callback
│   ├── globals.css
│   └── layout.tsx                  # Root layout
├── components/
│   ├── ui/                         # Base design system
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── Divider.tsx
│   ├── store/                      # Store-specific components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductImageGallery.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── BundleCard.tsx
│   │   ├── TestimonialSection.tsx
│   │   ├── TrustBar.tsx
│   │   └── NewsletterSignup.tsx
│   ├── checkout/
│   │   ├── CheckoutForm.tsx
│   │   ├── OrderSummary.tsx
│   │   └── ShippingCalculator.tsx
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   └── BlogContent.tsx
│   └── admin/
│       ├── ProductImportForm.tsx
│       └── OrderTable.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   ├── server.ts               # Server Supabase client
│   │   └── middleware.ts           # Auth middleware helper
│   ├── stripe.ts                   # Stripe instance
│   ├── shipping.ts                 # Shipping logic
│   ├── cart.ts                     # Cart utilities
│   └── utils.ts                    # General helpers
├── types/
│   └── index.ts                    # All TypeScript types
├── middleware.ts                   # Next.js route protection
├── .env.local                      # Environment variables
└── next.config.ts
```

---

## 5. Supabase Database Schema

Run these in Supabase SQL editor in order.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES (extends Supabase auth.users)
CREATE TABLE profiles (
  id            UUID REFERENCES auth.users(id) PRIMARY KEY,
  email         TEXT,
  full_name     TEXT,
  avatar_url    TEXT,
  role          TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT,
  image_url     TEXT,
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,                    -- Original SEO description (NOT supplier copy)
  supplier_desc   TEXT,                    -- Raw supplier description (internal only)
  price           DECIMAL(10,2) NOT NULL,
  compare_price   DECIMAL(10,2),           -- Crossed-out original price
  cost            DECIMAL(10,2),           -- Your cost from supplier
  category_id     UUID REFERENCES categories(id),
  supplier        TEXT CHECK (supplier IN ('zendrop', 'spocket')),
  supplier_id     TEXT,                    -- Supplier's product ID
  sku             TEXT,
  weight_oz       DECIMAL(6,2),
  in_stock        BOOLEAN DEFAULT TRUE,
  is_featured     BOOLEAN DEFAULT FALSE,
  is_bundle       BOOLEAN DEFAULT FALSE,
  tags            TEXT[],
  meta_title      TEXT,
  meta_description TEXT,
  sort_order      INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCT IMAGES
CREATE TABLE product_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT,
  sort_order  INT DEFAULT 0,
  is_primary  BOOLEAN DEFAULT FALSE
);

-- BUNDLE ITEMS (for bundle/kit products)
CREATE TABLE bundle_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bundle_id   UUID REFERENCES products(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id),
  quantity    INT DEFAULT 1
);

-- ORDERS
CREATE TABLE orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID REFERENCES profiles(id),
  guest_email       TEXT,                  -- For guest checkout
  status            TEXT DEFAULT 'pending'
                    CHECK (status IN ('pending','paid','processing','shipped','delivered','cancelled','refunded')),
  stripe_payment_id TEXT,
  stripe_session_id TEXT,
  subtotal          DECIMAL(10,2) NOT NULL,
  shipping_cost     DECIMAL(10,2) DEFAULT 0,
  total             DECIMAL(10,2) NOT NULL,
  shipping_name     TEXT,
  shipping_address  JSONB,                 -- {line1, line2, city, state, zip, country}
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ORDER ITEMS
CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id),
  product_name TEXT NOT NULL,             -- Snapshot at time of purchase
  quantity    INT NOT NULL,
  unit_price  DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

-- CART (persistent server-side cart)
CREATE TABLE cart_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id),
  quantity    INT NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- BLOG POSTS
CREATE TABLE blog_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  excerpt         TEXT,
  content         TEXT,                   -- Markdown or HTML
  cover_image_url TEXT,
  author_id       UUID REFERENCES profiles(id),
  published       BOOLEAN DEFAULT FALSE,
  published_at    TIMESTAMPTZ,
  meta_title      TEXT,
  meta_description TEXT,
  tags            TEXT[],
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- NEWSLETTER SUBSCRIBERS
CREATE TABLE subscribers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Profiles: users see their own, admins see all
CREATE POLICY "Users see own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Orders: users see their own
CREATE POLICY "Users see own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Cart: users manage their own
CREATE POLICY "Users manage own cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- Blog: published posts are public
CREATE POLICY "Public reads published posts" ON blog_posts
  FOR SELECT USING (published = TRUE);

-- Products, categories, images: public read
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads products" ON products FOR SELECT USING (TRUE);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads categories" ON categories FOR SELECT USING (TRUE);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads images" ON product_images FOR SELECT USING (TRUE);
```

---

## 6. TypeScript Types

Define all types in `/types/index.ts`:

```ts
export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  sort_order: number
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_price: number | null
  category_id: string | null
  supplier: 'zendrop' | 'spocket'
  supplier_id: string | null
  sku: string | null
  in_stock: boolean
  is_featured: boolean
  is_bundle: boolean
  tags: string[]
  meta_title: string | null
  meta_description: string | null
  images: ProductImage[]
  category?: Category
}

export type ProductImage = {
  id: string
  product_id: string
  url: string
  alt_text: string | null
  sort_order: number
  is_primary: boolean
}

export type CartItem = {
  id: string
  product_id: string
  quantity: number
  product: Product
}

export type Order = {
  id: string
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  subtotal: number
  shipping_cost: number
  total: number
  shipping_address: ShippingAddress
  items: OrderItem[]
  created_at: string
}

export type OrderItem = {
  id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export type ShippingAddress = {
  line1: string
  line2?: string
  city: string
  state: string
  zip: string
  country: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image_url: string | null
  published: boolean
  published_at: string | null
  meta_title: string | null
  meta_description: string | null
  tags: string[]
}

export type Profile = {
  id: string
  email: string
  full_name: string | null
  role: 'customer' | 'admin'
}
```

---

## 7. Environment Variables

Create `.env.local` at root (never commit this file):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App
NEXT_PUBLIC_SITE_URL=https://couranr.com
NEXT_PUBLIC_SITE_NAME=Couranr

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=hello@couranr.com

# Admin
ADMIN_EMAIL=your_email@gmail.com
```

---

## 8. Page Inventory & Purpose

| Page | Route | Purpose |
|---|---|---|
| Homepage | `/` | Hero, featured products, categories, trust bar, newsletter |
| Shop All | `/shop` | Full product grid with filters |
| Category | `/shop/desk` `/shop/home` | Filtered product grid |
| Product Detail | `/product/[slug]` | Images, description, add to cart, related |
| Bundles | `/bundles` | Curated kit products |
| Cart | `/cart` | Cart review, shipping preview |
| Checkout | `/checkout` | Stripe form, address, Afterpay option |
| Order Confirmation | `/order-confirmation` | Thank you, order summary |
| Account | `/account` | Profile, order history |
| Login | `/login` | Google OAuth + email |
| Signup | `/signup` | New account |
| Blog Index | `/blog` | Grid of posts |
| Blog Post | `/blog/[slug]` | Full post, SEO optimized |
| About | `/about` | Brand story, supplier promise |
| Contact | `/contact` | Simple contact form |
| Admin Dashboard | `/admin` | Stats overview (protected) |
| Admin Products | `/admin/products` | Product list + CSV import |
| Admin Orders | `/admin/orders` | Order management |
| Admin Blog | `/admin/blog` | Blog post editor |

---

## 9. Component Specifications

### Navbar
- Logo: "COURANR" in Playfair Display
- Links: Shop, Bundles, Blog, About
- Right: Search icon, Account icon, Cart icon with item count
- Mobile: Hamburger menu
- Behavior: Sticky on scroll, background transitions from transparent to ivory

### ProductCard
Props: `product: Product`
- Primary image with hover secondary image swap
- Category badge (clay colored)
- Product name in Playfair Display
- Price + compare price (struck through)
- "Add to cart" button appears on hover
- "New" badge if created within 30 days
- "Best Seller" badge if tagged

### CartDrawer
- Slides in from right
- Shows all cart items with quantity controls
- Subtotal + shipping threshold progress bar ("$X away from free shipping")
- Checkout CTA button
- Persistent across pages via Zustand or React Context

### TrustBar
Strip below hero with 4 icons:
- US Suppliers Only
- Ships in 2–8 Days
- Free Returns
- Free Shipping Over $75

### ShippingCalculator (in cart)
Logic:
```ts
export function calculateShipping(subtotal: number): number {
  return subtotal >= 75 ? 0 : 5.99
}
```

---

## 10. Shipping Logic

Simple and transparent — no complex real-time rate calculations at launch.

```ts
// lib/shipping.ts
export const FREE_SHIPPING_THRESHOLD = 75
export const FLAT_RATE = 5.99

export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_RATE
}

export function getShippingMessage(subtotal: number): string {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 'You qualify for free shipping!'
  }
  const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)
  return `Add $${remaining} more for free shipping`
}
```

---

## 11. Stripe Integration

### Checkout flow
1. User clicks "Checkout" in cart
2. POST to `/api/stripe/checkout` with cart items
3. Server creates Stripe Checkout Session with:
   - Line items from cart
   - Shipping options (free or $5.99)
   - Afterpay/Affirm as payment method option
   - Success URL: `/order-confirmation?session_id={CHECKOUT_SESSION_ID}`
   - Cancel URL: `/cart`
4. Redirect user to Stripe hosted checkout
5. On success, webhook fires to `/api/stripe/webhook`
6. Webhook creates order record in Supabase
7. Webhook triggers confirmation email via Resend

### Stripe Checkout Session config
```ts
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card', 'afterpay_clearpay'],
  line_items: cartItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: { name: item.product.name },
      unit_amount: Math.round(item.product.price * 100),
    },
    quantity: item.quantity,
  })),
  shipping_options: [
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: { amount: 0, currency: 'usd' },
        display_name: 'Free shipping',
        delivery_estimate: {
          minimum: { unit: 'business_day', value: 2 },
          maximum: { unit: 'business_day', value: 8 },
        },
      },
    },
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: { amount: 599, currency: 'usd' },
        display_name: 'Standard shipping',
        delivery_estimate: {
          minimum: { unit: 'business_day', value: 2 },
          maximum: { unit: 'business_day', value: 8 },
        },
      },
    },
  ],
  mode: 'payment',
  success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
})
```

---

## 12. Auth Setup

### Supabase Auth config
Enable in Supabase dashboard:
- Email provider (with confirm email = true)
- Google OAuth provider
  - Add callback URL: `https://couranr.com/api/auth/callback`

### Middleware — protect admin and account routes
```ts
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isAccountRoute = req.nextUrl.pathname.startsWith('/account')

  if (!session && (isAdminRoute || isAccountRoute)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}
```

---

## 13. CSV Product Import

Zendrop and Spocket both export CSVs. Define the expected column mapping:

### Expected CSV columns
```
name, sku, supplier_id, supplier, price, cost, compare_price,
category, description, tags, weight_oz, image_url_1, image_url_2,
image_url_3, image_url_4
```

### Import endpoint behavior (`/api/products/import`)
1. Accept multipart CSV upload
2. Parse CSV rows
3. Auto-generate slug from name (kebab-case)
4. Insert into `products` table
5. Insert images into `product_images` table
6. Return success count and any error rows

### Admin UI
- `/admin/products` page has a drag-and-drop CSV upload area
- Preview table shows first 5 rows before confirming import
- Error rows are shown with reason after import

---

## 14. SEO Architecture

Every page must export metadata. Use Next.js 14 Metadata API.

```ts
// Example: product page
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug)
  return {
    title: product.meta_title ?? `${product.name} | Couranr`,
    description: product.meta_description ?? product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]?.url],
      type: 'website',
    },
  }
}
```

### SEO checklist per page type

**Product pages**
- Unique title: `[Product Name] | Couranr`
- Original description (never supplier copy)
- OG image from primary product image
- Structured data: `Product` schema with price, availability

**Blog posts**
- Unique title + meta description
- OG image from cover image
- Structured data: `Article` schema
- Target one primary keyword per post

**Category pages**
- Title: `[Category] Products | Couranr`
- Unique intro paragraph per category

### Blog content strategy (first 10 posts)
1. "5 desk upgrades under $75 that actually make a difference"
2. "How to organize a small home office in a weekend"
3. "The minimalist desk setup guide for remote workers"
4. "Best cable management solutions for a clean desk"
5. "How to set up a productive work-from-home corner in any room"
6. "Small space storage hacks that cost less than $50"
7. "The best laptop stands for neck pain relief"
8. "How to organize under your desk (without buying expensive furniture)"
9. "Morning routine organization tips for work-from-home professionals"
10. "The complete WFH desk setup checklist"

---

## 15. Claude Code Prompting Phases

Execute these in order. Never combine phases. Always verify each phase builds and deploys cleanly before moving to the next.

---

### Phase 1 — Foundation
**Prompt for Claude Code:**

```
I am building a Next.js 14 App Router e-commerce store called Couranr (couranr.com). 
This is a dropshipping store selling desk setup and home organization products.

Set up the complete project foundation:

1. Install dependencies:
   - @supabase/supabase-js @supabase/auth-helpers-nextjs
   - stripe @stripe/stripe-js
   - @fontsource/playfair-display @fontsource/outfit
   - resend
   - zustand (for cart state)
   - papaparse @types/papaparse (for CSV import)
   - slugify

2. Create /app/globals.css with all CSS custom properties from this design system:
   [paste Section 3 — Brand Tokens]

3. Create /app/layout.tsx importing both font CSS files and globals.css. 
   Set html lang="en". Meta charset and viewport tags. Root layout wraps children.

4. Create /types/index.ts with all TypeScript types:
   [paste Section 6 — TypeScript Types]

5. Create /lib/supabase/client.ts — browser Supabase client
6. Create /lib/supabase/server.ts — server Supabase client using cookies
7. Create /lib/stripe.ts — Stripe instance
8. Create /lib/shipping.ts — shipping logic
9. Create /lib/utils.ts — include: formatPrice(cents), slugify(text), formatDate(date), truncate(text, length)

10. Create /middleware.ts — route protection for /admin and /account

11. Create .env.local with all required variables as empty placeholders

12. Create /next.config.ts with:
    - images.domains: ['images.zendrop.com', 'images.spocket.co', your_supabase_project.supabase.co]
    - No other changes needed at this stage

After setup, run the dev server and confirm zero TypeScript errors and zero build errors.
```

---

### Phase 2 — Design System Components
**Prompt for Claude Code:**

```
Build the complete UI component library for Couranr using the Ivory & Clay design system.

Brand tokens are already in /app/globals.css. Use CSS modules or Tailwind — 
whichever is already configured. Do NOT use any external component library 
(no shadcn, no MUI). Build everything from scratch matching the design.

Design reference:
- Primary font: Playfair Display (headings, product names, prices)
- Body font: Outfit (everything else)
- Clay accent: #B84C2A
- Ivory background: #FAF8F2
- Espresso text: #1C1208
- Buttons: sharp 2-3px border-radius, uppercase tracking, no rounded pill shapes
- Cards: soft border, slight background tint, clean hover states

Build these components:

/components/ui/
- Button.tsx — variants: primary (clay fill), secondary (espresso fill), ghost (outlined)
- Badge.tsx — variants: new, bestseller, sale, instock, category
- Input.tsx — labeled input with error state
- Card.tsx — base card wrapper

/components/store/
- Navbar.tsx — sticky, logo left, nav links center, icons right, mobile hamburger
- Footer.tsx — 3 column: brand/tagline, quick links, newsletter input
- ProductCard.tsx — image, badge, name (Playfair), price, hover add-to-cart
- ProductGrid.tsx — responsive grid of ProductCards, accepts products array
- TrustBar.tsx — 4 icons strip: US Suppliers, Ships 2-8 Days, Free Returns, Free Shipping $75+
- NewsletterSignup.tsx — email input + subscribe button, success state

All components must be TypeScript. Export types for all props. 
No hardcoded colors — use CSS custom properties.
Build and verify zero errors after each component.
```

---

### Phase 3 — Store Pages
**Prompt for Claude Code:**

```
Build all customer-facing store pages for Couranr.

All pages use the App Router. Server components by default, 
client components only where interactivity is required.
All pages use the Navbar and Footer from /components/store/.

Build these pages:

1. /app/(store)/layout.tsx
   - Wraps all store pages with Navbar + Footer
   - Ivory background

2. /app/(store)/page.tsx (Homepage)
   - Hero section: large Playfair headline "Your space, elevated."
     Subheadline, two CTA buttons (Shop Now, Explore Bundles)
     TrustBar component below hero
   - Featured categories: 2 cards (Desk Setup, Home Organization)
   - Featured products: grid of 4 ProductCards (fetch is_featured=true from Supabase)
   - Bundle spotlight: 1 featured bundle with description
   - Blog preview: 3 latest published blog posts
   - NewsletterSignup section

3. /app/(store)/shop/page.tsx
   - Fetch all products from Supabase
   - CategoryFilter component (All, Desk Setup, Home Organization, Bundles)
   - ProductGrid component
   - Sort by: Featured, Price Low-High, Price High-Low, Newest

4. /app/(store)/shop/[category]/page.tsx
   - Same as shop but filtered by category slug
   - generateStaticParams for desk and home slugs

5. /app/(store)/product/[slug]/page.tsx
   - ProductImageGallery (main image + thumbnails)
   - Product name (Playfair, large)
   - Price + compare price
   - Category badge
   - Description (original, SEO copy)
   - Quantity selector
   - Add to Cart button (clay, full width)
   - Shipping info: "Ships in 2–8 business days from the U.S."
   - Related products grid (same category, 4 products)
   - generateMetadata for SEO

6. /app/(store)/bundles/page.tsx
   - Grid of is_bundle=true products
   - Each with what's included list

7. /app/(store)/about/page.tsx
   - Brand story (our why, the Couranr name origin)
   - Supplier promise (US only, 2-8 days)
   - Simple, editorial layout

8. /app/(store)/blog/page.tsx
   - Grid of published BlogCards

9. /app/(store)/blog/[slug]/page.tsx
   - Full post with cover image, content, author, date
   - generateMetadata for SEO

Fetch all data server-side using Supabase server client.
Use generateMetadata on all product and blog pages.
Build and verify zero errors.
```

---

### Phase 4 — Cart & Checkout
**Prompt for Claude Code:**

```
Build the cart and checkout system for Couranr.

Cart state: use Zustand for client-side cart (works for guest users).
Authenticated users: sync cart to Supabase cart_items table.

1. Create /lib/cart.ts — Zustand store:
   - State: items (CartItem[]), isOpen (boolean)
   - Actions: addItem, removeItem, updateQuantity, clearCart, toggleDrawer
   - Persist to localStorage for guests
   - On auth, sync local cart to Supabase

2. /components/store/CartDrawer.tsx
   - Slides in from right (position absolute, not fixed — use layout trick)
   - Lists all cart items with image, name, price, quantity controls
   - Shipping threshold progress bar with getShippingMessage()
   - Subtotal + estimated shipping
   - "Proceed to Checkout" button (clay)
   - Overlay backdrop that closes drawer on click

3. /app/(store)/cart/page.tsx
   - Full cart page (same content as drawer but full page)
   - For users who prefer full page checkout flow

4. /api/stripe/checkout/route.ts
   - POST handler
   - Accept cart items from request body
   - Validate items exist in Supabase (prevent price manipulation)
   - Create Stripe Checkout Session with:
     - All cart line items
     - Both shipping options (free / $5.99)
     - afterpay_clearpay as payment method
     - Correct success and cancel URLs
   - Return session URL

5. /api/stripe/webhook/route.ts
   - Handle checkout.session.completed event
   - Create order in Supabase orders table
   - Create order_items records
   - Send confirmation email via Resend
   - Return 200

6. /app/(store)/order-confirmation/page.tsx
   - Read session_id from URL params
   - Fetch session from Stripe
   - Display order summary, items, shipping address
   - "Continue Shopping" CTA

Build and verify the full checkout flow end to end in Stripe test mode.
```

---

### Phase 5 — Auth & Account
**Prompt for Claude Code:**

```
Build authentication and customer account pages for Couranr.

Auth provider: Supabase Auth with Google OAuth and email/password.

1. /api/auth/callback/route.ts
   - Handle OAuth callback
   - Exchange code for session
   - Redirect to /account on success

2. /app/(auth)/login/page.tsx
   - Google Sign In button (primary)
   - Divider "or continue with email"
   - Email + password form
   - "Don't have an account?" link to signup
   - Ivory background, centered card layout

3. /app/(auth)/signup/page.tsx
   - Google Sign Up button
   - Email + password + confirm password form
   - On success: create profile record in Supabase profiles table

4. /app/(store)/account/page.tsx (protected)
   - Display name, email
   - Edit profile form
   - Link to order history

5. /app/(store)/account/orders/page.tsx (protected)
   - Fetch orders for current user from Supabase
   - Table: order ID, date, status badge, total, view button
   - Order detail modal or expand on click

6. Navbar updates:
   - If authenticated: show avatar/name + dropdown (Account, Orders, Sign Out)
   - If guest: show "Sign In" link

Also create a trigger in Supabase to auto-create a profile on new user signup:

SQL:
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
```

---

### Phase 6 — Admin Panel
**Prompt for Claude Code:**

```
Build the admin panel for Couranr. All admin routes are protected 
by middleware (admin role check in profiles table).

1. /app/(admin)/layout.tsx
   - Sidebar nav: Dashboard, Products, Orders, Blog
   - Different layout from store (no store Navbar/Footer)
   - Check user role = 'admin', redirect to / if not

2. /app/(admin)/admin/page.tsx
   - Stats cards: Total orders, Revenue this month, Total products, 
     Pending orders
   - Recent orders table (last 10)

3. /app/(admin)/admin/products/page.tsx
   - Product table: image, name, category, price, stock, supplier
   - CSV Import section:
     - Drag and drop CSV upload using papaparse
     - Preview first 5 rows in a table
     - Column mapping confirmation
     - Import button → POST to /api/products/import
     - Success/error summary after import
   - Edit button per product

4. /api/products/import/route.ts
   - Accept CSV file upload
   - Parse with papaparse
   - Map columns to product schema
   - Auto-generate slugs
   - Batch insert to products and product_images tables
   - Return { imported: number, errors: string[] }

5. /app/(admin)/admin/orders/page.tsx
   - Orders table with status filter
   - Update order status dropdown per order
   - Export to CSV button

6. /app/(admin)/admin/blog/page.tsx
   - Blog posts list with published toggle
   - New post button

7. /app/(admin)/admin/blog/new/page.tsx
   - Title, slug (auto-generated), excerpt
   - Content textarea (Markdown)
   - Cover image URL
   - Tags input
   - Meta title + meta description
   - Save draft / Publish buttons
```

---

## 16. Launch Checklist

Before going live, verify every item:

**Technical**
- [ ] All env variables set in Vercel dashboard
- [ ] Supabase RLS policies tested
- [ ] Stripe webhook endpoint registered and verified
- [ ] Stripe test mode → live mode switch
- [ ] Custom domain couranr.com connected to Vercel
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Google OAuth redirect URIs updated for production domain
- [ ] Images loading from correct domains

**Content**
- [ ] At least 30 products imported and live
- [ ] All product descriptions original (not supplier copy)
- [ ] At least 2 categories with products
- [ ] At least 1 bundle product
- [ ] About page complete
- [ ] First blog post published
- [ ] Footer links all working

**SEO**
- [ ] sitemap.xml generated (use next-sitemap)
- [ ] robots.txt configured
- [ ] Google Search Console verified
- [ ] OG images set on homepage, products, blog

**Business**
- [ ] Zendrop/Spocket supplier accounts active
- [ ] Test order placed and fulfilled end to end
- [ ] Resend email confirmed sending
- [ ] Stripe live keys active
- [ ] Return/refund policy page live
- [ ] Privacy policy page live
- [ ] Terms of service page live

---

*End of Blueprint v1.0 — Couranr*

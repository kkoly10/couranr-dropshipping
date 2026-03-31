# Couranr — Full Technical Blueprint
**Version:** 2.2
**Date:** March 2026
**Owner:** Komlan
**Domain:** couranr.com

---

## Changelog v2.0 → v2.1
- Added 8 AI-powered differentiating features (Phase 4B)
- Added Claude API integration architecture
- Added AI context builder pattern
- Added data flywheel progression plan (Phase 1 → Phase 3)
- Added `ai_interactions` tracking table
- Added `wishlists`, `price_watches`, `setup_showcases` tables
- Added seeding strategy for Setup Showcase Community
- Updated tech stack with Claude AI (Anthropic API)
- Updated phase plan — Phase 4B inserted between Phase 4 and Phase 5
- Total phases: 13

## Changelog v2.1 → v2.2
- Added Phase 4C — AI Marketing Engine (closed-loop self-adjusting system)
- Added `promotions`, `ai_campaigns`, `sales_snapshots` Supabase tables
- Added marketing rules engine with 6 automatic levers
- Added AI email writer (Claude generates weekly campaigns automatically)
- Added 5 new Vercel cron jobs for marketing automation
- Added `/admin/marketing` control panel with master kill switch
- Updated phase plan — Phase 4C inserted between Phase 4B and Phase 5
- Total phases: 14

---

## 1. Project Overview

Couranr is a focused U.S.-fulfilled dropshipping store selling desk setup and small-space home organization products. The brand targets productivity-minded remote workers and small business owners. Products are sourced from 6 suppliers via a custom automated sync engine that updates every hour. All products ship from U.S. locations in 2–8 business days.

Couranr differentiates through 8 AI-powered features that no dropshipping competitor offers — powered by Claude AI and the live product catalog, operational from day one without requiring customer behavioral data.

**Core Goals**
- Reach $500/month revenue by month 6
- Organic traffic via SEO blog + Pinterest + Meta ads ($130/month)
- High-trust, AI-personalized customer experience
- Fully automated supplier sync and order fulfillment
- Minimal operational overhead as a solo operator

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Google OAuth + Email) |
| Storage | Supabase Storage (product images) |
| Payments | Stripe + Afterpay/Affirm + Stripe Tax |
| Hosting | Vercel |
| Repo | GitHub |
| Email | Resend (transactional + marketing sequences) |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| Supplier Sync | Playwright (web scraper) + Vercel Cron |
| Supplier API | CJ Dropshipping REST API |
| Analytics | Google Analytics 4 + Meta Pixel |
| Reviews | Custom (Supabase) |
| Tax | Stripe Tax |
| Monitoring | Vercel + custom alerting via Resend |

---

## 3. Brand Tokens

All tokens must be defined in `/app/globals.css` as CSS custom properties.

```css
:root {
  --color-ivory:      #FAF8F2;
  --color-clay:       #B84C2A;
  --color-clay-hover: #A03E22;
  --color-espresso:   #1C1208;
  --color-sand:       #E4DDD0;
  --color-taupe:      #9A8F83;
  --color-white:      #FFFFFF;
  --color-error:      #C0392B;
  --color-success:    #2D6A4F;

  --font-display: 'Playfair Display', Georgia, serif;
  --font-body:    'Outfit', system-ui, sans-serif;

  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 15px;
  --text-lg:   18px;
  --text-xl:   24px;
  --text-2xl:  32px;
  --text-3xl:  44px;
  --text-4xl:  56px;

  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  24px;
  --space-6:  32px;
  --space-7:  48px;
  --space-8:  64px;
  --space-9:  96px;

  --container-max:  1200px;
  --container-pad:  24px;
  --radius-sm:      3px;
  --radius-md:      6px;
  --radius-lg:      12px;
  --transition:     200ms ease;
}
```

---

## 4. Updated Folder Structure

```
couranr/
├── app/
│   ├── (store)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── shop/
│   │   │   ├── page.tsx
│   │   │   └── [category]/page.tsx
│   │   ├── product/[slug]/page.tsx
│   │   ├── bundles/
│   │   │   ├── page.tsx
│   │   │   └── builder/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── order-confirmation/page.tsx
│   │   ├── account/
│   │   │   ├── page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── wishlist/page.tsx
│   │   ├── stylist/page.tsx
│   │   ├── my-space/page.tsx
│   │   ├── showcase/
│   │   │   ├── page.tsx
│   │   │   └── submit/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── returns/page.tsx
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── products/page.tsx
│   │       ├── orders/page.tsx
│   │       ├── sync/page.tsx
│   │       ├── margins/page.tsx
│   │       ├── ai-interactions/page.tsx
│   │       ├── showcase/page.tsx
│   │       ├── marketing/page.tsx
│   │       └── blog/page.tsx
│   ├── api/
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts
│   │   │   └── webhook/route.ts
│   │   ├── ai/
│   │   │   ├── stylist/route.ts
│   │   │   ├── analyzer/route.ts
│   │   │   ├── completer/route.ts
│   │   │   └── bundle-suggester/route.ts
│   │   ├── wishlist/route.ts
│   │   ├── price-watch/route.ts
│   │   ├── showcase/route.ts
│   │   ├── reviews/route.ts
│   │   ├── marketing/
│   │   │   ├── analyze/route.ts
│   │   │   ├── campaign/route.ts
│   │   │   ├── clearance/route.ts
│   │   │   ├── promotions/route.ts
│   │   │   └── snapshot/route.ts
│   │   ├── admin/
│   │   │   └── marketing/route.ts
│   │   ├── cron/
│   │   │   ├── sync/route.ts
│   │   │   ├── margins/route.ts
│   │   │   ├── price-alerts/route.ts
│   │   │   └── abandoned-cart/route.ts
│   │   ├── orders/fulfill/route.ts
│   │   ├── newsletter/route.ts
│   │   └── auth/callback/route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Divider.tsx
│   ├── store/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductImageGallery.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── BundleCard.tsx
│   │   ├── TrustBar.tsx
│   │   ├── NewsletterSignup.tsx
│   │   ├── ReviewSection.tsx
│   │   ├── ReviewForm.tsx
│   │   └── SupplierBadge.tsx
│   ├── ai/
│   │   ├── SpaceStylist.tsx
│   │   ├── SpaceAnalyzer.tsx
│   │   ├── SetupCompleter.tsx
│   │   ├── BundleBuilder.tsx
│   │   ├── AIRecommendationCard.tsx
│   │   └── AILoadingState.tsx
│   ├── showcase/
│   │   ├── ShowcaseGallery.tsx
│   │   ├── ShowcaseCard.tsx
│   │   └── ShowcaseSubmitForm.tsx
│   ├── wishlist/
│   │   ├── WishlistButton.tsx
│   │   ├── WishlistPage.tsx
│   │   └── PriceWatchToggle.tsx
│   ├── analytics/
│   │   ├── MetaPixel.tsx
│   │   └── GoogleAnalytics.tsx
│   ├── checkout/
│   │   ├── CheckoutForm.tsx
│   │   ├── OrderSummary.tsx
│   │   └── ShippingCalculator.tsx
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   └── BlogContent.tsx
│   └── admin/
│       ├── SyncDashboard.tsx
│       ├── MarginMonitor.tsx
│       ├── AIInteractionsDashboard.tsx
│       └── OrderTable.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── ai/
│   │   ├── context-builder.ts
│   │   ├── space-stylist.ts
│   │   ├── space-analyzer.ts
│   │   ├── setup-completer.ts
│   │   ├── bundle-suggester.ts
│   │   ├── interaction-logger.ts
│   │   └── flywheel.ts
│   ├── marketing/
│   │   ├── engine.ts
│   │   ├── analyzer.ts
│   │   ├── rules.ts
│   │   ├── levers.ts
│   │   ├── ai-writer.ts
│   │   ├── campaign-sender.ts
│   │   └── logger.ts
│   ├── sync/
│   │   ├── engine.ts
│   │   ├── zendrop-scraper.ts
│   │   ├── spocket-scraper.ts
│   │   ├── cj-api.ts
│   │   ├── wayfair-scraper.ts
│   │   ├── homedepot-scraper.ts
│   │   ├── walmart-scraper.ts
│   │   ├── normalizer.ts
│   │   ├── margin-checker.ts
│   │   └── fallback.ts
│   ├── fulfillment/
│   │   ├── router.ts
│   │   ├── zendrop-fulfiller.ts
│   │   ├── spocket-fulfiller.ts
│   │   ├── cj-fulfiller.ts
│   │   ├── wayfair-fulfiller.ts
│   │   ├── homedepot-fulfiller.ts
│   │   └── walmart-fulfiller.ts
│   ├── email/
│   │   ├── welcome.ts
│   │   ├── abandoned-cart.ts
│   │   ├── order-confirmation.ts
│   │   ├── shipping-update.ts
│   │   ├── review-request.ts
│   │   ├── price-alert.ts
│   │   └── win-back.ts
│   ├── stripe.ts
│   ├── shipping.ts
│   ├── cart.ts
│   └── utils.ts
├── types/index.ts
├── middleware.ts
├── vercel.json
├── .env.local
└── next.config.ts
```

---

## 5. Database Schema v2.1

Includes all new tables for AI features on top of v2.0 schema.

```sql
-- ============================================
-- ADD TO EXISTING v2.0 SCHEMA
-- ============================================

-- WISHLISTS
CREATE TABLE wishlists (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  price_at_add DECIMAL(10,2),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- PRICE WATCHES (for price drop alerts)
CREATE TABLE price_watches (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT NOT NULL,
  user_id         UUID REFERENCES profiles(id),
  product_id      UUID REFERENCES products(id) ON DELETE CASCADE,
  target_price    DECIMAL(10,2),
  price_at_watch  DECIMAL(10,2) NOT NULL,
  alerted         BOOLEAN DEFAULT FALSE,
  alerted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, product_id)
);

-- PRICE HISTORY (populated by sync engine)
CREATE TABLE price_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  price       DECIMAL(10,2) NOT NULL,
  cost        DECIMAL(10,2),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- SETUP SHOWCASES (community gallery)
CREATE TABLE setup_showcases (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES profiles(id),
  display_name    TEXT NOT NULL,
  title           TEXT,
  image_url       TEXT NOT NULL,
  description     TEXT,
  tagged_products UUID[],
  votes           INT DEFAULT 0,
  published       BOOLEAN DEFAULT FALSE,
  is_seeded       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- SHOWCASE VOTES
CREATE TABLE showcase_votes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  showcase_id   UUID REFERENCES setup_showcases(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES profiles(id),
  ip_address    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(showcase_id, user_id)
);

-- AI INTERACTIONS (data flywheel)
CREATE TABLE ai_interactions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature             TEXT NOT NULL CHECK (feature IN (
                        'space_stylist',
                        'space_analyzer',
                        'setup_completer',
                        'bundle_suggester'
                      )),
  user_id             UUID REFERENCES profiles(id),
  session_id          TEXT,
  input_data          JSONB,
  products_recommended UUID[],
  products_added      UUID[],
  conversion          BOOLEAN DEFAULT FALSE,
  claude_prompt       TEXT,
  claude_response     TEXT,
  response_ms         INT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- RLS FOR NEW TABLES
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_watches ENABLE ROW LEVEL SECURITY;
ALTER TABLE setup_showcases ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own wishlist" ON wishlists
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own price watches" ON price_watches
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public reads published showcases" ON setup_showcases
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Users submit showcases" ON setup_showcases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- INDEX FOR PERFORMANCE
CREATE INDEX idx_price_watches_product ON price_watches(product_id);
CREATE INDEX idx_price_history_product ON price_history(product_id, recorded_at DESC);
CREATE INDEX idx_ai_interactions_feature ON ai_interactions(feature, created_at DESC);
CREATE INDEX idx_wishlists_user ON wishlists(user_id);
```

---

## 6. Database Schema v2.2 — Marketing Engine Tables

```sql
-- ACTIVE PROMOTIONS
CREATE TABLE promotions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type            TEXT CHECK (type IN (
                    'sitewide', 'category', 'product', 'clearance'
                  )),
  discount_pct    DECIMAL(5,2) NOT NULL,
  scope_id        UUID,
  scope_type      TEXT,
  reason          TEXT,
  triggered_by    TEXT DEFAULT 'ai_engine'
                  CHECK (triggered_by IN ('ai_engine', 'manual')),
  active          BOOLEAN DEFAULT TRUE,
  expires_at      TIMESTAMPTZ,
  deactivated_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- AI EMAIL CAMPAIGNS
CREATE TABLE ai_campaigns (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject               TEXT NOT NULL,
  preview_text          TEXT,
  headline              TEXT,
  body                  TEXT NOT NULL,
  cta_text              TEXT,
  cta_url               TEXT,
  featured_products     UUID[],
  trigger_reason        TEXT,
  recipients_count      INT DEFAULT 0,
  open_rate             DECIMAL(5,2),
  click_rate            DECIMAL(5,2),
  revenue_attributed    DECIMAL(10,2) DEFAULT 0,
  resend_broadcast_id   TEXT,
  sent_at               TIMESTAMPTZ DEFAULT NOW()
);

-- WEEKLY SALES SNAPSHOTS
CREATE TABLE sales_snapshots (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_start            DATE NOT NULL UNIQUE,
  total_orders          INT DEFAULT 0,
  total_revenue         DECIMAL(10,2) DEFAULT 0,
  avg_order_value       DECIMAL(10,2) DEFAULT 0,
  top_product_id        UUID REFERENCES products(id),
  worst_product_id      UUID REFERENCES products(id),
  new_subscribers       INT DEFAULT 0,
  category_breakdown    JSONB,
  active_promotion      TEXT,
  notes                 TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- MARKETING RULE LOGS (audit trail)
CREATE TABLE marketing_rule_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_name   TEXT NOT NULL,
  triggered   BOOLEAN NOT NULL,
  reason      TEXT,
  action_taken TEXT,
  snapshot_id UUID REFERENCES sales_snapshots(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- SETTINGS (engine kill switch)
CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO settings (key, value) VALUES
  ('marketing_engine_enabled', 'true'),
  ('marketing_rules', '{
    "low_sales_sitewide_discount": true,
    "very_low_sales_discount": true,
    "strong_sales_remove_discount": true,
    "dead_product_clearance": true,
    "winning_product_amplification": true,
    "category_imbalance_boost": true
  }');

-- RLS
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads active promotions" ON promotions
  FOR SELECT USING (active = TRUE);

CREATE POLICY "Admin reads settings" ON settings
  FOR SELECT USING (TRUE);
```

---

## 7. The 8 Differentiating Features

1. AI Space Stylist — 5-question quiz → personalized product recommendations
2. Radical Supply Chain Transparency — show supplier + warehouse on every product
3. Price Drop Alerts — subscribe to price drops on any product
4. "Build Your Setup" Dynamic Bundle Builder — interactive bundle with tiered discounts
5. Post-Purchase "Complete Your Setup" AI — recommendations on order confirmation
6. Setup Showcase Community — customer photo gallery with product tagging
7. Wishlist + Live Price Tracking — save products, track price changes
8. "Describe Your Space" AI Visual Recommender — text or photo space analysis

---

## 8. AI Architecture — Context Builder & Data Flywheel

### The Context Builder

Every AI feature call begins by building the product context. This is the bridge between your live Supabase catalog and Claude's recommendations.

- File: `/lib/ai/context-builder.ts`
- Fetches all in_stock, non-below_margin products from Supabase
- Formats into clean text string for Claude context
- Caches result for 5 minutes
- Export: `buildProductContext()` → `Promise<string>`

### The Data Flywheel

- File: `/lib/ai/flywheel.ts`
- Enriches context with customer data as it grows
- Phase 1 (launch): product catalog only
- Phase 2 (month 3+): product pair data from orders
- Phase 3 (month 6+): AI conversion patterns
- Export: `buildFlywheelContext()` → `Promise<string>`
- Export: `buildFullContext()` → `Promise<string>` (combines both)

### AI Interaction Logger

- File: `/lib/ai/interaction-logger.ts`
- `logAIInteraction(data)` → inserts to ai_interactions table
- `logAIConversion(sessionId, productId)` → marks conversion = true
- Both functions fail silently

---

## 9. Phase 4C — AI Marketing Engine

### Overview

A self-adjusting closed-loop marketing system that monitors sales performance and automatically responds — applying discounts, featuring products, and sending AI-written email campaigns — without manual intervention.

### The 6 Marketing Rules

1. **Low weekly sales** (orders < 10) → 5% sitewide discount
2. **Very low sales** (orders < 5 for 2 consecutive weeks) → escalate to 10%
3. **Strong sales** (orders >= 20) → remove all discounts, protect margin
4. **Dead product clearance** (0 sales in 30 days) → auto-discount if margin allows
5. **Winning product amplification** (5+ units in 7 days) → auto-feature
6. **Category imbalance** (gap > 40%) → boost underperforming category with 8% off

### AI Email Writer

Claude generates weekly campaigns based on the trigger type:
- `low_sales_discount` — generous tone, not desperate
- `flash_sale` — genuine urgency, 48 hours only
- `bestseller_spotlight` — celebrate momentum, full price
- `trending_product` — social proof angle
- `category_spotlight` — educate + soft discount

### Frontend Discount Integration

- ProductCard shows discount badge when promotion active
- Product detail page shows "X% off — limited time"
- Shop page shows sitewide banner
- Homepage shows promotion banner below hero

### Admin Control Panel (`/admin/marketing`)

- Engine ON/OFF toggle (master kill switch)
- Active promotions table with deactivate buttons
- Manual promotion creation form
- Campaign history with preview
- Per-rule ON/OFF toggles
- This week's snapshot summary
- Manual override: Force Analyze, Send Campaign, Pause All

### Vercel Cron Schedule

| Cron | Schedule | Purpose |
|---|---|---|
| sync | Every hour | Supplier data sync |
| margins | 9am daily | Flag below-margin products |
| analyze | Monday 8am | Build weekly sales snapshot |
| promotions | Monday 8am | Evaluate and toggle promotions |
| campaign | Monday 9am | Generate and send AI email |
| clearance | 10am daily | Check for dead stock |
| snapshot | Sunday 11pm | Capture week's data |

---

## 10. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_TAX_ENABLED=true

# App
NEXT_PUBLIC_SITE_URL=https://couranr.com
NEXT_PUBLIC_SITE_NAME=Couranr

# Claude AI
ANTHROPIC_API_KEY=
AI_MODEL=claude-sonnet-4-20250514
AI_MAX_TOKENS=1000
AI_CONTEXT_CACHE_MINUTES=5

# Email (Resend)
RESEND_API_KEY=
FROM_EMAIL=hello@couranr.com

# Admin
ADMIN_EMAIL=your_email@gmail.com

# Cron
CRON_SECRET=

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_META_PIXEL_ID=

# Suppliers
ZENDROP_EMAIL=
ZENDROP_PASSWORD=
SPOCKET_EMAIL=
SPOCKET_PASSWORD=
CJ_API_KEY=
CJ_EMAIL=
WAYFAIR_EMAIL=
WAYFAIR_PASSWORD=
HOMEDEPOT_EMAIL=
HOMEDEPOT_PASSWORD=
WALMART_EMAIL=
WALMART_PASSWORD=

# Sync
SYNC_INTERVAL_HOURS=1
MINIMUM_MARGIN_PCT=30
```

---

## 11. Full Phase Plan (14 Phases)

| Phase | Name | Status |
|---|---|---|
| 1 | Foundation | Complete |
| 2 | Design System Components | Complete |
| 3 | Store Pages | Complete |
| 4 | Cart & Checkout | Complete |
| 4B | AI Features (8 differentiators) | Complete |
| 4C | AI Marketing Engine | Next |
| 5 | Analytics & Legal | Pending |
| 6 | Supplier Sync Engine | Pending |
| 7 | Order Fulfillment Automation | Pending |
| 8 | Email Marketing Sequences | Pending |
| 9 | Auth & Account | Pending |
| 10 | Review System | Pending |
| 11 | Admin Panel | Pending |
| 12 | SEO & Performance | Pending |
| 13 | Launch | Pending |

---

## 12. Bundle Discount Tiers

- 2 items: 5% off
- 3 items: 10% off
- 4 items: 12% off
- 5+ items: 15% off

---

## 13. Launch Checklist

**Legal**
- [ ] `/returns` page live
- [ ] `/privacy` page live
- [ ] `/terms` page live
- [ ] Cookie consent banner active
- [ ] Stripe Tax enabled

**Technical**
- [ ] All env vars in Vercel including ANTHROPIC_API_KEY
- [ ] Supabase RLS policies tested for all new tables
- [ ] Stripe webhook verified
- [ ] Stripe test → live
- [ ] Custom domain couranr.com connected
- [ ] Vercel Cron jobs active
- [ ] First sync run completed for all 6 suppliers
- [ ] Test order placed and auto-fulfilled
- [ ] All 8 AI features tested end-to-end
- [ ] Setup showcase seeded with 8 photos

**Analytics**
- [ ] Meta Pixel firing on PageView, AddToCart, Purchase
- [ ] GA4 firing on same events
- [ ] Meta Pixel verified in Events Manager

**AI Features**
- [ ] /stylist quiz returns recommendations
- [ ] /my-space text analysis working
- [ ] /my-space photo upload working
- [ ] Post-purchase completer shows on confirmation page
- [ ] Bundle builder discount math correct
- [ ] Price alerts firing in sync engine
- [ ] Wishlist saving correctly
- [ ] Showcase gallery populated with 8 seed photos
- [ ] ai_interactions table logging every AI call

**Content**
- [ ] 30+ real products live
- [ ] 2+ categories with products
- [ ] 2+ bundle products
- [ ] About page complete
- [ ] 3+ blog posts published

---

*End of Blueprint v2.2 — Couranr*

# Couranr — Full Technical Blueprint
**Version:** 2.1  
**Date:** March 2026  
**Owner:** Komlan  
**Domain:** couranr.com

> This file is the single source of truth for all builds. Reference it in every Claude Code phase prompt.

## Changelog v2.0 → v2.1
- Added 8 AI-powered differentiating features (Phase 4B)
- Added Claude API integration architecture
- Added AI context builder pattern
- Added data flywheel progression plan (Phase 1 → Phase 3)
- Added ai_interactions tracking table
- Added wishlists, price_watches, setup_showcases tables
- Added seeding strategy for Setup Showcase Community
- Updated tech stack with Claude AI (Anthropic API)
- Updated phase plan — Phase 4B inserted between Phase 4 and Phase 5
- Total phases: 13

## Phase Plan (13 Phases)
1. Foundation
2. Design System Components
3. Store Pages
4. Cart & Checkout
4B. AI Features (8 differentiating features)
5. Analytics & Legal
6. Supplier Sync Engine
7. Order Fulfillment Automation
8. Email Marketing Sequences
9. Auth & Account
10. Review System
11. Admin Panel
12. SEO & Performance
13. Launch

## The 8 Differentiating Features
1. AI Space Stylist — 5-question quiz → personalized product recommendations
2. Radical Supply Chain Transparency — show supplier + warehouse on every product
3. Price Drop Alerts — subscribe to price drops on any product
4. "Build Your Setup" Dynamic Bundle Builder — interactive bundle with tiered discounts
5. Post-Purchase "Complete Your Setup" AI — recommendations on order confirmation
6. Setup Showcase Community — customer photo gallery with product tagging
7. Wishlist + Live Price Tracking — save products, track price changes
8. "Describe Your Space" AI Visual Recommender — text or photo space analysis

## Tech Stack
- Framework: Next.js 14+ (App Router)
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth (Google OAuth + Email)
- Payments: Stripe + Afterpay/Affirm + Stripe Tax
- Hosting: Vercel
- AI: Anthropic Claude API (claude-sonnet-4-20250514)
- Email: Resend

## AI Architecture
- Context Builder: /lib/ai/context-builder.ts — builds product catalog context for Claude
- Flywheel: /lib/ai/flywheel.ts — enriches context with customer data as it grows
- Interaction Logger: /lib/ai/interaction-logger.ts — logs all AI calls for analytics
- All AI routes are SERVER-SIDE only — never expose API calls to client
- Model: claude-sonnet-4-20250514
- ANTHROPIC_API_KEY in .env.local

## Bundle Discount Tiers
- 2 items: 5% off
- 3 items: 10% off
- 4 items: 12% off
- 5+ items: 15% off

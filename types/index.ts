export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  category_id: string | null;
  supplier: "zendrop" | "spocket" | "cj_dropshipping" | "wayfair" | "home_depot" | "walmart";
  supplier_id: string | null;
  sku: string | null;
  shipping_days_min?: number;
  shipping_days_max?: number;
  in_stock: boolean;
  is_featured: boolean;
  is_bundle: boolean;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  images: ProductImage[];
  category?: Category;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

export type CartItem = {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
};

export type Order = {
  id: string;
  status:
    | "pending"
    | "paid"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  subtotal: number;
  shipping_cost: number;
  total: number;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  created_at: string;
};

export type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type ShippingAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  tags: string[];
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "customer" | "admin";
};

// AI Types
export type AIFeature =
  | "space_stylist"
  | "space_analyzer"
  | "setup_completer"
  | "bundle_suggester";

export type AIRecommendation = {
  product_name: string;
  slug: string;
  price: number;
  reason: string;
  priority?: number;
  solves?: string;
  impact?: "high" | "medium" | "low";
};

export type QuizAnswers = {
  spaceType: string;
  aesthetic: string;
  painPoint: string;
  budget: string;
  currentSetup: string;
};

export type StylistResult = {
  headline: string;
  recommendations: AIRecommendation[];
  bundle_note?: string;
  total: number;
};

export type SpaceAnalysis = {
  space_assessment: string;
  top_problems: string[];
  recommendations: AIRecommendation[];
  total: number;
  transformation_note: string;
};

export type CompleterResult = {
  completion_message: string;
  recommendations: AIRecommendation[];
};

// Wishlist
export type WishlistItem = {
  id: string;
  product_id: string;
  price_at_add: number;
  created_at: string;
  product: Product;
};

// Showcase
export type SetupShowcase = {
  id: string;
  user_id: string | null;
  display_name: string;
  title: string | null;
  image_url: string;
  description: string | null;
  tagged_products: string[];
  votes: number;
  published: boolean;
  is_seeded: boolean;
  created_at: string;
};

// Marketing Engine Types
export type Promotion = {
  id: string;
  type: "sitewide" | "category" | "product" | "clearance";
  discount_pct: number;
  scope_id: string | null;
  scope_type: string | null;
  reason: string | null;
  triggered_by: "ai_engine" | "manual";
  active: boolean;
  expires_at: string | null;
  deactivated_at: string | null;
  created_at: string;
};

export type AICampaign = {
  id: string;
  subject: string;
  preview_text: string | null;
  headline: string | null;
  body: string;
  cta_text: string | null;
  cta_url: string | null;
  featured_products: string[];
  trigger_reason: string | null;
  recipients_count: number;
  open_rate: number | null;
  click_rate: number | null;
  revenue_attributed: number;
  resend_broadcast_id: string | null;
  sent_at: string;
};

export type SalesSnapshot = {
  id: string;
  week_start: string;
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  top_product_id: string | null;
  worst_product_id: string | null;
  new_subscribers: number;
  category_breakdown: {
    desk?: { orders: number; revenue: number };
    home?: { orders: number; revenue: number };
  } | null;
  active_promotion: string | null;
  notes: string | null;
  created_at: string;
};

export type MarketingRuleLog = {
  id: string;
  rule_name: string;
  triggered: boolean;
  reason: string | null;
  action_taken: string | null;
  snapshot_id: string | null;
  created_at: string;
};

export type EmailCampaign = {
  subject: string;
  preview_text: string;
  headline: string;
  body: string;
  cta_text: string;
  cta_url: string;
};

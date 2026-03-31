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

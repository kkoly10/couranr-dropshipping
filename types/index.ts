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
  supplier: "zendrop" | "spocket";
  supplier_id: string | null;
  sku: string | null;
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

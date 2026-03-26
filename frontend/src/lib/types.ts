export type UserRole = "buyer" | "seller" | "admin";

export type User = {
  id: number;
  email: string;
  username: string;
  role: UserRole;
  bio?: string;
  avatar_url?: string;
};

export type Product = {
  id: number;
  seller: User;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  category: string;
  tech_stack: string[];
  tags: string[];
  price: string;
  average_rating: string;
  review_count: number;
  preview_image?: string | null;
  preview_model_url?: string;
  created_at: string;
  updated_at?: string;
  reviews?: Review[];
};

export type Review = {
  id: number;
  user: User;
  rating: number;
  comment: string;
  created_at: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type AuthResponse = AuthTokens & {
  user: User;
};

export type OrderItem = {
  id: number;
  product: Product;
  price: string;
  quantity: number;
};

export type Order = {
  id: number;
  status: "pending" | "paid" | "failed";
  total_amount: string;
  stripe_session_id: string;
  items: OrderItem[];
  created_at: string;
};

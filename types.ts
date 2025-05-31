export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  brand?: string;
  state?: string;
  img: string;
  slug: string;
  visible: boolean;
  user_id: string;
};

export type Category = {
  id: number;
  name: string;
  description: string;
};

export type PaymentForm = {
  total: number;
  productId: number;
  userId: string;
};

export type Review = {
  id: string
  rating: number
  comment?: string
  created_at: string
  from_user_id: string
  to_user_id: string
}

export type ReviewsData = {
  reviews: Review[]
  totalReviews: number
  averageRating: number
}

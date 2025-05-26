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

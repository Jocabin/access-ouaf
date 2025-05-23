export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  brand?: string;
  state?: string;
  img: string;
  slug: string;
};

export type Category = {
  id: number;
  name: string;
  description: string;
};

export type PaymentForm = {
  total: number;
};

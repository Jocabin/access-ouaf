"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Checkout from "@/components/Checkout";
import { convertToSubcurrency } from "@/lib/utils";

export default function BuyPage() {
  const stripe_promise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  return (
    <Elements
      stripe={stripe_promise}
      options={{
        mode: "payment",
        currency: "eur",
        amount: convertToSubcurrency(10),
      }}
    >
      <Checkout total={10} />
    </Elements>
  );
}

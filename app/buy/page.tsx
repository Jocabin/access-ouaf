"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Checkout from "@/components/Checkout";
import { convertToSubcurrency } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/client";
import { useEffect, useState } from "react";
import { Product } from "@/types";

export default function BuyPage() {
  const stripe_promise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? ""
  );
  const params = useSearchParams();
  const supabase = createClient();
  const router = useRouter();

  const [product_id, set_product_id] = useState<number>(0);
  const [user_id, set_user_id] = useState<string>("");
  const [product, set_product] = useState<Product | null>(null);

  useEffect(() => {
    async function fetch_data() {
      const id = params.get("product_id");

      if (!id) {
        router.push("/");
      } else {
        set_product_id(Number(id));
      }

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        router.push("/");
      } else {
        set_user_id(userData.user.id);
      }

      const { data, error } = await supabase
        .from("products")
        .select()
        .eq("id", product_id);

      if (data) {
        set_product(data[0]);
      }

      if (error) {
        router.push("/");
      }
    }
    fetch_data();
  });

  return (
    <>
      {product && product.price > 0 && (
        <Elements
          stripe={stripe_promise}
          options={{
            mode: "payment",
            currency: "eur",
            amount: convertToSubcurrency(product?.price),
          }}
        >
          <Checkout
            total={product?.price ?? 0}
            productId={product_id}
            userId={user_id}
          />
        </Elements>
      )}
    </>
  );
}

import { Product } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Card from "@/app/components/Card";

export default async function WishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const auth_id = user.id;
  const { data, error } = await supabase
    .from("wishlist")
    .select(
      `
        *,
        products (*)
        `
    )
    .eq("user_uid", auth_id);

  if (!data) return <p>error fetching wishlist: {JSON.stringify(error)}</p>;

  const wishlist: Product[] = data.map((el) => el.products);

  return (
    <div className="grid-content">
      <h2 className="product-grid-title">Wishlist</h2>
      <div className="products-grid-home">
        {wishlist.map((product) => (
          <Card
            href={"/items/" + product.slug}
            key={product.id}
            imageUrl={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_IMG_URL}${product.img}`}
            title={product.name}
            price={`${product.price} €`}
            width={240}
            height={352}
          />
        ))}
      </div>
    </div>
  );
}

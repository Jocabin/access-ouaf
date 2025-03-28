import { Product, supabase } from "@/supabase";

export default async function WishlistPage() {
  const auth_id = "";
  const { data, error } = await supabase
    .from("wishlist")
    .select(
      `
        *,
        products (*)
        `
    )
    .eq("user_uid", auth_id);
  console.log(data);

  if (!data) return <p>error fetching wishlist: {JSON.stringify(error)}</p>;

  const wishlist: Product[] = data;

  return (
    <ul>
      {wishlist && wishlist.map((item) => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}

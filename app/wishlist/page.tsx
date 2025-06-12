import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Product } from "@/types/interfaces/product.interface"
import ProductGrid from "@/components/ProductGrid"

export default async function WishlistPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/")

  const auth_id = user.id

  const { data, error } = await supabase
    .from("wishlist")
    .select("*, products(*)")
    .eq("user_uid", auth_id)

  if (error) {
    return <p>error fetching wishlist: {JSON.stringify(error)}</p>
  }

  if (!data) {
    return <p>No wishlist found.</p>
  }

  const wishlist: Product[] = data
    .map((el) => el.products)
    .filter((product) => product?.visible === true)

  return (
    <>
      <h1>Wishlist</h1>
      <ProductGrid products={wishlist} />
    </>
  )
}

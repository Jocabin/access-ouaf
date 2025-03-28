import { supabase } from "@/supabase"

export async function getProductsByCategory(categoryId: number) {
  const { data, error } = await supabase
    .from("product_categories")
    .select(
      `
        product_id,
        products ( id, name, price, img, slug ),
        categories ( name )
      `
    )
    .eq("category_id", categoryId)

  if (error) {
    console.error("Erreur lors de la récupération des produits :", error)
    return []
  }

  return data
}

export async function getAllProducts() {
  return supabase.from("products").select()
}

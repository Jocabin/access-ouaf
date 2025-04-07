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

export async function getProductsByCategoryName(categoryName: string) {
  const { data, error } = await supabase
    .from("product_categories")
    .select(
      `
        product_id,
        products ( id, name, price, img, slug ),
        categories ( name )
      `
    )
    .eq("categories.name", categoryName)

  if (error) {
    console.error("Erreur lors de la récupération des produits :", error)
    return []
  }

  return data
}

export async function getProductsByWordSearch(word: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .textSearch("name", word)

  if (error) {
    console.error("Error performing search:", error)
    return []
  }

  return data
}

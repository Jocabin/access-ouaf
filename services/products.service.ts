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
        categories!inner ( name )
      `
    )
    .filter("categories.name", "eq", categoryName)

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

export async function getProductBySlug(sku: string) {
  const { data, error } = await supabase
    .from("products")
    .select()
    .eq("slug", sku)

  if (!data?.length || error) {
    console.log(error)
    return null
  }

  return data[0]
}

export async function getProductsByUser(id: string) {
  const { data, error } = await supabase
      .from("products")
      .select()
      .eq('user_id', id)

  if (error) {
    console.error("Erreur lors de la récupération des annonces :", error)
    return null
  }

  return data
}

import { supabase } from "@/supabase"
import { unstable_noStore } from 'next/cache'

export async function getProductsByCategory(categoryId: number) {
  const { data, error } = await supabase
    .from("product_categories")
    .select(
      `
        product_id,
        products!inner ( id, name, price, img, slug, visible ),
        categories ( name )
      `
    )
    .eq("category_id", categoryId)
    .eq("products.visible", true)
    .order("id", { ascending: false })

  if (error) {
    console.error("Erreur lors de la récupération des produits :", error)
    return []
  }

  return data
}

export async function getAllProducts() {
  unstable_noStore()
  return supabase
    .from("products")
    .select()
    .eq("visible", true)
    .order("id", { ascending: false })
}

export async function getProductsByCategoryName(categoryName: string) {
  const { data, error } = await supabase
    .from("product_categories")
    .select(
      `
        product_id,
        products!inner ( id, name, price, img, slug, visible ),
        categories!inner ( name )
      `
    )
    .filter("categories.name", "eq", categoryName)
    .eq("products.visible", true)
    .order("id", { ascending: false })

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
    .order("id", { ascending: false })
    .eq("visible", true)

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
    .order("id", { ascending: false })
    .eq("visible", "TRUE")

  if (!data?.length || error) {
    console.log(error)
    return null
  }

  return data[0]
}

export async function getProductsByUser(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
        *,
        product_categories (
          category:categories (
            id,
            name,
            description
          )
        )
      `
    )
    .eq("user_id", id)
    .eq("visible", true)

    .order("id", { ascending: false })

  if (error) {
    console.error("Erreur lors de la récupération des annonces :", error)
    return []
  }

  return (data ?? []).map((product) => ({
    ...product,
    category: product.product_categories?.[0]?.category ?? null,
    product_categories: undefined,
  }))
}

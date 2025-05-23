import { supabase } from "@/supabase"
import { capitalizeFirstLetter } from "@/utils/helpers/capitalizeFirstLetter"
import { redirect } from "next/navigation"

export async function getCategoryByName(categoryName: string) {
  const { data, error } = await supabase
    .from("categories")
    .select()
    .eq("name", categoryName)

  if (!data?.length || error) {
    console.log(error)
    redirect("/")
  }

  const id = data[0].id
  const name = capitalizeFirstLetter(data[0].name)
  const description = capitalizeFirstLetter(data[0].description)

  return { id, name, description }
}

export async function getAllCategories() {
  const { data, error } = await supabase.from("categories").select()

  if (!data?.length || error) {
    console.log(error)
    redirect("/")
  }

  return data
}

export async function getCategoryByProductName(productName: string) {
  const { data, error } = await supabase
    .from("product_categories")
    .select(
      `
      categories ( id, name ),
      products!inner ( name )
    `
    )
    .eq("products.name", productName)

  if (error) {
    console.error("Erreur getCategoryByProductName :", error)
    return null
  }

  if (!data?.length || !data[0].categories) {
    return null
  }

  const { id, name } = Array.isArray(data[0].categories) ? data[0].categories[0] : data[0].categories
  return { id, name }
}

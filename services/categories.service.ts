import { supabase } from "@/supabase"
import { capitalizeFirstLetter } from "@/src/utils/helpers/helpers"
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

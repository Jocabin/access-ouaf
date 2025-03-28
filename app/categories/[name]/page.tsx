import { supabase } from "@/supabase"
import { redirect } from "next/navigation"
import { capitalizeFirstLetter } from "@/app/utils/helpers"

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const { data, error } = await supabase
    .from("categories")
    .select()
    .eq("name", name)

  if (!data?.length || error) {
    redirect("/")
  }

  const categoryName = capitalizeFirstLetter(data[0].name)
  const description = capitalizeFirstLetter(data[0].description)

  //   const { products } = await supabase.from("products").select().eq()

  return (
    <>
      <>
        <h1>{categoryName}</h1>
        <p>{description}.</p>
      </>
    </>
  )
}

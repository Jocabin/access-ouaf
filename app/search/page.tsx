import { createClient } from "@/utils/supabase/server"
import type { Product } from "@/types"
import Card from "@/components/Card"
import { translations } from "@/lib/translations"
import { capitalizeFirstLetter } from "@/utils/helpers/capitalizeFirstLetter"

// @ts-expect-error oui
export default async function SearchPage({ searchParams }) {
  const { q } = searchParams
  let results: Product[] = []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .textSearch("name", q)

  if (error) {
    console.error("Error performing search:", error)
  } else {
    results = data
  }

  return (
    <>
      <h1>{translations.titles.searchProducts}</h1>

      {results.length <= 1 ? (
        <p>
          {results.length} {translations.text.result}
        </p>
      ) : (
        <>
          <p>
            {results.length} {translations.text.results}
          </p>
        </>
      )}

      <div className="products-grid-home">
        {results.map((product) => (
          <Card
            href={"/items/" + product.slug}
            key={product.id}
            imageUrl={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_IMG_URL}${product.img}`}
            title={capitalizeFirstLetter(product.name)}
            price={`${product.price} €`}
            width={139}
            height={241}
          />
        ))}
      </div>
    </>
  )
}

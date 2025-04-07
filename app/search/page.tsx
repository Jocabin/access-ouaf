import type { Product } from "@/types"
import Card from "@/components/Card"
import { translations } from "@/lib/translations"
import { capitalizeFirstLetter } from "@/utils/helpers/capitalizeFirstLetter"
import {
  getProductsByCategoryName,
  getProductsByWordSearch,
} from "@/services/products.service"
import { redirect } from "next/navigation"

// @ts-expect-error oui
export default async function SearchPage({ searchParams }) {
  const { q: query } = searchParams

  if (!query) redirect("/")

  const resultsBySearchbar = await getProductsByWordSearch(query)
  const resultsByCategory = await getProductsByCategoryName(query)

  const categoryProducts = resultsByCategory
    .flatMap((cat) => cat.products)
    .filter((p): p is Product => Boolean(p))

  const allProducts = [...resultsBySearchbar, ...categoryProducts]

  const uniqueProducts: Product[] = Array.from(
    new Map(allProducts.map((p) => [p.id, p])).values()
  )

  return (
    <>
      <h1>{translations.titles.searchProducts}</h1>

      {uniqueProducts.length === 0 ? (
        <p>{translations.text.noResults}</p>
      ) : uniqueProducts.length === 1 ? (
        <p>1 {translations.text.result}</p>
      ) : (
        <p>
          {uniqueProducts.length} {translations.text.results}
        </p>
      )}

      <div className="products-grid-home">
        {uniqueProducts.map((product) => (
          <Card
            href={"/items/" + product.slug}
            key={product.id}
            imageUrl={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_IMG_URL}${product.img}`}
            title={capitalizeFirstLetter(product.name)}
            price={`${product.price} €`}
            width={139}
            height={241}
          />
        ))}{" "}
      </div>
    </>
  )
}

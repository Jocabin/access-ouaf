import { translations } from "@/lib/translations"
import {
  getProductsByCategoryName,
  getProductsByWordSearch,
} from "@/services/products.service"
import { redirect } from "next/navigation"
import ProductGrid from "@/components/ProductGrid"
import { Product } from "@/types/interfaces/product.interface"

// @ts-expect-error oui
export default async function SearchPage({ searchParams }) {
  const { q: query } = await searchParams

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

  const resultText = `pour "${query}".`

  return (
    <>
      <h1>{translations.titles.searchProducts}</h1>

      {uniqueProducts.length === 0 ? (
        <p>
          {translations.text.noResults} {resultText}
        </p>
      ) : uniqueProducts.length === 1 ? (
        <p>
          1 {translations.text.result} {resultText}
        </p>
      ) : (
        <p>
          {uniqueProducts.length} {translations.text.results} {resultText}
        </p>
      )}

      <ProductGrid products={uniqueProducts} />
    </>
  )
}

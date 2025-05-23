import { getAllProducts } from "@/services/products.service"
import { getAllCategories } from "@/services/categories.service"
import { Category } from "@/types"
import HomepageAd from "./HomepageAd"
import ProductGrid from "./ProductGrid"
import { Product } from "@/types/interfaces/product.interface"
import { translations } from "@/lib/translations"

export default async function Homepage() {
  const products = await getAllProducts()
  const categories: Category[] = await getAllCategories()

  return (
    <>
      <HomepageAd categories={categories} />

      <ProductGrid
        title={translations.homePage.title}
        products={products.data as Product[]}
      />
    </>
  )
}

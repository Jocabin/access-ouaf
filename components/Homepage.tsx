export const dynamic = "force-dynamic";

import { getAllProducts } from "@/services/products.service"
import { getAllCategories } from "@/services/categories.service"
import HomepageAd from "./HomepageAd"
import ProductGrid from "./ProductGrid"
import { Product } from "@/types/interfaces/product.interface"
import { translations } from "@/lib/translations"
import { Category } from "@/types/interfaces/category.interface"

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

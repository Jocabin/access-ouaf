import { translations } from "../lib/translations"
import { getAllProducts } from "@/services/products.service"
import { getAllCategories } from "@/services/categories.service"
import { Category } from "@/types"
import { capitalizeFirstLetter } from "@/utils/helpers/capitalizeFirstLetter"
import Card from "./Card"
import HomepageAd from "./HomepageAd"

export default async function Homepage() {
  const products = await getAllProducts()
  const categories: Category[] = await getAllCategories()

  return (
    <>
      <HomepageAd categories={categories} />

      <div className="grid-content">
        <h2 className="product-grid-title">{translations.gridCard.title}</h2>
        <div className="products-grid-home">
          {products.data?.map((product) => (
            <Card
              key={product.id}
              href={`/items/${product.slug}`}
              imageUrl={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_IMG_URL}${product.img}`}
              title={capitalizeFirstLetter(product.name)}
              price={`${product.price} €`}
              width={240}
              height={352}
            />
          ))}
        </div>
      </div>
    </>
  )
}

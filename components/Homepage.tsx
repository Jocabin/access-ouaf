import { translations } from "../lib/translations"
import { getAllProducts } from "@/services/products.service"
import { getAllCategories } from "@/services/categories.service"
import { Category } from "@/types"
import { capitalizeFirstLetter } from "@/utils/helpers/capitalizeFirstLetter"
import HomepageAd from "./HomepageAd"
import { Card } from "primereact/card"
import Link from "next/link"
import Image from "next/image"
import WishlistButton from "./WishlistButton"

export default async function Homepage() {
  const products = await getAllProducts()
  const categories: Category[] = await getAllCategories()

  const imgBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const imgPath = process.env.NEXT_PUBLIC_IMG_URL

  return (
    <>
      <HomepageAd categories={categories} />

      <div className="grid-content">
        <h2 className="product-grid-title">{translations.gridCard.title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 mt-16 mb-20">
          {products.data?.map((product) => {
            const imageUrl = `${imgBaseUrl}${imgPath}${product.img}`
            const title = capitalizeFirstLetter(product.name)
            const subTitle = `${product.price} €`

            return (
              <Link
                key={product.id}
                href={`/items/${product.slug}`}
                className="no-underline"
              >
                <Card
                  title={
                    <h3 className="text-base font-semibold leading-tight truncate">
                      {capitalizeFirstLetter(product.name)}
                    </h3>
                  }
                  subTitle={subTitle}
                  header={
                    <div className="relative">
                      <Image
                        alt={title}
                        src={imageUrl}
                        width={250}
                        height={192}
                        className="object-cover rounded-t-2xl"
                      />
                      <div className="absolute top-2 right-2 z-10">
                        <WishlistButton product={product} />
                      </div>
                    </div>
                  }
                  className="w-full max-w-[220px] mx-auto shadow-md hover:shadow-lg rounded-2xl"
                />
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

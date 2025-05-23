import Image from "next/image"
import Link from "next/link"
import WishlistButton from "./WishlistButton"
import { capitalizeFirstLetter } from "@/utils/helpers/capitalizeFirstLetter"
import { Card } from "primereact/card"
import { Product } from "@/types/interfaces/product.interface"
import { getFirstImage } from "@/utils/helpers/getFirstImage"

interface ProductGridProps {
  title?: string
  products: Product[]
}

export default function ProductGrid({ title, products }: ProductGridProps) {
  const imgBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const imgPath = process.env.NEXT_PUBLIC_IMG_URL

  return (
    <div className="mt-[6.25rem] max-[576px]:mt-[2.5rem]">
      <h2 className="mb-[3.125rem]">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 mt-16 mb-20">
        {products.map((product) => {
          const imageUrl = `${imgBaseUrl}${imgPath}${product.img}`
          const productTitle = capitalizeFirstLetter(product.name)
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
                    {productTitle}
                  </h3>
                }
                subTitle={subTitle}
                header={
                  <div className="relative">
                    <Image
                      alt={productTitle}
                      src={getFirstImage(imageUrl)}
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
  )
}

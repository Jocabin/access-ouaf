import Link from "next/link"
import { redirect } from "next/navigation"
import { capitalizeFirstLetter } from "@/utils/helpers/capitalizeFirstLetter"
import { BreadCrumb } from "primereact/breadcrumb"
import { MenuItem } from "primereact/menuitem"
import { getCategoryByProductName } from "@/services/categories.service"
import WishlistButton from "@/components/WishlistButton"
import { getProductBySlug } from "@/services/products.service"
import { Button } from "primereact/button"
import { translations } from "@/lib/translations"
import { Avatar } from "primereact/avatar"
import { createClient } from "@/utils/supabase/server"
import ProductGallery from "@/components/ProductGallery"
import { Divider } from "primereact/divider"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ sku: string }>
}) {
  const supabase = await createClient()
  const { sku } = await params

  const product = await getProductBySlug(sku)
  const category = await getCategoryByProductName(product.name)

  if (!product) {
    redirect("/")
  }

  const productName = capitalizeFirstLetter(product.name.trim())
  const productDescription = capitalizeFirstLetter(product.description.trim())
  const categoryName = capitalizeFirstLetter(category?.name.trim())

  const breadcrumbItems = [
    {
      label: categoryName,
      url: `/categories/${category?.name}`,
    },
    {
      label: productName,
      url: `${product.slug}`,
    },
  ] as MenuItem[]

  const homeBreadcrumbItem = { icon: "pi pi-fw pi-home", url: "/" } as MenuItem

  const { data: user } = await supabase.rpc("get_user_by_id", {
    uid: product.user_id,
  })

  const images = product.img.split(",")

  for (let i = 0; i < images.length; i += 1) {
    images[
      i
    ] = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${images[i]}`
  }

  return (
    <>
      <BreadCrumb model={breadcrumbItems} home={homeBreadcrumbItem} />

      <main className="max-w-screen-lg mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="w-full">
            <ProductGallery
              imagesString={product.img}
              altText={product.name}
              titleText="Photos produit"
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4">
            <div className="flex justify-between items-start w-full">
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold mt-2">{productName}</h1>
                <span className="text-sm text-gray-500">
                  {product.size} · {product.state} · {product.brand}
                </span>
              </div>
              <div className="mt-2">
                <WishlistButton product={product} />
              </div>
            </div>

            {/* Prix */}
            <div className="text-2xl font-bold text-[#b3592a]">
              {product.price} €
            </div>

            {/* Infos */}
            <ul className="text-sm text-gray-700 list-none m-0 p-0">
              <li>
                <strong>{translations.productPage.brand} :</strong>{" "}
                {product.brand}
              </li>
              <li>
                <strong>{translations.productPage.state} :</strong>{" "}
                {product.state}
              </li>
            </ul>

            {/* Description */}
            <p className="text-sm">{productDescription} </p>

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <Link href={`/buy`}>
                <Button label={translations.button.buy} className="w-full" />
              </Link>
              <Link href={`/chat?sku=${product.id}`}>
                <Button
                  label={translations.button.contact}
                  outlined
                  className="w-full"
                />
              </Link>
            </div>

            {/* Vendeur */}
            <Divider />
            <div className="flex items-center gap-4">
              <Avatar icon="pi pi-user" size="large" shape="circle" />
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Vendu par</span>
                <Link
                  href={`/profile/${user.id}`}
                  className="text-base font-medium hover:underline"
                >
                  {user.raw_meta_data.display_name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

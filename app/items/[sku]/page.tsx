import React from "react";
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { getDaysSinceCreation } from "@/utils/helpers/getDaysSinceCreation"
import { capitalizeFirstLetter } from "@/utils/helpers/capitalizeFirstLetter"
import { getCategoryByProductName } from "@/services/categories.service"
import { getProductBySlug } from "@/services/products.service"
import { getReviewsByUser } from '@/services/reviews.service'
import WishlistButton from "@/components/WishlistButton"
import ProductGallery from "@/components/ProductGallery"
import { translations } from "@/lib/translations"
import { Button } from "primereact/button"
import { Divider } from "primereact/divider"
import { Avatar } from "primereact/avatar"
import { BreadCrumb } from "primereact/breadcrumb"
import { MenuItem } from "primereact/menuitem"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ sku: string }>
}) {
  const supabase = await createClient()
  const { sku } = await params

  const product = await getProductBySlug(sku)
  const category = await getCategoryByProductName(product.name)
  const reviews = await getReviewsByUser(product.user_id) ?? []

  if (!product) {
    redirect("/")
  }

  const productName = capitalizeFirstLetter(product.name.trim())
  const productDescription = capitalizeFirstLetter(product.description.trim())
  const categoryName = capitalizeFirstLetter(category?.name.trim())

  const daysAgo = getDaysSinceCreation(product.created_at)

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

  const images = product.img?.split(",") ?? []

  for (let i = 0; i < images.length; i += 1) {
    images[i] = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${images[i]}`
  }

  return (
    <>
      <BreadCrumb model={breadcrumbItems} home={homeBreadcrumbItem} />

      <main className="max-w-screen-lg mx-auto p-8 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          <ProductGallery imagesString={product.img} altText={product.name} />

          <div className="p-6 rounded-xl shadow-md flex flex-col gap-4">
            <div className="flex justify-between items-start w-full">
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold mt-2">{productName}</h1>
              </div>
              <div className="mt-2">
                <WishlistButton product={product} />
              </div>
            </div>

            {/* Prix */}
            <div className="text-2xl font-bold text-[var(--brown)]">
              {product.price} €
            </div>

            {/* Infos */}
            <ul className="text-sm  text-[var(--tertiary-font)] list-none m-0 p-0">
              <li>
                <strong>{translations.productPage.brand} :</strong>{" "}
                {product.brand}
              </li>
              <li>
                <strong>{translations.productPage.size} :</strong>{" "}
                {product.size ? product.size : translations.productPage.noSize}
              </li>
              <li>
                <strong>{translations.productPage.state} :</strong>{" "}
                {product.state}
              </li>
              <li>
                <strong>{translations.productPage.added} :</strong>{" "}
                {daysAgo === 0
                  ? translations.productPage.today
                  : daysAgo === 1
                  ? translations.productPage.yesterday
                  : translations.productPage.daysAgo.replace(
                      "{{days}}",
                      daysAgo.toString()
                    )}
              </li>
            </ul>

            {/* Description */}
            <p className="text-sm">{productDescription} </p>

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <Link href={`/buy?product_id=${product.id}`}>
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

            <Divider />

            {/* Vendeur */}
            <div className="flex items-center gap-4 hover:bg-[var(--hover-color)] p-4 rounded-lg">
              <Avatar
                  className="avatar-fixed"
                  image={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_AVATAR_URL}${user.raw_meta_data.avatar_url}` || undefined}
                  icon={!user.raw_meta_data.avatar_url ? 'pi pi-user' : undefined}
                  size="large"
                  shape="circle"
                  style={{ width: '64px', height: '64px', overflow: 'hidden' }}
              />
              <div className="flex flex-col">
                <span className="text-sm">
                  {translations.productPage.soldBy}
                </span>
                <Link
                  href={`/profile/${user.id}`}
                  className="text-base no-underline font-bold text-[var(--brown)]"
                >
                  {user.raw_meta_data.display_name}
                </Link>
                <div className="flex flex-row items-center gap-2">
                  <i className="pi pi-star-fill" style={{ color: '#FFC107' }} />
                  <span className="font-bold">{reviews.averageRating}</span>
                  <span className="font-normal">({reviews.totalReviews})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

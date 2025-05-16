import Link from "next/link"
import ImageSlider from "@/components/ImageSlider"
import { redirect } from "next/navigation"
import { capitalizeFirstLetter } from "@/utils/helpers/capitalizeFirstLetter"
import { BreadCrumb } from "primereact/breadcrumb"
import { MenuItem } from "primereact/menuitem"
import { getCategoryByProductName } from "@/services/categories.service"
import WishlistButton from "@/components/WishlistButton"
import Button from "@/components/Button"
import { getProductBySlug } from "@/services/products.service"
import { Card } from 'primereact/card'
import { Avatar } from 'primereact/avatar'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ sku: string }>
}) {

  const supabase = await createClient()
  const { sku } = await params

  const product = await getProductBySlug(sku)

  if (!product) {
    redirect("/")
  }

  const category = await getCategoryByProductName(product.name)

  const items = [
    {
      label: capitalizeFirstLetter(category?.name),
      url: `/categories/${category?.name}`,
    },
    {
      label: capitalizeFirstLetter(product.name),
      url: `${product.slug}`,
    },
  ] as MenuItem[]

  const home = { icon: "pi pi-fw pi-home", url: "/" } as MenuItem

  const { data: user } = await supabase
      .rpc('get_user_by_id', { uid: product.user_id })

  const images = product.img.split(",")

  for (let i = 0; i < images.length; i += 1) {
    images[
      i
    ] = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${images[i]}`
  }

  return (
    <>
      <BreadCrumb model={items} home={home} />
      <main className="max-w-[1120px] mx-auto w-full h-full md:p-8 flex flex-col gap-12">
        <div className="flex md:flex-row flex-col justify-between items-start md:gap-16 mx-auto w-full">
          <div className="max-w-[600px] w-full">
            <ImageSlider
              productDescription="alt temporaire"
              productImages={images}
            />
          </div>

          <div className="w-full h-full flex flex-col justify-start items-start gap-4">
            <div className="flex justify-between items-center gap-4 w-full p-4">
              <div>
                <h1 className="text-2xl font-bold text-[#1a0b03]">
                  {capitalizeFirstLetter(product.name)}
                </h1>
                <p className="text-2xl font-bold text-[#b3592a]">
                  {product.price}€
                </p>
              </div>

              <WishlistButton product={product} />
            </div>

            <p className="flex-1 text-[#1a0b03] p-4">
              {capitalizeFirstLetter(product.description)}
            </p>

              <Card>
                    <div className='flex flex-row mb-6 items-center gap-4'>
                      <Avatar icon="pi pi-user" size="xlarge" shape="circle"/>
                      <div className='flex flex-col'>
                          <span>Vendu par</span>
                          <span><a href={'/profile/' + user.id}>{user.raw_meta_data.display_name}</a></span>
                      </div>
                  </div>
              </Card>

              <div
                  className="w-full fixed md:static bottom-0 bg-white border-t border-t-black md:border-none p-4 flex md:flex-col gap-4">
                  <Link
                href={`/chat?sku=${product.id}`}
                className="no-underline w-full"
              >
                      <Button>Contacter</Button>
                  </Link>
                  <Link href={`/buy`} className="no-underline w-full">
                      <Button>Acheter</Button>
                  </Link>
                </div>
          </div>
        </div>
      </main>
    </>
  )
}

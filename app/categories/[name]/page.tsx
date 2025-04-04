import { capitalizeFirstLetter } from "@/src/utils/helpers/helpers"
import { getCategoryByName } from "@/services/categories.service"
import { getProductsByCategory } from "@/services/products.service"
import Card from "@/app/components/Card"
import { translations } from "@/app/translations"

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params

  const category = await getCategoryByName(name)

  const categoryName = capitalizeFirstLetter(category.name)
  const description = capitalizeFirstLetter(category.description)

  const products = await getProductsByCategory(category.id)

  return (
    <>
      <>
        <h1>
          {translations.titles.categorie} &quot;{categoryName}&quot;
        </h1>
        <p>{description}.</p>
        <p>
          {products.length} {translations.text.results}
        </p>

        <div className="products-grid-home">
          {products.map(({ products }) => {
            const product = Array.isArray(products) ? products[0] : products
            return (
              <Card
                href={`/items/${product.slug}`}
                key={product.id}
                imageUrl={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_IMG_URL}${product.img}`}
                title={product.name}
                price={`${product.price} €`}
                width={139}
                height={241}
              />
            )
          })}
        </div>
      </>
    </>
  )
}

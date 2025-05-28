import { capitalizeFirstLetter } from "@/utils/helpers/capitalizeFirstLetter";
import { getCategoryByName } from "@/services/categories.service";
import { getProductsByCategory } from "@/services/products.service";
import { translations } from "@/lib/translations";
import ProductGrid from "@/components/ProductGrid";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const category = await getCategoryByName(name);
  const products = await getProductsByCategory(category.id);

  const categoryName = capitalizeFirstLetter(category.name.trim());
  const description = capitalizeFirstLetter(category.description.trim());

  return (
    <>
      <>
        <h1>
          {translations.titles.category} &quot;{categoryName}&quot;
        </h1>
        <p>{description}.</p>
        <p>
          {products.length} {translations.text.results}
        </p>

        <ProductGrid
          products={products.map(({ products }) =>
            Array.isArray(products) ? products[0] : products
          )}
        />
      </>
    </>
  );
}

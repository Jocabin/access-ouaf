import { translations } from "../lib/translations";
import Button from "./Button";
import Card from "./Card";
import { getAllProducts } from "@/services/products.service";
import HomepageAd from "./HomepageAd";
import { getAllCategories } from "@/services/categories.service";
import { Category } from "@/types";

export default async function Homepage() {
  const products = await getAllProducts();
  const categories: Category[] = await getAllCategories();

  return (
    <>
      <div className="desktop-homepage">
        <HomepageAd categories={categories} />

        <div className="grid-content">
          <h2 className="product-grid-title">{translations.gridCard.title}</h2>
          <div className="products-grid-home">
            {products.data?.map((product) => (
              <Card
                href={"/items/" + product.slug}
                key={product.id}
                imageUrl={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_IMG_URL}${product.img}`}
                title={product.name}
                price={`${product.price} €`}
                width={240}
                height={352}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="phone-homepage">
        <Button>{translations.button.addItem}</Button>
        <div className="grid-content">
          <h2 className="product-grid-title">{translations.gridCard.title}</h2>
          <div className="products-grid-home">
            {products.data?.map((product) => (
              <Card
                key={product.id}
                href={"/items/" + product.slug}
                imageUrl={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_IMG_URL}${product.img}`}
                title={product.name}
                price={`${product.price} €`}
                width={139}
                height={241}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

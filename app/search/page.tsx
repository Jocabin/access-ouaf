import { createClient } from "@/utils/supabase/server";
import type { Product } from "@/types";
import Card from "@/app/components/Card";

// @ts-expect-error oui
export default async function SearchPage({ searchParams }) {
  const { q } = searchParams;
  let results: Product[] = [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .textSearch("name", q);

  if (error) {
    console.error("Error performing search:", error);
  } else {
    results = data;
  }

  return (
    <>
      <h1>Search Products</h1>
      <p>{results.length} results</p>

      <div className="products-grid-home">
        {results.map((product) => (
          <Card
            href={"/items/" + product.slug}
            key={product.id}
            imageUrl={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_IMG_URL}${product.img}`}
            title={product.name}
            price={`${product.price} €`}
            width={139}
            height={241}
          />
        ))}
      </div>
    </>
  );
}

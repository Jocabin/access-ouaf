import Link from "next/link";
import Button from "../../../components/Button";
import ImageSlider from "@/components/ImageSlider";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import WishlistButton from "../../../components/WishlistButton";
import { Card } from 'primereact/card'
import { Avatar } from 'primereact/avatar'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const supabase = await createClient();
  const { sku } = await params;
  const { data, error } = await supabase
    .from("products")
    .select()
    .eq("slug", sku);

  if (!data?.length || error) {
    redirect("/");
  }

  const product = data[0];
  const images = product.img.split(",");

  const { data: user, error: errorUser } = await supabase
      .rpc('get_user_by_id', { uid: product.user_id })

  for (let i = 0; i < images.length; i += 1) {
    images[
      i
    ] = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${images[i]}`;
  }

  return (
    <main className="max-w-[1120px] mx-auto w-full h-full md:p-8 flex flex-col gap-12">
      <div className="mb-6 text-sm text-gray-600 hidden md:block">
        <Link href="/" className="hover:underline text-gray-600">
          Accueil
        </Link>
        &nbsp;&gt;&nbsp;
        <Link href="/chats" className="hover:underline text-gray-600">
          Catégorie
        </Link>
        &nbsp;&gt;&nbsp;
        <span>{product.name}</span>
      </div>

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
                    Nom du produit
                  </h1>
                  <p className="text-2xl font-bold text-[#b3592a]">
                    {product.price}€
                  </p>
                </div>

                <WishlistButton product={product} />
              </div>

            <p className="flex-1 text-[#1a0b03] p-4">{product.description}</p>

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
                  <Link href={`/chat?sku=${product.id}`} className="no-underline w-full">
                      <Button>Contacter</Button>
                  </Link>
                  <Link href={`/buy`} className="no-underline w-full">
                      <Button>Acheter</Button>
                  </Link>
              </div>
        </div>
      </div>
    </main>
  );
}

import Image from "next/image"
import Link from "next/link"
import HeartIcon from "../../components/HeartIcon"
import Button from "../../components/Button"
import ImageSlider from "@/app/components/ImageSlider"
import { supabase } from "@/supabase"
import { redirect } from "next/navigation"

export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
        const { sku } = await params
        const { data, error } = await supabase.from('products').select().eq('slug', sku)
        console.log(data, error);


        if (!data?.length || error) {
                redirect('/')
        }

        const product = data[0]
        const images = product.img.split(',');

        for (let i = 0; i < images.length; i += 1) {
                images[i] = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${images[i]}`
        }

        return (
                <main className="w-full p-8 flex flex-col gap-12">
                        <div className="mb-6 text-sm text-gray-600">
                                <Link href="/" className="hover:underline">Accueil</Link>
                                &nbsp;&gt;&nbsp;
                                <Link href="/chats" className="hover:underline">Catégorie</Link>
                                &nbsp;&gt;&nbsp;
                                <span>{product.name}</span>
                        </div>

                        <div className="flex md:flex-row flex-col justify-between items-start gap-16 max-w-[1120px] mx-auto w-full">
                                <div className="max-w-[600px] w-full">
                                        <ImageSlider productDescription="alt temporaire" productImages={images} />
                                </div>

                                <div className="w-full h-full flex flex-col justify-start items-start gap-4">
                                        <div className="flex justify-between items-center gap-4 w-full">
                                                <div>
                                                        <h1 className="text-2xl font-bold text-[#1a0b03]">Nom du produit</h1>
                                                        <p className="text-2xl font-bold text-[#b3592a]">{product.price}€</p>
                                                </div>

                                                <button>
                                                        <HeartIcon />
                                                </button>
                                        </div>

                                        <p className="flex-1 text-[#1a0b03]">{product.description}</p>

                                        <form className="w-full flex flex-col gap-4" action="/buy" method="post">
                                                <Button>Envoyer un message</Button>
                                                <Button>Acheter</Button>
                                        </form>
                                </div>
                        </div>
                </main>
        )
}


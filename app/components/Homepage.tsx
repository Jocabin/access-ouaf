import Image from "next/image"
import { translations } from "../translations"
import Button from "./Button"
import { getAllProducts } from "@/supabase"
import Card from "./Card"

export default async function Homepage() {
  const logoUrl = "/assets/chat-homepage.jpg"
  const products = await getAllProducts();

  return (
    <>
    <div className="desktop-homepage">
      <div className="relative flex justify-center mt-20">
        <Image src={logoUrl} alt="Image d'un chat" width={1170} height={395} className="cat-picture"/>
        <div className="absolute top-1/2 left-0 bg-white -translate-y-1/2 ml-40 p-5 rounded-lg">
          <h1 className="title-home-card mb-2">{translations.homeCard.bold}</h1>
          <p className="mb-5">{translations.homeCard.text}</p>
          <Button>{translations.button.addItem}</Button>
        </div>
      </div>
      <div className="grid-content">
      <h2 className="product-grid-title">{translations.gridCard.title}</h2>
        <div className="products-grid-home">
          {products.data?.map(product => (
            <Card 
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
          {products.data?.map(product => (
            <Card 
              key={product.id} 
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
  )
}

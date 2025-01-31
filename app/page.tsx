import { getAllProducts } from "@/supabase"
import Header from "./components/Header"
import Searchbar from "./components/Searchbar"
import Button from "./components/Button"
import { translations } from "./translations"

export default async function Home() {
  console.log(await getAllProducts())

  return (
    <>
      <div className="main--container">
        <Header />
        <Searchbar />
        <Button label={translations.button.addItem} />
      </div>
    </>
  )
}

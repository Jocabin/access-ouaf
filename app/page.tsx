import { getAllProducts } from "@/supabase"
import Header from "./components/Header"
import Searchbar from "./components/Searchbar"
import HeaderMenu from "./components/HeaderMenu"

export default async function Home() {
  console.log(await getAllProducts())

  return (
    <>
      <div className="main--container">
        <Header />
        <Searchbar />
        <HeaderMenu />
      </div>
    </>
  )
}

import { supabase } from "@/supabase"
import Header from "./components/Header"
import Searchbar from "./components/Searchbar"
import AddItemButton from "./components/AddItemButton"

export default async function Home() {
  const { data, error } = await supabase.from("products").select()
  if (error) {
    console.error(error)
  } else {
    console.log(data)
  }

  return (
    <>
      <div className="main--container">
        <Header />
        <Searchbar />
        <AddItemButton />
      </div>
    </>
  )
}

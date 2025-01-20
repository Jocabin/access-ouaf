import { supabase } from "@/supabase"
import Header from "./components/Header"

export default async function Home() {
  const { data, error } = await supabase.from("products").select()
  if (error) {
    console.error(error)
  } else {
    console.log(data)
  }

  return (
    <>
      <Header />
      <h1>Bonjour</h1>
    </>
  )
}

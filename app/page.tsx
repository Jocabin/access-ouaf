import { PrimeReactProvider } from 'primereact/api'
import 'primereact/resources/themes/saga-orange/theme.css'
import 'primeicons/primeicons.css'
import { getAllProducts } from "@/supabase"
import Header from "./components/Header"
import Searchbar from "./components/Searchbar"
import HeaderMenu from "./components/HeaderMenu"
import Homepage from "./components/Homepage"
import Footer from "./components/Footer"

export default async function Home() {
  console.log(await getAllProducts())

  return (
    <>
      <PrimeReactProvider>
        <div className="main--container">
          <Header />
          <Searchbar />
          <HeaderMenu />
          <div className="main--content">
            <Homepage />
          </div>
          <Footer />
        </div>
      </PrimeReactProvider>
    </>
  )
}

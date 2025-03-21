import { PrimeReactProvider } from 'primereact/api'
import Header from "./components/Header"
import Searchbar from "./components/Searchbar"
import HeaderMenu from "./components/HeaderMenu"
import Homepage from "./components/Homepage"
import Footer from "./components/Footer"
import 'primereact/resources/themes/saga-orange/theme.css'
import 'primeicons/primeicons.css'

export default async function Home() {

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

import type { Metadata } from "next"
import "./globals.css"
import { supabase } from '@/utils/supabaseClient'
import Script from "next/script"
import Header from "./components/Header"
import Searchbar from "./components/Searchbar"
import HeaderMenu from "./components/HeaderMenu"
import Footer from "./components/Footer"
import { PrimeReactProvider } from "primereact/api"
import "primereact/resources/themes/saga-orange/theme.css"
import "primeicons/primeicons.css"

export const metadata: Metadata = {
  title: "Access-Ouaf",
  description: "A school project",
}

async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession()
  console.log(session)
}

checkSession()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Script
        src="https://kit.fontawesome.com/123bd410f9.js"
        crossOrigin="anonymous"
      />
      <body>
        <PrimeReactProvider>
          <div className="main--container">
            <Header />
            <Searchbar />
            <HeaderMenu />
            <div className="main--content">{children}</div>
            <Footer />
          </div>
        </PrimeReactProvider>
      </body>
    </html>
  )
}

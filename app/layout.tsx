import type { Metadata } from "next"
import { cookies } from "next/headers"
import "./globals.css"
import AuthProvider from './components/AuthProvider'
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

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  const jwt = await cookies().get('jwt')?.value || null

  return (
      <html lang="en">
      <Script
          src="https://kit.fontawesome.com/123bd410f9.js"
          crossOrigin="anonymous"
      />
      <body>
      <PrimeReactProvider>
        <AuthProvider jwt={jwt}>
          <div className="main--container">
            <Header/>
            <Searchbar/>
            <HeaderMenu/>
            <div className="main--content">
              {children}
            </div>
            <Footer/>
          </div>
        </AuthProvider>
      </PrimeReactProvider>
      </body>
      </html>
  )
}

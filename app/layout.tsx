import type { Metadata } from "next"
import "./globals.css"
import Script from "next/script"
import { Urbanist, Quicksand } from "next/font/google"

const urbanist = Urbanist({ weight: "600", subsets: ["latin"] })
const quicksand = Quicksand({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Access-Ouaf",
  description: "A school project",
}

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
      <body
        className={`${quicksand.className} ${urbanist.className}`}
        style={{
          "--font-quicksand": quicksand.style.fontFamily,
          "--font-urbanist": urbanist.style.fontFamily,
        } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  )
}

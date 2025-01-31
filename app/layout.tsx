import type { Metadata } from "next"
import "./globals.css"
import Script from "next/script"

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
      <body>{children}</body>
    </html>
  )
}

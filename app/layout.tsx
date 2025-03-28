import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";
import Script from "next/script";
import Header from "./components/Header";
import Searchbar from "./components/Searchbar";
import HeaderMenu from "./components/HeaderMenu";
import Footer from "./components/Footer";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/saga-orange/theme.css";
import "primeicons/primeicons.css";
import { Urbanist, Quicksand } from "next/font/google";

const urbanist = Urbanist({ weight: "600", subsets: ["latin"] });
const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Access-Ouaf",
  description: "A school project",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = cookies();
  const jwt = (await cookieStore).get("jwt")?.value || undefined;

  return (
    <html lang="en">
      <Script
        src="https://kit.fontawesome.com/123bd410f9.js"
        crossOrigin="anonymous"
      />
      <body
        className={`${quicksand.className} ${urbanist.className}`}
        style={
          {
            "--font-quicksand": quicksand.style.fontFamily,
            "--font-urbanist": urbanist.style.fontFamily,
          } as React.CSSProperties
        }
      >
        <PrimeReactProvider>
          <AuthProvider jwt={jwt}>
            <div className="main--container">
              <Header />
              <Searchbar />
              <HeaderMenu />
              <div className="main--content">{children}</div>
              <Footer />
            </div>
          </AuthProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}

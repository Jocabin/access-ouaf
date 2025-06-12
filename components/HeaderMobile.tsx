"use client"

import React, { useEffect, useState } from "react"
import Logo from "./Logo"
import Searchbar from "./Searchbar"
import MobileAdSection from "./MobileAdSection"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { Button } from "primereact/button"
import { Divider } from "primereact/divider"
import { translations } from "@/lib/translations"
import { usePathname } from "next/navigation"

export default function HeaderMobile() {
  const supabase = createClient()

  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const toggleMenu = () => setIsOpen(!isOpen)
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { label: "Messages", href: "/messages" },
    { label: "Favoris", href: "/wishlist" },
    { label: "Profil", href: `/profile/${user?.id}` },
    { label: "Commandes", href: "/dashboard/orders" },
    { label: "Mon compte", href: "/dashboard" },
    { label: "Mes informations", href: "/dashboard/account" },
    { label: "Mes annonces", href: "/dashboard/adverts" },
    { label: "Mes animaux", href: "/dashboard/animal" },
  ]

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    fetchUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsOpen(false)
    router.push("/logout")
  }

  return (
    <header className="header-mobile">
      <Logo />
      <Searchbar />
      <MobileAdSection />

      <button
        onClick={toggleMenu}
        aria-label="Toggle menu"
        className="burger-menu-button w-[2rem] h-[2rem] flex items-center justify-center"
      >
        <i
          className={`header--burger-icon ${
            isOpen ? "pi pi-times" : "pi pi-bars"
          }`}
        />
      </button>

      {isOpen && (
        <div className="menu-mobile">
          <ul className="w-full px-4">
            {menuItems.map((item, index) => (
              <li key={index} className="w-full">
                <Link
                  href={user ? item.href : "/login"}
                  className="no-underline block text-white py-2 hover:text-orange-400"
                >
                  {item.label}
                </Link>

                {index !== menuItems.length - 1 && <Divider className="my-1" />}
              </li>
            ))}

            {!user ? (
              <li>
                <Link href="/login">
                  <Button className="mt-6">{translations.nav.login}</Button>
                </Link>
              </li>
            ) : (
              <li>
                <Button className="mt-6" onClick={handleLogout}>
                  {translations.nav.logout}
                </Button>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}

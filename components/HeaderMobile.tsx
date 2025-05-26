"use client"

import React, { useEffect, useState } from "react"
import Logo from "./Logo"
import Searchbar from "./Searchbar"
import MobileAdSection from "./MobileAdSection"

export default function HeaderMobile() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

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

  return (
    <>
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
            className={`header--burger-icon fa-solid ${
              isOpen ? "fa-xmark" : "fa-bars"
            }`}
          />
        </button>

        {isOpen && (
          <div className="menu-mobile">
            <p>toto</p>
          </div>
        )}
      </header>
    </>
  )
}

import React, { useEffect, useState } from "react"
import Logo from "./Logo"
import Searchbar from "./Searchbar"

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
        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className="burger-menu-button"
        >
          {isOpen ? (
            <i className="header--burger-icon fa-solid fa-xmark"></i>
          ) : (
            <i className="header--burger-icon fa-solid fa-bars"></i>
          )}
        </button>

        {isOpen && (
          <div className="menu-mobile">
            <h1>toto</h1>
            <h1>toto</h1>
            <h1>toto</h1>
            <h1>toto</h1>
            <h1>toto</h1>
            <h1>toto</h1>
          </div>
        )}
      </header>
    </>
  )
}

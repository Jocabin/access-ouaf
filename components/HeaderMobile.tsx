import React from "react"
import Logo from "./Logo"
import Searchbar from "./Searchbar"

export default function HeaderMobile() {
  return (
    <>
      <header>
        <Logo />
        <Searchbar />
        <i className="header--burger-icon fa-solid fa-bars"></i>
      </header>
    </>
  )
}

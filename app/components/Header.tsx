"use client"
import React, { useState } from 'react'
import Logo from "./Logo"
import RegisterForm from './RegisterForm'

export default function Header() {
  const [isRegisterOpen, setRegisterOpen] = useState(false)

  const toggleRegister = () => {
    setRegisterOpen(!isRegisterOpen)
  }

  return (
    <>
      <header>
        <i className="header--burger-icon fa-solid fa-burger"></i>
        <Logo />
        <div className="header--icons">
          <i className="fa-regular fa-heart" />
          <i className="fa-regular fa-paper-plane" />
          <i className="fa-regular fa-user" onClick={ toggleRegister } />
        </div>
        { isRegisterOpen && <RegisterForm /> }
      </header>
    </>
  )
}

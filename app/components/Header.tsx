"use client"
import React, { useState, useRef } from 'react'
import Logo from "./Logo"
import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'
import { translations } from '../translations'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { TieredMenu } from 'primereact/tieredmenu'
import { useAuth } from './AuthProvider'

export default function Header() {
  const [visible, setVisible] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const { user, refreshUser } = useAuth()
  const menu = useRef<TieredMenu>(null)

  const handleSuccessLogin = async (jwt: string) => {
    setIsRegistered(true)
    setVisible(false)
    if (refreshUser) {
      await refreshUser(jwt)
    }
  }

  const handleSuccessRegister = () => {
    setIsRegistered(true)
  }

  const handleToggleForm = () => {
    setIsLogin(!isLogin)
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/user/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Échec de la déconnexion')
      }

      window.location.reload()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  const items = [
    {
      label: translations.nav.account,
      icon: 'pi pi-home',
      url: '/'
    },
    {
      label: translations.nav.logout,
      icon: 'pi pi-sign-out',
      command: handleLogout
    }
  ]

  return (
    <>
      <header>
        <i className="header--burger-icon fa-solid fa-burger"></i>
        <Logo />
        <div className="header--icons">
          <Button icon="fa-regular fa-heart" text onClick={() => null} />
          <Button icon="fa-regular fa-paper-plane" text onClick={() => null} />
          <TieredMenu model={ items } popup ref={ menu } breakpoint="767px" />
          <Button icon="pi pi-user" text onClick={(e) => user === null ? setVisible(true) : menu.current?.toggle(e)} />
          <Dialog
              className="responsive-dialog"
              visible={visible}
              header={ isLogin ? translations.header.loginDialogTitle : translations.header.registerDialogTitle }
              draggable={false}
              style={{
                height: 'auto',
                maxHeight: '90vh',
              }}
              onHide={() => setVisible(false)}
          >
            {isRegistered && !isLogin ? (
                <div>
                    <p>{translations.header.registerSuccessMessage}</p>
                    <Button label={ translations.header.closeButton } className="w-full mt-4" onClick={() => {
                      setVisible(false);
                      setIsRegistered(false);}}
                    />
                </div>
            ) : (
              <div>
                {isLogin ? (
                  <LoginForm onSuccess={ handleSuccessLogin } />
                ) : (
                  <RegisterForm onSuccess={ handleSuccessRegister } />
                )}
                <span
                  className="cursor-pointer mt-4 block text-center text-xs"
                  onClick={ handleToggleForm }
                >
                  { isLogin ? translations.login.register : translations.register.login }
                </span>
              </div>
            )}
          </Dialog>
        </div>
      </header>
    </>
  )
}

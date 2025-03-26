"use client"
import React, { useState } from 'react'
import Logo from "./Logo"
import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'
import { translations } from '../translations'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { useAuth } from './AuthProvider'

export default function Header() {
  const [visible, setVisible] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const { user, loading } = useAuth()

  const handleSuccess = () => {
    setIsRegistered(true)
  }

  const handleToggleForm = () => {
    setIsLogin(!isLogin)
  }

  return (
    <>
      <header>
        <i className="header--burger-icon fa-solid fa-burger"></i>
        <Logo />
        <div className="header--icons">
          <Button icon="fa-regular fa-heart" text onClick={() => null} />
          <Button icon="fa-regular fa-paper-plane" text onClick={() => null} />
          <Button icon="pi pi-user" text onClick={() => setVisible(true)} />
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
            {isRegistered ? (
                <div>
                    <p>{translations.header.registerSuccessMessage}</p>
                    <Button label={ translations.header.closeButton } className="w-full mt-4" onClick={() => {
                    setVisible(false);
                    setIsRegistered(false);
                  }} />
                </div>
            ) : (
              <div>
                {isLogin ? (
                  <LoginForm onSuccess={ handleSuccess } />
                ) : (
                  <RegisterForm onSuccess={ handleSuccess } />
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

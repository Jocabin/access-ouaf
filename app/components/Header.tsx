"use client"
import React, { useState } from 'react'
import Logo from "./Logo"
import RegisterForm from './RegisterForm'
import { translations } from '../translations'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

export default function Header() {
  const [visible, setVisible] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSuccess = () => {
    setIsRegistered(true)
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
              header={ translations.header.registerDialogTitle }
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
                <RegisterForm onSuccess={ handleSuccess } />
            )}
          </Dialog>
        </div>
      </header>
    </>
  )
}

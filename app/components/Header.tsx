"use client"
import React, { useState } from 'react'
import Logo from "./Logo"
import RegisterForm from './RegisterForm'
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
              visible={visible}
              header="Inscription"
              draggable={false}
              style={{ width: '30vw', height: '70vh' }}
              onHide={() => setVisible(false)}
          >
            {isRegistered ? (
                <div>
                  <p>Inscription réussie, vérifiez votre boîte mail pour activer votre compte.</p>
                  <Button label="Fermer" className="w-full mt-4" onClick={() => {
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

"use client"

import React, { useState, useRef, useEffect } from "react"
import Logo from "./Logo"
import RegisterForm from "./RegisterForm"
import LoginForm from "./LoginForm"
import { translations } from "@/lib/translations"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { TieredMenu } from "primereact/tieredmenu"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { redirect, useRouter } from "next/navigation"
import Searchbar from "./Searchbar"

export default function HeaderDesktop() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [hideToggle, setHideToggle] = useState(false)
  const menu = useRef<TieredMenu>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSuccessLogin = async () => {
    setIsRegistered(true)
    setVisible(false)
    window.location.reload()
  }

  const handleSuccessRegister = () => {
    setIsRegistered(true)
  }

  const handleToggleForm = () => {
    setIsLogin(!isLogin)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    redirect("/")
  }

  const items = [
    {
      disabled: true,
      template: () => (
        <div className="mb-3">
          <span className="text-base text-black px-2">
            {translations.nav.bonjour} {user?.user_metadata.display_name}
          </span>
        </div>
      ),
    },
    {
      label: translations.nav.account,
      icon: "pi pi-home",
      url: "/dashboard",
    },
    {
      label: translations.nav.logout,
      icon: "pi pi-sign-out",
      command: handleLogout,
    },
  ]

  return (
    <>
      <header>
        <Logo />
        <Searchbar />
        <div className="header--icons">
          <Button
            icon="fa-regular fa-heart"
            text
            onClick={() => {
              router.push("/wishlist")
            }}
          />
          <Button icon="fa-regular fa-paper-plane" text onClick={() => null} />
          <TieredMenu model={items} popup ref={menu} breakpoint="767px" />
          {!loading &&
            (user ? (
              <Button
                icon="pi pi-user"
                text
                onClick={(e) => menu.current?.toggle(e)}
              />
            ) : (
              <Button
                icon="pi pi-sign-in"
                text
                onClick={() => setVisible(true)}
              />
            ))}
          <Dialog
            className="responsive-dialog"
            visible={visible}
            header={
              isLogin
                ? translations.header.loginDialogTitle
                : translations.header.registerDialogTitle
            }
            draggable={false}
            style={{
              height: "auto",
              maxHeight: "90vh",
            }}
            onHide={() => setVisible(false)}
          >
            {isRegistered && !isLogin ? (
              <div>
                <p>{translations.header.registerSuccessMessage}</p>
                <Button
                  label={translations.header.closeButton}
                  className="w-full mt-4"
                  onClick={() => {
                    setVisible(false)
                    setIsRegistered(false)
                  }}
                />
              </div>
            ) : (
              <div>
                {isLogin ? (
                  <LoginForm
                    onSuccess={handleSuccessLogin}
                    setHideToggle={setHideToggle}
                  />
                ) : (
                  <RegisterForm onSuccess={handleSuccessRegister} />
                )}
                {!hideToggle && (
                  <span
                    className="cursor-pointer mt-4 block text-center text-xs"
                    onClick={handleToggleForm}
                  >
                    {isLogin
                      ? translations.login.register
                      : translations.register.login}
                  </span>
                )}
              </div>
            )}
          </Dialog>
        </div>
      </header>
    </>
  )
}

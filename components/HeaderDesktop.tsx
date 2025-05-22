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
import { usePathname } from "next/navigation";

export default function HeaderDesktop() {
  const router = useRouter()
  const pathname = usePathname();
  const supabase = createClient()
    const [unreadConversationsCount, setUnreadConversationsCount] = useState(0);
  

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

  useEffect(() => {
      if (!user) return;      
      async function fetchUnreadConversations() {
        const { data: unreadMessages, error } = await supabase
          .from('messages')
          .select('room_name')
          .eq('is_read', false)
          .neq('sender_id', user?.id);
        
        if (error) {
          console.error('Erreur lors de la récupération des messages non lus:', error);
          return;
        }
        
        const uniqueRooms = new Set();
        unreadMessages?.forEach(msg => uniqueRooms.add(msg.room_name));
        setUnreadConversationsCount(uniqueRooms.size);
      }
      
      fetchUnreadConversations();
      
      const channel = supabase
        .channel('header-unread-messages')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'messages'
        }, () => {
          fetchUnreadConversations();
        })
        .subscribe();
        
      return () => {
        channel.unsubscribe();
      };
    }, [user, supabase, pathname]);

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
          <div className="relative">
                      <Button 
                        icon="fa-regular fa-paper-plane" 
                        text 
                        onClick={() => {
                          router.push("/messages");
                        }} 
                      />
                      {unreadConversationsCount > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 bg-[#b3592a] text-white text-xs rounded-full">
                          {unreadConversationsCount}
                        </span>
                      )}
                    </div>
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
                icon="pi pi-user-plus"
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

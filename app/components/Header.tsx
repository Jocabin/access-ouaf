"use client";

import React, { useState, useRef, useEffect } from "react";
import Logo from "./Logo";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { translations } from "../translations";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { TieredMenu } from "primereact/tieredmenu";
import { createClient } from "@/src/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const supabase = createClient();

  const [visible, setVisible] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const menu = useRef<TieredMenu>(null);
  const [user, set_user] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      set_user(user);
    }
    fetchUser();
  }, [supabase.auth]);

  const handleSuccessLogin = async () => {
    setIsRegistered(true);
    setVisible(false);
    window.location.reload();
  };

  const handleSuccessRegister = () => {
    setIsRegistered(true);
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    console.log(error);
    window.location.reload();
  };

  const items = [
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
  ];

  return (
    <>
      <header>
        <i className="header--burger-icon fa-solid fa-burger"></i>
        <Logo />
        <div className="header--icons">
          <Button
            icon="fa-regular fa-heart"
            text
            onClick={() => {
              router.push("/wishlist");
            }}
          />
          <Button icon="fa-regular fa-paper-plane" text onClick={() => null} />
          <TieredMenu model={items} popup ref={menu} breakpoint="767px" />
          <Button
            icon="pi pi-user"
            text
            onClick={(e) =>
              user === null ? setVisible(true) : menu.current?.toggle(e)
            }
          />
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
                    setVisible(false);
                    setIsRegistered(false);
                  }}
                />
              </div>
            ) : (
              <div>
                {isLogin ? (
                  <LoginForm onSuccess={handleSuccessLogin} />
                ) : (
                  <RegisterForm onSuccess={handleSuccessRegister} />
                )}
                <span
                  className="cursor-pointer mt-4 block text-center text-xs"
                  onClick={handleToggleForm}
                >
                  {isLogin
                    ? translations.login.register
                    : translations.register.login}
                </span>
              </div>
            )}
          </Dialog>
        </div>
      </header>
    </>
  );
}

"use client";
import Image from "next/image";
import { translations } from "@/app/translations";
import ButtonMe from "@/app/components/Button";
import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

export default function HomepageAd() {
  const logoUrl = "/assets/chat-homepage.jpg";
  const [dialog_visible, set_dialog_visible] = useState(false);
  const [loading, set_loading] = useState(false);
  const toast = useRef<Toast>(null);

  function toggleCreateItemDialog() {
    set_dialog_visible(!dialog_visible);
  }

  function handleSubmit() {
    set_loading(true);
    set_loading(false);
  }

  function handleChange() {}

  return (
    <>
      <div className="relative flex justify-center mt-20">
        <Image
          src={logoUrl}
          alt="Image d'un chat"
          width={1170}
          height={395}
          className="cat-picture"
        />
        <div className="absolute top-1/2 left-0 bg-white -translate-y-1/2 ml-40 p-5 rounded-lg">
          <h1 className="title-home-card mb-2">{translations.homeCard.bold}</h1>
          <p className="mb-5 max-w-80">{translations.homeCard.text}</p>
          <ButtonMe onClick={toggleCreateItemDialog}>
            {translations.button.addItem}
          </ButtonMe>
        </div>
      </div>

      {/* dialog */}
      <Dialog
        className="responsive-dialog"
        visible={dialog_visible}
        header={"Créer votre annonce maintenant"}
        draggable={false}
        style={{
          height: "auto",
          maxHeight: "90vh",
        }}
        onHide={() => set_dialog_visible(false)}
      >
        <div>
          <Toast ref={toast} />

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email">{translations.login.email}</label>
                <InputText
                  type="email"
                  id="email"
                  name="email"
                  className="p-inputtext-sm"
                  placeholder={translations.login.placeholder}
                  value={""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password">{translations.login.password}</label>
                <InputText
                  type="password"
                  id="password"
                  name="password"
                  className="p-inputtext-sm"
                  value={""}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button
                type="submit"
                className="flex justify-center mt-4"
                loading={loading}
              >
                {translations.login.loginButton}
              </Button>
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
}

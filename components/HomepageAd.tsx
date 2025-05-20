"use client";
import Image from "next/image";
import { translations } from "@/lib/translations";
import ButtonMe from "@/components/Button";
import NewAdModal from "./NewAdModal";
import { useState } from "react";

export default function HomepageAd({ categories }) {
  const logoUrl = "/assets/chat-homepage.jpg";
  const [dialog_visible, set_dialog_visible] = useState(false);

  function toggleCreateItemDialog() {
    set_dialog_visible(!dialog_visible);
  }

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

      <NewAdModal
        visible={dialog_visible}
        set_dialog_visible={set_dialog_visible}
        categories={categories}
      />
    </>
  );
}

import Image from "next/image";
import { translations } from "@/lib/translations";
import ButtonMe from "@/components/Button";
import NewAdModal from "./NewAdModal";
import { useRef, useState } from "react";
import { Category } from "@/types";
import { Toast } from "primereact/toast";

type HomepageAdType = {
  categories: Category[];
};

export default function HomepageAd({ categories }: HomepageAdType) {
  const imageUrl = "/assets/homepage_banner.jpg";
  const [dialogVisible, setDialogVisible] = useState(false);
  const toast = useRef<Toast>(null);

  function toggleCreateItemDialog() {
    setDialogVisible(!dialogVisible);
  }

  const ButtonAddItem = () => (
    <ButtonMe onClick={toggleCreateItemDialog}>
      {translations.button.addItem}
    </ButtonMe>
  );

  return (
    <>
      {/* Version desktop */}
      <div className="hidden md:flex relative justify-center mt-20">
        <Image
          src={imageUrl}
          alt={translations.site.description}
          width={1248}
          height={0}
          style={{ height: "395px" }}
          className="object-cover rounded-2xl"
          priority
        />
        <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 md:left-24 bg-[var(--white)] p-5 rounded-xl w-[450px]">
          <h1 className="text-3xl">{translations.homeCard.title}</h1>
          <p className="break-words">{translations.homeCard.text}</p>
          <ButtonAddItem />
        </div>
      </div>

      {/* Mobile */}
      <div className="block md:hidden px-4 mt-4">
        <ButtonAddItem />
      </div>

      <NewAdModal
        toast={toast}
        visible={dialogVisible}
        set_dialog_visible={setDialogVisible}
        categories={categories}
      />
    </>
  );
}

"use client";

import { useState, type SetStateAction, type Dispatch, useEffect } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Category } from "@/types";
import { InputNumber } from "primereact/inputnumber";
import { createAd } from "@/services/new-ad.service";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/translations";

export interface ModalProps {
  visible: boolean;
  set_dialog_visible: Dispatch<SetStateAction<boolean>>;
  categories: Category[];
  toast: React.RefObject<Toast>;
}

export default function NewAdModal({
  visible,
  set_dialog_visible,
  categories,
  toast,
}: ModalProps) {
  const router = useRouter();
  const [loading, set_loading] = useState(false);
  const [states] = useState(["Neuf", "Usé", "Correct"]);

  const [title, set_title] = useState("");
  const [description, set_description] = useState("");
  const [price, set_price] = useState(0);
  const [brand, set_brand] = useState("");
  const [selected_state, set_selected_state] = useState("");
  const [selectedKT, setSelectedKT] = useState<Category>(categories[0]);
  const [img, set_img] = useState<string[]>([]);
  const [size, set_size] = useState("");

  const capitalizedCategories = categories.map((cat) => ({
    ...cat,
    name: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
  }));

  useEffect(() => {
    async function redirect_if_not_connected() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      }
    }

    if (visible) {
      redirect_if_not_connected();
    }
  }, [visible, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    set_loading(true);

    const product_status = await createAd({
      name: title,
      description: description,
      price: price,
      brand: brand,
      state: selected_state,
      img: img.join(","),
      category: selectedKT.id,
      size: size,
    });
    set_loading(false);

    if (product_status.error) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: product_status.msg,
      });
    } else {
      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: product_status.msg,
      });

      setTimeout(() => {
        set_dialog_visible(false);
        router.push("/dashboard/adverts");
      }, 2000);
    }
  }

  async function uploadImages(event: FileUploadHandlerEvent) {
    set_loading(true);

    for (let i = 0; i < event.files.length; i += 1) {
      const file = event.files[i];

      const formData = new FormData();
      formData.append("file-" + i, file);

      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}_${file.name}`;

      const supabase = createClient();
      const { error } = await supabase.storage
        .from("images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        toast.current?.show({
          severity: "error",
          summary: "Erreur",
          detail: error.message,
        });
      } else {
        toast.current?.show({
          severity: "info",
          summary: "Succès",
          detail: "Image téléchargée",
        });

        set_img([...img, fileName]);
      }
    }

    set_loading(false);
  }

  return (
    <>
      <Dialog
        className="responsive-dialog"
        visible={visible}
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
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <label htmlFor="title" className="font-bold block mb-2">
                  {translations.newAdModal.title}
                </label>
                <InputText
                  type="text"
                  id="title"
                  name="title"
                  className="p-inputtext-sm"
                  placeholder={translations.newAdModal.titlePlaceholder}
                  onChange={(e) => set_title(e.target.value)}
                  value={title}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="desc" className="font-bold block mb-2">
                  {translations.newAdModal.description}
                </label>
                <InputText
                  type="text"
                  id="desc"
                  name="desc"
                  className="p-inputtext-sm"
                  placeholder={translations.newAdModal.descriptionPlaceholder}
                  value={description}
                  onChange={(e) => set_description(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="desc" className="font-bold block mb-2">
                  {translations.newAdModal.size}
                </label>
                <InputText
                  type="text"
                  id="desc"
                  name="desc"
                  className="p-inputtext-sm"
                  placeholder={translations.newAdModal.sizePlaceholder}
                  value={size}
                  onChange={(e) => set_size(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="brand" className="font-bold block mb-2">
                  {translations.newAdModal.brand}
                </label>
                <InputText
                  type="text"
                  id="brand"
                  name="brand"
                  className="p-inputtext-sm"
                  placeholder="SuperNonos"
                  value={brand}
                  onChange={(e) => set_brand(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="photos" className="font-bold block mb-2">
                  {translations.newAdModal.addPhotos}
                </label>
                <FileUpload
                  multiple
                  auto
                  name="imgs[]"
                  accept="image/*"
                  maxFileSize={1000000}
                  chooseLabel={translations.newAdModal.imagesPlaceholder}
                  customUpload
                  uploadHandler={uploadImages}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="font-bold block mb-2">
                  {translations.newAdModal.category}
                </label>

                <Dropdown
                  id="category"
                  name="category"
                  value={selectedKT}
                  onChange={(e) => {
                    setSelectedKT(e.value);
                  }}
                  options={capitalizedCategories}
                  optionLabel="name"
                  placeholder="Choisir une catégorie"
                  className="w-full md:w-14rem"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="state" className="font-bold block mb-2">
                  {translations.newAdModal.state}
                </label>

                <Dropdown
                  id="state"
                  name="state"
                  value={selected_state}
                  onChange={(e) => {
                    set_selected_state(e.value);
                  }}
                  options={states}
                  placeholder="L'état de votre produit"
                  className="w-full md:w-14rem"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="price" className="font-bold block mb-2">
                  {translations.newAdModal.price}
                </label>
                <InputNumber
                  value={price}
                  min={0}
                  onValueChange={(e) => set_price(e.value ?? 0)}
                  placeholder="10,00"
                  id="price"
                  name="price"
                  mode="currency"
                  currency="EUR"
                  locale="fr-FR"
                />
              </div>

              <Button
                type="submit"
                className="flex justify-center mt-4"
                loading={loading}
              >
                {translations.newAdModal.submitButton}
              </Button>
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
}

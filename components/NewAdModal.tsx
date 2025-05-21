"use client";

import { useRef, useState, type SetStateAction, type Dispatch } from "react";
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

export interface ModalProps {
  visible: boolean;
  set_dialog_visible: Dispatch<SetStateAction<boolean>>;
  categories: Category[];
}

export default function NewAdModal({
  visible,
  set_dialog_visible,
  categories,
}: ModalProps) {
  const toast = useRef<Toast>(null);
  const [loading, set_loading] = useState(false);
  const [states] = useState(["Neuf", "Usé", "Correct"]);

  const [title, set_title] = useState("");
  const [description, set_description] = useState("");
  const [price, set_price] = useState(0);
  const [brand, set_brand] = useState("");
  const [selected_state, set_selected_state] = useState("");
  const [selectedKT, setSelectedKT] = useState<Category | null>(null);
  const [img, set_img] = useState("null");

  function handleSubmit() {
    set_loading(true);

    createAd({
      name: title,
      description: description,
      price: price,
      brand: brand,
      state: selected_state,
      img: img,
    });
    set_loading(false);
  }

  async function uploadImages(event: FileUploadHandlerEvent) {
    set_loading(true);
    const file = event.files[0];

    const formData = new FormData();
    formData.append("file", file);

    const fileName = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 15)}_${file.name}`;

    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    console.log(data);

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
                  Nom de l&apos;annonce
                </label>
                <InputText
                  type="text"
                  id="title"
                  name="title"
                  className="p-inputtext-sm"
                  placeholder="Laisse pour chien"
                  onChange={(e) => set_title(e.target.value)}
                  value={title}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="desc" className="font-bold block mb-2">
                  Description
                </label>
                <InputText
                  type="text"
                  id="desc"
                  name="desc"
                  className="p-inputtext-sm"
                  placeholder="Je vends ma laisse pour grand chiens..."
                  value={description}
                  onChange={(e) => set_description(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="brand" className="font-bold block mb-2">
                  Marque
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
                  Ajouter des photos
                </label>
                <FileUpload
                  multiple
                  auto
                  name="imgs[]"
                  accept="image/*"
                  maxFileSize={1000000}
                  chooseLabel="Selectionner des images"
                  customUpload
                  uploadHandler={uploadImages}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="font-bold block mb-2">
                  Catégorie
                </label>

                {/* <Dropdown
                  id="category"
                  name="category"
                  value={selectedKT}
                  onChange={(e) => {
                    setSelectedKT(e.value);
                  }}
                  options={categories}
                  optionLabel="name"
                  optionValue="name"
                  placeholder="Choisir une catégorie"
                  className="w-full md:w-14rem"
                /> */}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="state" className="font-bold block mb-2">
                  État
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
                  Prix
                </label>
                <InputNumber
                  value={price}
                  min={0}
                  onValueChange={(e) => set_price(e.value)}
                  id="price"
                  name="price"
                />
              </div>

              <Button
                type="submit"
                className="flex justify-center mt-4"
                loading={loading}
              >
                Mettre en vente
              </Button>
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
}

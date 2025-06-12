"use client"
import React, { useState } from "react"
import { deleteAdvert, deleteImages } from "@/services/adverts.service"
import { capitalizeFirstLetter } from "@/utils/helpers/capitalizeFirstLetter"
import { Category } from "@/types"
import AdvertSheetForm from "@/components/AdvertSheetForm"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { translations } from "@/lib/translations"
import DashboardBreadcrumb from "./DashboardBreadcrumb"

export interface Advert {
  id: string
  slug: string
  name: string
  description: string
  brand: string
  state: string
  price: number
  category: Category
  img: string
}

export default function AdvertDashboard({
  adverts,
  categories,
}: {
  adverts: Advert[]
  categories: Category[]
}) {
  const [formVisible, setFormVisible] = useState(false)
  const [advertList, setAdvertList] = useState(adverts)
  const [selectedAdvert, setSelectedAdvert] = useState<Advert | null>(null)

  const handleDelete = async (advert: Advert | undefined) => {
    if (!advert || !advert.id) return
    if (advert.img) {
      const imageNames = advert.img
        .split(",")
        .map((name: string) => name.trim())
      for (const imgName of imageNames) {
        await deleteImages(imgName)
      }
    }
    await deleteAdvert(advert.id)
    setAdvertList((prev) => prev.filter((a) => a.id !== advert.id))
  }

  const confirmDelete = (advert: Advert) => {
    confirmDialog({
      header: translations.dashboard.advertsPage.dialogTitle,
      message: translations.dashboard.advertsPage.dialogMessage,
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      acceptLabel: translations.dashboard.advertsPage.acceptLabel,
      rejectLabel: translations.dashboard.advertsPage.rejectLabel,
      accept: () => handleDelete(advert),
      reject: () => null,
    })
  }

  return (
    <>
      <DashboardBreadcrumb
        pageName={translations.dashboard.advertsPage.title}
        pageSlug="adverts"
      />

      <ConfirmDialog />
      <h1 className="flex justify-center pb-6">
        {translations.dashboard.advertsPage.title}
      </h1>
      <div className="flex flex-col md:flex-row flex-wrap gap-4">
        {advertList.map((advert) => (
          <div key={advert.id} className="w-full md:basis-[calc(50%-0.5rem)]">
            <div className="p-card p-4 border-round surface-card shadow-2">
              <div className="flex justify-between items-center">
                <h3>{capitalizeFirstLetter(advert.name)}</h3>
                <div>
                  <Button
                    label={translations.dashboard.advertsPage.showButton}
                    icon="pi pi-eye"
                    className="p-button-text p-button-sm p-button-primary p-1 md:p-2 hide-label-on-mobile"
                    onClick={() =>
                      (window.location.href = `/items/${advert.slug}`)
                    }
                  />
                  <Button
                    label={translations.dashboard.advertsPage.editButton}
                    icon="pi pi-pencil"
                    className="p-button-text p-button-sm p-1 md:p-2 hide-label-on-mobile"
                    onClick={() => {
                      setSelectedAdvert(advert)
                      setFormVisible(true)
                    }}
                  />
                  <Button
                    label={translations.dashboard.advertsPage.deleteButton}
                    icon="pi pi-trash"
                    className="p-button-text p-button-sm p-button-danger p-1 md:p-2 hide-label-on-mobile"
                    onClick={() => confirmDelete(advert)}
                  />
                </div>
              </div>
              <p>
                <strong>Catégorie :</strong>{" "}
                {capitalizeFirstLetter(advert.category?.name) ?? "Non renseignée"}
              </p>
              <p>
                <strong>Marque :</strong> {advert.brand}
              </p>
              <p>
                <strong>État :</strong> {advert.state}
              </p>
              <p>
                <strong>Prix :</strong> {advert.price}€
              </p>
              <p>
                <strong>Image(s) :</strong>
              </p>
              <div className="flex flex-wrap gap-2 min-h-[96px] items-center">
                {advert.img?.trim() ? (
                  advert.img
                    .split(",")
                    .filter((img) => img.trim() !== "")
                    .map((img, index) => (
                      <img
                        key={index}
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${
                          process.env.NEXT_PUBLIC_IMG_URL
                        }${img.trim()}?v=${Date.now()}`}
                        alt={`Image ${index + 1}`}
                        className="w-24 h-24 object-cover border rounded"
                      />
                    ))
                ) : (
                  <span className="text-sm text-gray-500">
                    Aucune image publiée
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row-reverse my-8">
        <Button
          label={translations.dashboard.advertsPage.newAdvert}
          className="p-button-primary"
          onClick={() => {
            setSelectedAdvert(null)
            setFormVisible(true)
          }}
        />
      </div>

      <Dialog
        visible={formVisible}
        draggable={false}
        onHide={() => setFormVisible(false)}
        header={
          selectedAdvert
            ? translations.dashboard.advertsPage.advertSheetForm.headerEdit
            : translations.dashboard.advertsPage.advertSheetForm.headerCreate
        }
        style={{ width: "90vw", maxWidth: "800px" }}
      >
        <AdvertSheetForm
          advert={selectedAdvert ?? undefined}
          categories={categories ?? undefined}
          onSuccess={(updatedAdvert) => {
            if (selectedAdvert) {
              setAdvertList((prev) =>
                prev.map((a) => (a.id === updatedAdvert.id ? updatedAdvert : a))
              )
            } else {
              setAdvertList((prev) => [...prev, updatedAdvert])
            }
            setFormVisible(false)
          }}
        />
      </Dialog>
    </>
  )
}

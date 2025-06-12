"use client"

import { Category } from "@/types/interfaces/category.interface"
import NewAdModal from "./NewAdModal"
import { useRef, useState } from "react"
import { Toast } from "primereact/toast"

type MobileAdType = {
  categories: Category[]
}

export default function MobileAd({ categories }: MobileAdType) {
  const [dialogVisible, setDialogVisible] = useState(false)

  const toast = useRef<Toast>(null)

  function toggleCreateItemDialog() {
    setDialogVisible(!dialogVisible)
  }

  const ButtonAddItem = () => (
    <span onClick={toggleCreateItemDialog}>
      <i className="header--burger-icon fa-solid fa-square-plus"></i>
    </span>
  )

  return (
    <>
      <ButtonAddItem />

      <NewAdModal
        visible={dialogVisible}
        set_dialog_visible={setDialogVisible}
        categories={categories}
        toast={toast}
      />
    </>
  )
}

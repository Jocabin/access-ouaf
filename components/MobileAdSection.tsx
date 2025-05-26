"use client"

import { useEffect, useState } from "react"
import { getAllCategories } from "@/services/categories.service"
import MobileAd from "./MobileAd"
import { Category } from "@/types/interfaces/category.interface"

export default function MobileAdSection() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    getAllCategories().then((data) => setCategories(data))
  }, [])

  return <MobileAd categories={categories} />
}

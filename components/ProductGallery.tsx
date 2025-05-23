/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Galleria } from "primereact/galleria"
import { formatImagesForGallery } from "@/utils/helpers/formatImagesForGallery"

type ProductGalleryProps = {
  imagesString: string
  altText?: string
  titleText?: string
}

export default function ProductGallery({
  imagesString,
  altText,
  titleText,
}: ProductGalleryProps) {
  const [images, setImages] = useState<
    {
      itemImageSrc: string
      thumbnailImageSrc: string
      alt: string
      title: string
    }[]
  >([])

  useEffect(() => {
    const formatted = formatImagesForGallery(imagesString, altText, titleText)
    setImages(formatted)
  }, [imagesString, altText, titleText])

  const itemTemplate = (item: any) => (
    <div className="aspect-square overflow-hidden rounded-xl">
      <img
        src={item.itemImageSrc}
        alt={item.alt}
        className="w-full h-full object-cover"
      />
    </div>
  )

  return (
    <Galleria
      value={images}
      style={{ width: "100%", maxWidth: "640px" }}
      showThumbnails={false}
      showIndicators={images.length > 1}
      item={itemTemplate}
    />
  )
}

'use client'

import Image from "next/image"
import { useState } from "react"

type ImageSliderProps = {
        productImages: string[],
        productDescription: string
}

export default function ImageSlider({ productImages, productDescription }: ImageSliderProps) {
        const [imageIndex, setImageIndex] = useState(0)

        return (
                <div>
                        <Image src={productImages[imageIndex]} alt={productDescription} width={600} height={600} />

                        <nav className="flex justify-center mt-2 mb-4">
                                {productImages.map((_, i) => (
                                        <span key={i} onClick={() => { setImageIndex(i) }}
                                                className={`w-3 h-3 border-2 cursor-pointer border-black rounded-full mx-1 ${(imageIndex === i ? "bg-black" : "")}`} />
                                ))}
                        </nav>
                </div>
        )
}

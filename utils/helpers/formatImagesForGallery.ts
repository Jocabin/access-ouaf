export function formatImagesForGallery(
  imageString: string,
  alt = "",
  title = ""
) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!baseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")

  return imageString.split(",").map((img, i) => {
    const cleanImg = img.trim()
    const fullUrl = `${baseUrl}/storage/v1/object/public/images/${cleanImg}`
    return {
      itemImageSrc: fullUrl,
      thumbnailImageSrc: fullUrl,
      alt: alt || `Image ${i + 1}`,
      title: title || `Image ${i + 1}`,
    }
  })
}
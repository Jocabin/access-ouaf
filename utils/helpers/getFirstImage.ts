export function getFirstImage(imgString: string): string {
  return imgString.split(",")[0].trim()
}

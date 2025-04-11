import Image from "next/image"
import Link from "next/link"

export default function Logo() {
  const logoUrl = "/assets/logo.png"

  return (
    <>
      <Link href="/">
        <Image src={logoUrl} alt="Logo" width={50} height={50} />
      </Link>
    </>
  )
}

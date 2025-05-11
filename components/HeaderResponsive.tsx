"use client"

import { useEffect, useState } from "react"
import HeaderMobile from "./HeaderMobile"
import HeaderDesktop from "./HeaderDesktop"

export default function ResponsiveHeader() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 576)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile ? <HeaderMobile /> : <HeaderDesktop />
}

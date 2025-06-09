"use client"

import { ProgressSpinner } from "primereact/progressspinner"

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <ProgressSpinner
        style={{ width: "80px", height: "80px" }}
        strokeWidth="4"
        fill="transparent"
        animationDuration=".8s"
      />
    </div>
  )
}
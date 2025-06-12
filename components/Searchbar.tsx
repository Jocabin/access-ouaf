"use client"

import { translations } from "@/lib/translations"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { InputText } from "primereact/inputtext"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"

export default function Searchbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  )
  const [query, setQuery] = useState(searchParams?.get("q") ?? "")

  const handleKeyPress = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const q = event.target.value
      setQuery(q)

      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }

      const timeout = setTimeout(() => {
        router.push(`/search?q=${encodeURIComponent(q)}`)
      }, 300)

      setSearchTimeout(timeout)
    },
    [router, searchTimeout]
  )

  return (
    <form
      className="searchbar-form"
      onSubmit={(e) => {
        e.preventDefault()
        router.push(`/search?q=${encodeURIComponent(query)}`)
      }}
    >
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          placeholder={translations.search.placeholder}
          value={query}
          onChange={handleKeyPress}
          className="searchbar-input"
        />
      </IconField>
    </form>
  )
}

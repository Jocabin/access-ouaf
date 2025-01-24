"use client"

import { translations } from "../translations"
// import { useRouter, useSearchParams } from "next/navigation"

export default function Searchbar() {
  //   const searchParams = useSearchParams()
  //   const router = useRouter()

  //   function handleSubmit(event) {
  //     const textInput = event.target.textInput.value
  //     const searchType = event.target.searchType.value
  //     const params = new URLSearchParams(searchParams)

  //     event.preventDefault()

  //     params.set("search", textInput)
  //     params.set("source", searchType)
  //     router.push(`?${params.toString()}`)

  return (
    // <form onSubmit={(event) => handleSubmit(event)}>
    <form className="searchbar__form">
      <input
        className="searchbar__input"
        type="text"
        id="textInput"
        required
        placeholder={translations.search.placeholder}
      />

      <button type="submit" className="searchbar__button">
        <i className="fa fa-search"></i>
      </button>
    </form>
  )
}

"use client"

import { translations } from "../translations"

export default function Searchbar() {
  return (
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

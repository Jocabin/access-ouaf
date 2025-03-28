"use client";

import { translations } from "../translations";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
export default function Searchbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [query, setQuery] = useState(searchParams?.get("q") ?? "");

  const handleKeyPress = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const q = event.target.value;
      setQuery(q);

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        router.push(`/search?q=${encodeURIComponent(q)}`);
      }, 300);

      setSearchTimeout(timeout);
    },
    [router, searchTimeout]
  );

  return (
    <form
      className="searchbar__form"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }}
    >
      <input
        className="searchbar__input"
        type="text"
        id="textInput"
        required
        value={query}
        placeholder={translations.search.placeholder}
        onChange={handleKeyPress}
      />

      <button type="submit" className="searchbar__button">
        <i className="fa fa-search"></i>
      </button>
    </form>
  );
}

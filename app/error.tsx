"use client";

import { translations } from "@/lib/translations";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>{translations.error.message}</h2>
      <button onClick={() => reset()}>{translations.error.button}</button>
    </div>
  );
}

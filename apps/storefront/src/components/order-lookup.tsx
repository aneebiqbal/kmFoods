"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/i18n/language-context";

export function OrderLookup() {
  const { t } = useLanguage();
  const router = useRouter();
  const [reference, setReference] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const value = reference.trim();
        if (value) router.push(`/order/${encodeURIComponent(value)}`);
      }}
      className="well flex flex-col gap-4 p-6 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label htmlFor="reference" className="label">
          {t("order.reference")}
        </label>
        <input
          id="reference"
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          placeholder="KM-000123"
          className="field"
        />
      </div>
      <button type="submit" className="btn btn-primary px-6 py-3 text-sm">
        {t("order.status")}
      </button>
    </form>
  );
}

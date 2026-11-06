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
      className="shell"
    >
      <div className="core flex flex-col gap-4 p-6 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label
            htmlFor="reference"
            className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500"
          >
            {t("order.reference")}
          </label>
          <input
            id="reference"
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            placeholder="KM-000123"
            className="mt-2 w-full rounded-2xl border border-earth-900/12 bg-cream-50 px-4 py-3 text-sm outline-none focus:border-chili-600"
          />
        </div>
        <button type="submit" className="btn btn-primary px-6 py-3 text-sm">
          {t("order.status")}
        </button>
      </div>
    </form>
  );
}

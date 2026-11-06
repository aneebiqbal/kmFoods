"use client";

import { useEffect, useState } from "react";

/**
 * Fetches availability for a set of variant ids. Returns 0 for unknown ids so
 * the UI can render an out-of-stock state instead of guessing.
 */
export function useStock(variantIds: string[]) {
  const [stock, setStock] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const key = variantIds.join(",");

  useEffect(() => {
    if (!key) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/stock?variants=${encodeURIComponent(key)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled) setStock(data?.stock ?? {});
      })
      .catch(() => {
        if (!cancelled) setStock({});
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return { stock, loading };
}

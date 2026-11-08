"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useLanguage } from "@/i18n/language-context";
import { updateLineItemAction } from "@/lib/cart-actions";
import { IDLE } from "@/lib/action-state";

/**
 * Shared purchase primitives. One grammar across the basket ledger, the
 * delivery folio and the order note: ruled rows, tabular figures, a single
 * oxide signal, and motion only on transform and opacity.
 */

export function QuantityStepper({
  lineId,
  quantity,
  name,
}: {
  lineId: string;
  quantity: number;
  name: string;
}) {
  const { t } = useLanguage();
  const [value, setValue] = useState(quantity);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function update(next: number) {
    if (pending) return;
    const clamped = Math.max(0, Math.min(999, next));
    setValue(clamped);

    const formData = new FormData();
    formData.set("lineId", lineId);
    formData.set("quantity", String(clamped));

    startTransition(async () => {
      const state = await updateLineItemAction(IDLE, formData);
      setError(state.status === "error" ? (state.message ?? null) : null);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="stepper">
        <button
          type="button"
          onClick={() => update(value - 1)}
          disabled={pending || value <= 0}
          aria-label={t("cart.decrease")}
          className="stepper__btn"
        >
          −
        </button>
        <span className="stepper__value" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          onClick={() => update(value + 1)}
          disabled={pending}
          aria-label={t("cart.increase")}
          className="stepper__btn"
        >
          +
        </button>
      </div>
      <span className="visually-hidden">
        {t("cart.quantity")}: {name}
      </span>
      {error && (
        <span className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export function CopyButton({
  value,
  label,
  className = "",
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked (insecure context or denied permission); the value
      // stays selectable on the page.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={`copy-btn ${className}`}
    >
      {copied ? t("checkout.copied") : label}
    </button>
  );
}

export function StatusPill({
  status,
  label,
}: {
  status: "pending" | "confirmed";
  label: string;
}) {
  return (
    <span className={`status-pill status-pill--${status}`}>
      <span className="status-pill__mark" aria-hidden="true" />
      {label}
    </span>
  );
}

export function SummaryRow({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="summary-row">
      <dt className="text-ink-2">{label}</dt>
      <dd className="summary-row__value">
        <span className="price text-base">{value}</span>
        {note && <span className="summary-row__note">{note}</span>}
      </dd>
    </div>
  );
}

export function FieldError({
  id,
  message,
}: {
  id: string;
  message: string;
}) {
  return (
    <p id={id} className="field-error" role="alert">
      {message}
    </p>
  );
}

export function FolioSection({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="folio-section">
      <h2 className="folio-section__title">
        <span className="numeral">{index}</span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/**
 * The empty basket: a shelf waiting to be filled. An original line drawing,
 * not a shopping-bag cliché, so it belongs to the House of Ingredients.
 */
export function EmptyShelf({
  title,
  body,
  help,
  action,
}: {
  title: string;
  body: string;
  help: string;
  action: ReactNode;
}) {
  return (
    <div className="empty-shelf">
      <div className="empty-shelf__art" aria-hidden="true">
        <svg
          viewBox="0 0 280 180"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* shelf */}
          <path d="M28 142h224" />
          <path d="M38 142v18M242 142v18" />
          {/* jar: tall */}
          <rect x="46" y="86" width="36" height="56" rx="2" />
          <path d="M50 86v-8h28v8" />
          <path d="M50 104h28" />
          {/* jar: small */}
          <rect x="96" y="104" width="28" height="38" rx="2" />
          <path d="M100 104v-6h20v6" />
          {/* jar: wide */}
          <rect x="138" y="80" width="42" height="62" rx="2" />
          <path d="M142 80v-8h34v8" />
          <path d="M142 100h34" />
          {/* hanging scoop */}
          <path d="M212 88c0 12-7 12-7 22a7 7 0 0 0 14 0c0-10-7-10-7-22Z" />
          <path d="M212 88V64" />
          {/* plant */}
          <path d="M248 142v-26" />
          <path d="M248 116c-9 0-14-7-14-14 9 0 14 7 14 14Z" />
          <path d="M248 126c9 0 14-7 14-14-9 0-14 7-14 14Z" />
        </svg>
      </div>
      <h2 className="empty-shelf__title">{title}</h2>
      <p className="lead empty-shelf__body">{body}</p>
      <p className="small">{help}</p>
      {action}
    </div>
  );
}

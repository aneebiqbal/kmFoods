"use client";

import Link from "next/link";
import { useRef, useState, useTransition, type FormEvent } from "react";
import { useLanguage } from "@/i18n/language-context";
import type { Locale } from "@kmfoods/shared";
import { money } from "@/lib/format";
import { submitCheckoutAction } from "@/lib/cart-actions";
import { IDLE, type ActionState } from "@/lib/action-state";
import {
  validateCheckout,
  type CheckoutValues,
  type DeliveryArea,
} from "@/lib/checkout-validation";
import {
  CopyButton,
  FieldError,
  FolioSection,
  StatusPill,
  SummaryRow,
} from "@/components/purchase";

type Item = {
  id: string;
  title: string;
  variantTitle: string;
  quantity: number;
  unitPrice: number;
};

type Values = CheckoutValues;

const EMPTY_VALUES: Values = {
  customer_name: "",
  customer_phone: "",
  delivery_city: "",
  delivery_area: "",
  delivery_address: "",
  delivery_notes: "",
  customer_email: "",
};

function Field({
  id,
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
  list,
  options,
  textarea = false,
  required = false,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  onBlur?: () => void;
  error?: string | undefined;
  type?: string;
  inputMode?: "tel" | "email" | "text";
  autoComplete?: string;
  placeholder?: string;
  list?: string;
  options?: Array<{ value: string; label: string }>;
  textarea?: boolean;
  required?: boolean;
}) {
  const invalid = Boolean(error);
  const describedBy = invalid ? `${id}-error` : undefined;
  const invalidProps = {
    "aria-invalid": invalid,
    "aria-describedby": describedBy,
  };

  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      {options ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
          onBlur={onBlur}
          className="field"
          {...invalidProps}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : textarea ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={2}
          autoComplete={autoComplete}
          className="field resize-none"
          {...invalidProps}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
          list={list}
          className="field"
          {...invalidProps}
        />
      )}

      {error && <FieldError id={`${id}-error`} message={error} />}
    </div>
  );
}

export function CheckoutForm({
  locale,
  areas,
  items,
  subtotal,
  feePkr,
}: {
  locale: Locale;
  areas: DeliveryArea[];
  items: Item[];
  subtotal: number;
  feePkr: number;
}) {
  const { t } = useLanguage();
  const [state, setState] = useState<ActionState>(IDLE);
  const [pending, startTransition] = useTransition();
  const [values, setValues] = useState<Values>(() => ({
    ...EMPTY_VALUES,
    delivery_city: areas.find((area) => area.serviceable)?.city ?? "",
  }));
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof Values, boolean>>
  >({});
  const formRef = useRef<HTMLFormElement>(null);

  const serviceableCities = [
    ...new Set(areas.filter((area) => area.serviceable).map((area) => area.city)),
  ];
  const cityAreas = areas.filter(
    (area) => area.city.toLowerCase() === values.delivery_city.toLowerCase()
  );
  const cityOptions = serviceableCities.map((city) => ({
    value: city,
    label: city,
  }));

  function handleChange(name: string, value: string) {
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name as keyof Values]) {
      setErrors(validateCheckout(next, areas, locale));
    }
  }

  function handleBlur(name: keyof Values) {
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors(validateCheckout(values, areas, locale));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const nextErrors = validateCheckout(values, areas, locale);
    setErrors(nextErrors);
    setTouched({
      customer_name: true,
      customer_phone: true,
      delivery_city: true,
      delivery_area: true,
      delivery_address: true,
      customer_email: true,
    });

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        ?.focus();
      return;
    }

    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      setState(await submitCheckoutAction(IDLE, formData));
    });
  }

  if (items.length === 0 && state.status !== "success") {
    return (
      <div className="well flex flex-col items-center gap-4 px-6 py-16 text-center">
        <h2 className="text-title">{t("cart.empty")}</h2>
        <Link href="/shop" className="btn btn-primary px-6 py-3 text-sm">
          {t("cart.emptyCta")}
        </Link>
      </div>
    );
  }

  if (state.status === "success" && state.reference) {
    return (
      <OrderNote
        reference={state.reference}
        whatsappUrl={state.whatsappUrl ?? null}
        whatsappConfigured={state.whatsappConfigured ?? false}
        orderNote={state.orderNote ?? null}
        items={state.items ?? items}
        subtotal={state.subtotal ?? subtotal}
        feePkr={feePkr}
        locale={locale}
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="folio">
        <FolioSection index="01" title={t("checkout.deliveryDetails")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="customer_name"
              name="customer_name"
              label={t("checkout.name")}
              value={values.customer_name}
              onChange={handleChange}
              onBlur={() => handleBlur("customer_name")}
              error={errors.customer_name}
              autoComplete="name"
              required
            />
            <Field
              id="customer_phone"
              name="customer_phone"
              label={t("checkout.phone")}
              value={values.customer_phone}
              onChange={handleChange}
              onBlur={() => handleBlur("customer_phone")}
              error={errors.customer_phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {cityOptions.length > 0 ? (
              <Field
                id="delivery_city"
                name="delivery_city"
                label={t("checkout.city")}
                value={values.delivery_city}
                onChange={handleChange}
                onBlur={() => handleBlur("delivery_city")}
                error={errors.delivery_city}
                options={cityOptions}
                required
              />
            ) : (
              <Field
                id="delivery_city"
                name="delivery_city"
                label={t("checkout.city")}
                value={values.delivery_city}
                onChange={handleChange}
                onBlur={() => handleBlur("delivery_city")}
                error={errors.delivery_city}
                required
              />
            )}
            <Field
              id="delivery_area"
              name="delivery_area"
              label={t("checkout.area")}
              value={values.delivery_area}
              onChange={handleChange}
              onBlur={() => handleBlur("delivery_area")}
              error={errors.delivery_area}
              list="city-areas"
              placeholder="DHA, Model Town..."
            />
          </div>

          <datalist id="city-areas">
            {cityAreas
              .filter((area) => area.area_name)
              .map((area) => (
                <option key={area.id} value={area.area_name} />
              ))}
          </datalist>

          <div className="mt-4">
            <Field
              id="delivery_address"
              name="delivery_address"
              label={t("checkout.address")}
              value={values.delivery_address}
              onChange={handleChange}
              onBlur={() => handleBlur("delivery_address")}
              error={errors.delivery_address}
              autoComplete="street-address"
              textarea
              required
            />
          </div>

          <div className="mt-4">
            <Field
              id="delivery_notes"
              name="delivery_notes"
              label={t("checkout.notes")}
              value={values.delivery_notes}
              onChange={handleChange}
              placeholder={t("checkout.notesPlaceholder")}
              textarea
            />
          </div>
        </FolioSection>

        <FolioSection index="02" title={t("checkout.contact")}>
          <Field
            id="customer_email"
            name="customer_email"
            label={t("checkout.email")}
            value={values.customer_email}
            onChange={handleChange}
            onBlur={() => handleBlur("customer_email")}
            error={errors.customer_email}
            type="email"
            inputMode="email"
            autoComplete="email"
          />
        </FolioSection>

        {state.status === "error" && (
          <p className="field-error mt-6" role="alert">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary mt-8 px-7 py-3.5 text-sm"
        >
          {pending ? t("checkout.placing") : t("checkout.placeOrder")}
        </button>
      </form>

      <aside className="well h-fit p-6 lg:sticky lg:top-28">
        <h2 className="text-title">{t("checkout.review")}</h2>
        <ul className="mt-5 space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-ink">{item.title}</p>
                <p className="small mt-0.5">
                  {item.variantTitle} × {item.quantity}
                </p>
              </div>
              <p className="price shrink-0 text-base">
                {money(item.unitPrice * item.quantity, locale)}
              </p>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-rule pt-4 text-sm">
          <SummaryRow
            label={t("checkout.subtotal")}
            value={money(subtotal, locale)}
          />
          <div className="summary-row">
            <dt className="text-ink-2">{t("checkout.delivery")}</dt>
            <dd className="summary-row__value">
              {feePkr > 0 ? (
                <span className="price text-base">{money(feePkr, locale)}</span>
              ) : (
                <span className="text-sm font-medium text-ink-2">
                  {t("checkout.deliveryConfirm")}
                </span>
              )}
            </dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-rule pt-3">
            <dt className="font-medium text-ink">{t("cart.total")}</dt>
            <dd className="price text-xl text-accent">
              {money(subtotal + feePkr, locale)}
            </dd>
          </div>
        </dl>
        <p className="small mt-3">{t("checkout.totalNote")}</p>
      </aside>
    </div>
  );
}

/**
 * The order note: the principal conversion moment. A composed, numbered note
 * with the reference, the items, the pending status and the WhatsApp action.
 */
function OrderNote({
  reference,
  whatsappUrl,
  whatsappConfigured,
  orderNote,
  items,
  subtotal,
  feePkr,
  locale,
}: {
  reference: string;
  whatsappUrl: string | null;
  whatsappConfigured: boolean;
  orderNote: string | null;
  items: Item[];
  subtotal: number;
  feePkr: number;
  locale: Locale;
}) {
  const { t } = useLanguage();

  return (
    <div className="well note">
      <header className="note__head">
        <p className="small">{t("checkout.orderNoteTitle")}</p>
        <h2 className="text-title mt-2">{t("checkout.successTitle")}</h2>
        <p className="lead mt-3">{t("checkout.orderNoteBody")}</p>
        <div className="mt-4">
          <StatusPill status="pending" label={t("order.pending")} />
        </div>
      </header>

      <div className="note__reference">
        <div className="note__reference-id">
          <p className="label">{t("order.reference")}</p>
          <p data-testid="order-reference" className="note__number">
            {reference}
          </p>
        </div>
        <CopyButton value={reference} label={t("checkout.copyReference")} />
      </div>

      <div className="note__body">
        <h3 className="label">{t("order.items")}</h3>
        <ul className="mt-3 divide-y divide-rule text-sm">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-3">
              <span className="min-w-0">
                <span className="font-medium text-ink">{item.title}</span>{" "}
                <span className="small">
                  {item.variantTitle} × {item.quantity}
                </span>
              </span>
              <span className="price shrink-0 text-base">
                {money(item.unitPrice * item.quantity, locale)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2 border-t border-rule pt-4 text-sm">
          <SummaryRow
            label={t("checkout.subtotal")}
            value={money(subtotal, locale)}
          />
          <div className="summary-row">
            <dt className="text-ink-2">{t("checkout.delivery")}</dt>
            <dd className="summary-row__value">
              {feePkr > 0 ? (
                <span className="price text-base">{money(feePkr, locale)}</span>
              ) : (
                <span className="text-sm font-medium text-ink-2">
                  {t("checkout.deliveryConfirm")}
                </span>
              )}
            </dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-rule pt-3">
            <dt className="font-medium text-ink">{t("cart.total")}</dt>
            <dd className="price text-xl text-accent">
              {money(subtotal + feePkr, locale)}
            </dd>
          </div>
        </dl>
        <p className="small mt-3">{t("checkout.totalNote")}</p>
      </div>

      <div className="note__actions">
        {whatsappConfigured && whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary px-7 py-3.5 text-sm"
          >
            {t("checkout.sendWhatsapp")}
          </a>
        ) : (
          <p className="field-error" role="alert">
            {t("checkout.whatsappNotConfigured")}
          </p>
        )}

        {orderNote && (
          <CopyButton
            value={orderNote}
            label={t("checkout.copyMessage")}
            className="note__copy"
          />
        )}

        {whatsappConfigured && whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-ink-2 underline underline-offset-2 transition-colors hover:text-accent"
          >
            {t("checkout.retry")}
          </a>
        )}

        <Link
          href={`/order/${reference}`}
          className="btn btn-ghost px-6 py-2.5 text-sm"
        >
          {t("checkout.viewStatus")}
        </Link>
      </div>

      <ol className="note__steps">
        <li className="note__step">
          <span className="numeral">01</span>
          <span>{t("checkout.step1")}</span>
        </li>
        <li className="note__step">
          <span className="numeral">02</span>
          <span>{t("checkout.step2")}</span>
        </li>
        <li className="note__step">
          <span className="numeral">03</span>
          <span>{t("checkout.step3")}</span>
        </li>
      </ol>
    </div>
  );
}

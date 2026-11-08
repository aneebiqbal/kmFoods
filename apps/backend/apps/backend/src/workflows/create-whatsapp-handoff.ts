import {
  createStep,
  createWorkflow,
  StepResponse,
  transform,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  addShippingMethodToCartWorkflow,
  completeCartWorkflow,
  createPaymentCollectionForCartWorkflow,
  createPaymentSessionsWorkflow,
  updateCartWorkflow,
  updateTaxLinesWorkflow,
} from "@medusajs/medusa/core-flows";
import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils";
import {
  buildWhatsAppMessage,
  normalizePakistaniPhone,
  quoteDelivery,
  type DeliveryArea,
  type WhatsAppOrderLine,
} from "@kmfoods/shared";
import type { DeliveryAreaModuleService } from "../modules/delivery-area";
import type { WhatsAppHandoffModuleService } from "../modules/whatsapp-handoff";

export type CreateWhatsAppHandoffInput = {
  cart_id: string;
  delivery_option_id: string;
  customer_name: string;
  customer_phone: string;
  delivery_city: string;
  delivery_area?: string | undefined;
  delivery_address: string;
  delivery_notes?: string | undefined;
  customer_email?: string | undefined;
};

type CartSnapshot = {
  id: string;
  total: number;
  currency_code: string;
  items: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    title: string | null;
    variant: { title: string | null } | null;
  }>;
};

const COUNTRY_CODE = "pk";
const PAYMENT_PROVIDER_ID = "pp_system_default";

/**
 * Retrieves the cart and validates everything the order depends on: it is not
 * empty, the delivery area is serviceable, and the phone number is a real
 * Pakistani mobile number. Prices come from Medusa, never from the client.
 */
const validateHandoffStep = createStep(
  "validate-handoff",
  async (input: CreateWhatsAppHandoffInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const { data: carts } = await query.graph({
      entity: "cart",
      fields: [
        "id",
        "total",
        "currency_code",
        "items.id",
        "items.quantity",
        "items.unit_price",
        "items.title",
        "items.variant.title",
      ],
      filters: { id: input.cart_id },
    });

    const cart = carts[0] as CartSnapshot | undefined;
    if (!cart) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Cart not found");
    }
    if (!cart.items?.length) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "Cart is empty");
    }

    const deliveryArea = container.resolve<DeliveryAreaModuleService>("deliveryArea");
    const areas = (await deliveryArea.listDeliveryAreas()) as DeliveryArea[];
    const quote = quoteDelivery(
      input.delivery_city,
      input.delivery_area ?? "",
      areas
    );
    if (!quote.serviceable) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "We do not deliver to this area yet."
      );
    }

    const phone = normalizePakistaniPhone(input.customer_phone);
    if (!phone) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Enter a valid Pakistani mobile number."
      );
    }

    if (!input.delivery_option_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No delivery option selected."
      );
    }

    return new StepResponse({ cart, phone });
  }
);

/** Returns an existing handoff for the cart, so a retry never doubles up. */
const findExistingHandoffStep = createStep(
  "find-existing-handoff",
  async (cartId: string, { container }) => {
    const handoffService =
      container.resolve<WhatsAppHandoffModuleService>("whatsappHandoff");
    const existing = await handoffService.listWhatsAppHandoffs({
      cart_id: cartId,
    });
    return new StepResponse(existing[0] ?? null);
  }
);

/**
 * Guest checkout: Medusa requires an email on the cart, so derive a stable
 * guest address when the customer did not provide one.
 */
const resolveGuestEmailStep = createStep(
  "resolve-guest-email",
  async (input: CreateWhatsAppHandoffInput) => {
    const email =
      input.customer_email && input.customer_email.includes("@")
        ? input.customer_email
        : `guest-${input.cart_id}@kmfoods.local`;
    return new StepResponse(email);
  }
);

/** Reuses the cart's payment collection, creating one only when absent. */
const ensurePaymentCollectionStep = createStep(
  "ensure-payment-collection",
  async (cartId: string, { container }) => {
    const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY);
    const fields = ["payment_collection_id"];

    const existing = (await remoteQuery(
      remoteQueryObjectFromString({
        entryPoint: "cart_payment_collection",
        variables: { filters: { cart_id: cartId } },
        fields,
      })
    )) as Array<{ payment_collection_id: string }>;

    if (existing.length) {
      return new StepResponse(existing[0].payment_collection_id);
    }

    await createPaymentCollectionForCartWorkflow(container).run({
      input: { cart_id: cartId },
    });

    const refreshed = (await remoteQuery(
      remoteQueryObjectFromString({
        entryPoint: "cart_payment_collection",
        variables: { filters: { cart_id: cartId } },
        fields,
      })
    )) as Array<{ payment_collection_id: string }>;

    if (!refreshed.length) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Payment collection could not be created for the cart."
      );
    }

    return new StepResponse(refreshed[0].payment_collection_id);
  }
);

type HandoffRecordInput = CreateWhatsAppHandoffInput & {
  orderId: string;
  phone: string;
  currencyCode: string;
};

/**
 * Snapshots the order into a handoff row and builds the WhatsApp message.
 * The order's display_id becomes the customer-facing reference (KM-000123).
 */
const createHandoffRecordStep = createStep(
  "create-handoff-record",
  async (data: HandoffRecordInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "total",
        "currency_code",
        "items.title",
        "items.quantity",
        "items.unit_price",
      ],
      filters: { id: data.orderId },
    });

    const order = orders[0];
    if (!order) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Order not found");
    }

    const reference = `KM-${String(order.display_id).padStart(6, "0")}`;
    const lines: WhatsAppOrderLine[] = (order.items ?? [])
      .filter((item) => item !== null)
      .map((item) => ({
        title: item.title ?? "Item",
        quantity: Number(item.quantity),
        unit_price_pkr: Number(item.unit_price),
      }));

    const message = buildWhatsAppMessage({
      reference,
      lines,
      subtotal_pkr: Number(order.total),
      customer_name: data.customer_name,
      customer_phone: data.phone,
      delivery_city: data.delivery_city,
      delivery_area: data.delivery_area ?? "",
      delivery_address: data.delivery_address,
      delivery_notes: data.delivery_notes ?? undefined,
    });

    const handoffService =
      container.resolve<WhatsAppHandoffModuleService>("whatsappHandoff");
    const created = await handoffService.createWhatsAppHandoffs({
      order_id: data.orderId,
      cart_id: data.cart_id,
      reference,
      status: "pending",
      message,
      customer_name: data.customer_name,
      customer_phone: data.phone,
      delivery_city: data.delivery_city,
      delivery_area: data.delivery_area || null,
      delivery_address: data.delivery_address,
      metadata: data.delivery_notes
        ? { delivery_notes: data.delivery_notes }
        : null,
    });

    return new StepResponse(created);
  },
  async (created, { container }) => {
    if (!created?.id) return;
    const handoffService =
      container.resolve<WhatsAppHandoffModuleService>("whatsappHandoff");
    await handoffService.deleteWhatsAppHandoffs([created.id]);
  }
);

/**
 * Creates the pending order and its WhatsApp handoff. The order is real (staff
 * see it in the admin) but its payment stays unauthorized: opening WhatsApp
 * neither places nor pays for the order.
 */
export const createWhatsappHandoffWorkflow = createWorkflow(
  "create-whatsapp-handoff",
  (input: CreateWhatsAppHandoffInput) => {
    const { cart, phone } = validateHandoffStep(input);
    const existing = findExistingHandoffStep(input.cart_id);

    const created = when(
      "skip-existing-handoff",
      { existing },
      ({ existing }) => !existing
    ).then(() => {
      const email = resolveGuestEmailStep(input);

      updateCartWorkflow.runAsStep({
        input: {
          id: input.cart_id,
          email,
          shipping_address: {
            first_name: input.customer_name,
            last_name: "",
            address_1: input.delivery_address,
            city: input.delivery_city,
            country_code: COUNTRY_CODE,
            postal_code: "",
          },
        },
      });

      addShippingMethodToCartWorkflow.runAsStep({
        input: {
          cart_id: input.cart_id,
          options: [{ id: input.delivery_option_id }],
        },
      });

      updateTaxLinesWorkflow.runAsStep({
        input: { cart_id: input.cart_id, force_tax_calculation: true },
      });

      const paymentCollectionId = ensurePaymentCollectionStep(input.cart_id);

      createPaymentSessionsWorkflow.runAsStep({
        input: {
          payment_collection_id: paymentCollectionId,
          provider_id: PAYMENT_PROVIDER_ID,
        },
      });

      const { id: orderId } = completeCartWorkflow.runAsStep({
        input: { id: input.cart_id },
      });

      return createHandoffRecordStep({
        cart_id: input.cart_id,
        delivery_option_id: input.delivery_option_id,
        customer_name: input.customer_name,
        customer_phone: input.customer_phone,
        delivery_city: input.delivery_city,
        delivery_area: input.delivery_area,
        delivery_address: input.delivery_address,
        delivery_notes: input.delivery_notes,
        customer_email: input.customer_email,
        orderId,
        phone,
        currencyCode: cart.currency_code,
      });
    });

    return new WorkflowResponse(
      transform(
        { existing, created },
        ({ existing, created }) => existing ?? created
      )
    );
  }
);

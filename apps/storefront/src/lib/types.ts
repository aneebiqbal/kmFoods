export type StoreVariant = {
  id: string;
  title: string;
  sku: string;
  price: number | null;
};

export type StoreProduct = {
  id: string;
  handle: string;
  title: string;
  titleUr: string | null;
  /** Printed catalogue number from the price list, when one exists. */
  srNo: number | null;
  description: string | null;
  category: string | null;
  thumbnail: string | null;
  status: string;
  variants: StoreVariant[];
  minPrice: number | null;
};

export type StoreCategory = {
  id: string;
  name: string;
  handle: string;
};

export type CartLine = {
  id: string;
  variantId: string;
  productId: string;
  title: string;
  titleUr: string | null;
  variantTitle: string;
  quantity: number;
  unitPrice: number;
  thumbnail: string | null;
  productHandle: string;
};

export type StoreCart = {
  id: string;
  items: CartLine[];
  subtotal: number;
  total: number;
  currencyCode: string;
  itemCount: number;
};

export type DeliveryConfig = {
  shipping_option_id: string | null;
  shipping_option_name: string | null;
  fee_pkr: number;
  areas: Array<{
    id: string;
    city: string;
    area_name: string;
    serviceable: boolean;
    fee_pkr: number;
  }>;
};

export type CheckoutResult = {
  handoff: {
    id: string;
    reference: string;
    status: string;
    order_id: string;
    message: string;
    customer_name: string;
    customer_phone: string;
    delivery_city: string;
    delivery_area: string | null;
    delivery_address: string;
  };
  whatsapp: {
    configured: boolean;
    number: string | null;
    url: string | null;
  };
};

export type OrderStatus = {
  reference: string;
  status: string;
  order_id: string;
  created_at: string;
  items: Array<{
    title: string | null;
    quantity: number;
    unit_price: number;
  }>;
  total: number | null;
  currency_code: string | null;
  payment_status: string | null;
};

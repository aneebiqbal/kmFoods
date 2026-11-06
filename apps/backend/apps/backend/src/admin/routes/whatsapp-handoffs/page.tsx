import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import {
  Badge,
  Button,
  Container,
  Heading,
  Input,
  Table,
  Text,
  Toast,
} from "@medusajs/ui";
import { useCallback, useEffect, useState } from "react";

/**
 * WhatsApp handoff management for KM Foods.
 *
 * A handoff is created when a customer asks to order over WhatsApp. It stays
 * `pending` until staff confirm the order here. Opening WhatsApp never
 * confirms anything, and this screen never invents an inbound message.
 */

type Handoff = {
  id: string;
  reference: string;
  order_id: string;
  status: "pending" | "confirmed";
  customer_name: string;
  customer_phone: string;
  delivery_city: string;
  delivery_area: string | null;
  delivery_address: string;
  message: string;
  created_at: string;
  items: Array<{ title: string | null; quantity: number; unit_price: number }>;
  total: number | null;
};

type Filter = "all" | "pending" | "confirmed";

function ageInHours(iso: string): string {
  const hours = Math.max(0, (Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (hours < 1) return `${Math.round(hours * 60)}m ago`;
  if (hours < 24) return `${Math.round(hours)}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export const config = defineRouteConfig({
  label: "WhatsApp Orders",
  icon: ChatBubbleLeftRight,
  nested: "/orders",
});

const WhatsAppHandoffsPage = () => {
  const [handoffs, setHandoffs] = useState<Handoff[]>([]);
  const [counts, setCounts] = useState({ pending: 0, confirmed: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const loadCounts = useCallback(async () => {
    try {
      const response = await fetch("/admin/whatsapp-handoffs");
      if (!response.ok) return;
      const body = (await response.json()) as { handoffs: Handoff[] };
      setCounts({
        pending: body.handoffs.filter((h) => h.status === "pending").length,
        confirmed: body.handoffs.filter((h) => h.status === "confirmed").length,
      });
    } catch {
      // Counts are a convenience; the table is the source of truth.
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      if (reference.trim()) params.set("reference", reference.trim());

      const response = await fetch(`/admin/whatsapp-handoffs?${params.toString()}`);
      if (!response.ok) throw new Error("Could not load WhatsApp orders.");
      const body = (await response.json()) as { handoffs: Handoff[] };
      setHandoffs(body.handoffs);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load WhatsApp orders.");
    } finally {
      setLoading(false);
    }
  }, [filter, reference]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  async function confirm(handoff: Handoff) {
    setBusy(handoff.id);
    setError(null);
    try {
      const response = await fetch(`/admin/whatsapp-handoffs/${handoff.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "confirmed" }),
      });
      if (!response.ok) throw new Error("Could not confirm this order.");
      await Promise.all([load(), loadCounts()]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not confirm this order.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <Heading level="h2">WhatsApp Orders</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Pending handoffs are orders a customer asked to place. Confirm them only after checking
            availability and the delivery charge on WhatsApp.
          </Text>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["pending", "confirmed", "all"] as Filter[]).map((value) => (
            <Button
              key={value}
              variant={filter === value ? "primary" : "secondary"}
              size="small"
              onClick={() => setFilter(value)}
            >
              {value === "all" ? "All" : value === "pending" ? `Pending (${counts.pending})` : `Confirmed (${counts.confirmed})`}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 px-6 pb-4">
        <Input
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          placeholder="Find by reference, e.g. KM-000001"
          className="max-w-xs"
        />
        <Button variant="secondary" size="small" onClick={load}>
          Search
        </Button>
      </div>

      {error && (
        <div className="px-6 pb-4">
          <Toast variant="error" title="Something went wrong">
            {error}
          </Toast>
        </div>
      )}

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Reference</Table.HeaderCell>
            <Table.HeaderCell>Customer</Table.HeaderCell>
            <Table.HeaderCell>Items</Table.HeaderCell>
            <Table.HeaderCell>Subtotal</Table.HeaderCell>
            <Table.HeaderCell>Delivery</Table.HeaderCell>
            <Table.HeaderCell>Age</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading && (
            <Table.Row>
              <Table.Cell colSpan={8}>Loading…</Table.Cell>
            </Table.Row>
          )}
          {!loading && handoffs.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={8}>No WhatsApp orders match this filter.</Table.Cell>
            </Table.Row>
          )}
          {!loading &&
            handoffs.map((handoff) => (
              <Table.Row key={handoff.id}>
                <Table.Cell>
                  <Text size="small" className="font-mono">
                    {handoff.reference}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="small" className="block font-medium">
                    {handoff.customer_name}
                  </Text>
                  <Text className="text-ui-fg-subtle" size="xsmall">
                    {handoff.customer_phone}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text className="text-ui-fg-subtle" size="xsmall">
                    {handoff.items.length} item{handoff.items.length === 1 ? "" : "s"}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="small">{handoff.total ?? "—"}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="small" className="block">
                    {handoff.delivery_city}
                  </Text>
                  <Text className="text-ui-fg-subtle" size="xsmall">
                    {handoff.delivery_area || "All areas"}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text className="text-ui-fg-subtle" size="xsmall">
                    {ageInHours(handoff.created_at)}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    color={handoff.status === "confirmed" ? "green" : "orange"}
                    size="2xsmall"
                  >
                    {handoff.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex justify-end gap-2">
                    <Button variant="transparent" size="small" asChild>
                      <a href={`/orders/${handoff.order_id}`}>Order</a>
                    </Button>
                    {handoff.status === "pending" && (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => confirm(handoff)}
                        disabled={busy === handoff.id}
                      >
                        {busy === handoff.id ? "Confirming…" : "Confirm"}
                      </Button>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </Container>
  );
}

export default WhatsAppHandoffsPage;

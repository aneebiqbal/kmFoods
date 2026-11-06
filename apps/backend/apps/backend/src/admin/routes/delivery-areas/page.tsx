import { defineRouteConfig } from "@medusajs/admin-sdk";
import { MapPin } from "@medusajs/icons";
import { Button, Container, Drawer, Heading, Input, Label, Switch, Table, Text, Toast } from "@medusajs/ui";
import { useCallback, useEffect, useState } from "react";

/**
 * Delivery-area management for KM Foods.
 *
 * Reads and writes through the authenticated admin API routes added by this
 * app, so the same server-side validation and authorization apply.
 */

type Area = {
  id: string;
  city: string;
  area_name: string;
  serviceable: boolean;
  fee_pkr: number;
};

type Draft = {
  id?: string;
  city: string;
  area_name: string;
  serviceable: boolean;
  fee_pkr: string;
};

const EMPTY_DRAFT: Draft = {
  city: "",
  area_name: "",
  serviceable: true,
  fee_pkr: "0",
};

export const config = defineRouteConfig({
  label: "Delivery Areas",
  icon: MapPin,
});

const DeliveryAreasPage = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/admin/delivery-areas");
      if (!response.ok) throw new Error("Could not load delivery areas.");
      const body = (await response.json()) as { areas: Area[] };
      setAreas(body.areas);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load delivery areas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setDraft({ ...EMPTY_DRAFT });
    setError(null);
  }

  function openEdit(area: Area) {
    setDraft({
      id: area.id,
      city: area.city,
      area_name: area.area_name,
      serviceable: area.serviceable,
      fee_pkr: String(area.fee_pkr),
    });
    setError(null);
  }

  async function save() {
    if (!draft) return;

    if (!draft.city.trim()) {
      setError("City is required.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        city: draft.city.trim(),
        area_name: draft.area_name.trim(),
        serviceable: draft.serviceable,
        fee_pkr: Number(draft.fee_pkr || 0),
      };

      const response = draft.id
        ? await fetch(`/admin/delivery-areas/${draft.id}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/admin/delivery-areas", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(body?.message ?? "Could not save the delivery area.");
      }

      setDraft(null);
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save the delivery area.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(area: Area) {
    setError(null);
    try {
      const response = await fetch(`/admin/delivery-areas/${area.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete the delivery area.");
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete the delivery area.");
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between p-6">
        <div>
          <Heading level="h2">Delivery Areas</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Cities and localities KM Foods serves. Fees default to 0 until the owner confirms them.
          </Text>
        </div>
        <Button variant="secondary" size="small" onClick={openCreate}>
          Add area
        </Button>
      </div>

      {error && (
        <div className="px-6 pt-4">
          <Toast variant="error" title="Something went wrong">
            {error}
          </Toast>
        </div>
      )}

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>City</Table.HeaderCell>
            <Table.HeaderCell>Area</Table.HeaderCell>
            <Table.HeaderCell>Serviceable</Table.HeaderCell>
            <Table.HeaderCell>Fee (PKR)</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading && (
            <Table.Row>
              <Table.Cell colSpan={5}>Loading…</Table.Cell>
            </Table.Row>
          )}
          {!loading && areas.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={5}>No delivery areas configured.</Table.Cell>
            </Table.Row>
          )}
          {!loading &&
            areas.map((area) => (
              <Table.Row key={area.id}>
                <Table.Cell>{area.city}</Table.Cell>
                <Table.Cell>{area.area_name || "All areas"}</Table.Cell>
                <Table.Cell>{area.serviceable ? "Yes" : "No"}</Table.Cell>
                <Table.Cell>{area.fee_pkr}</Table.Cell>
                <Table.Cell>
                  <div className="flex justify-end gap-2">
                    <Button variant="transparent" size="small" onClick={() => openEdit(area)}>
                      Edit
                    </Button>
                    <Button variant="dangerTransparent" size="small" onClick={() => remove(area)}>
                      Delete
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>

      <Drawer open={Boolean(draft)} onOpenChange={(open) => !open && setDraft(null)}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>{draft?.id ? "Edit delivery area" : "Add delivery area"}</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={draft?.city ?? ""}
                  onChange={(event) =>
                    setDraft((current) => current && { ...current, city: event.target.value })
                  }
                  placeholder="Lahore"
                />
              </div>
              <div>
                <Label htmlFor="area">Area / locality</Label>
                <Input
                  id="area"
                  value={draft?.area_name ?? ""}
                  onChange={(event) =>
                    setDraft((current) => current && { ...current, area_name: event.target.value })
                  }
                  placeholder="Leave empty to cover the whole city"
                />
                <Text className="text-ui-fg-subtle" size="xsmall">
                  An empty area matches any locality in the city.
                </Text>
              </div>
              <div>
                <Label htmlFor="fee">Delivery fee (PKR)</Label>
                <Input
                  id="fee"
                  type="number"
                  min={0}
                  value={draft?.fee_pkr ?? "0"}
                  onChange={(event) =>
                    setDraft((current) => current && { ...current, fee_pkr: event.target.value })
                  }
                />
                <Text className="text-ui-fg-subtle" size="xsmall">
                  0 means the charge is confirmed with the customer on WhatsApp.
                </Text>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="serviceable">Serviceable</Label>
                <Switch
                  id="serviceable"
                  checked={draft?.serviceable ?? true}
                  onCheckedChange={(checked) =>
                    setDraft((current) => current && { ...current, serviceable: checked })
                  }
                />
              </div>
              {error && <Text className="text-ui-fg-error">{error}</Text>}
            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close asChild>
              <Button variant="secondary" size="small">
                Cancel
              </Button>
            </Drawer.Close>
            <Button variant="primary" size="small" onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </Container>
  );
}

export default DeliveryAreasPage;

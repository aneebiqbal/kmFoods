import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  MedusaError,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";
import { CATEGORIES, CATEGORY_LABELS } from "@kmfoods/shared";

/**
 * Initial store configuration for KM Foods: Pakistan region, PKR currency,
 * Lahore delivery and the catalog's product categories.
 *
 * This runs once, on `medusa db:migrate`. It is idempotent so a re-run (for
 * example after restoring a database) does not create duplicates.
 */
export default async function initial_data_seed({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );

  logger.info("Seeding KM Foods store data...");

  // ---- Sales channel -------------------------------------------------------
  const { data: existingChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  });

  let salesChannel: { id: string } | undefined = existingChannels.find(
    (channel) => channel.name === "Pakistan Store"
  );

  if (!salesChannel) {
    const {
      result: [created],
    } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [
          {
            name: "Pakistan Store",
            description: "KM Foods online store",
          },
        ],
      },
    });
    salesChannel = created as unknown as { id: string };
  }

  if (!salesChannel) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "The Pakistan Store sales channel could not be created."
    );
  }

  // ---- Publishable API key -------------------------------------------------
  const { data: existingKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "title", "type"],
    filters: { type: "publishable", title: "Storefront" },
  });

  if (!existingKeys.length) {
    const {
      result: [publishableApiKey],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Storefront",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });

    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: publishableApiKey.id,
        add: [salesChannel.id],
      },
    });
  }

  // ---- Store with PKR ------------------------------------------------------
  const { data: existingStores } = await query.graph({
    entity: "store",
    fields: ["id", "supported_currencies.currency_code"],
  });

  const hasPkr = existingStores.some((store) =>
    (store.supported_currencies ?? []).some(
      (currency) => currency?.currency_code === "pkr"
    )
  );

  if (!hasPkr) {
    await createStoresWorkflow(container).run({
      input: {
        stores: [
          {
            name: "KM Foods",
            supported_currencies: [{ currency_code: "pkr", is_default: true }],
            default_sales_channel_id: salesChannel.id,
          },
        ],
      },
    });
  }

  // ---- Region --------------------------------------------------------------
  const { data: existingRegions } = await query.graph({
    entity: "region",
    fields: ["id", "currency_code"],
  });

  let region: { id: string } | undefined = existingRegions.find(
    (r) => r.currency_code === "pkr"
  );

  if (!region) {
    const {
      result: [created],
    } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Pakistan",
            currency_code: "pkr",
            countries: ["pk"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    region = created as unknown as { id: string };
  }

  if (!region) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "The Pakistan region could not be created."
    );
  }

  // ---- Tax region (0% until the owner confirms the applicable rate) -------
  await createTaxRegionsWorkflow(container).run({
    input: [{ country_code: "pk", provider_id: "tp_system" }],
  });

  // ---- Stock location ------------------------------------------------------
  const { data: existingLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  });

  let stockLocation: { id: string } | undefined = existingLocations.find(
    (location) => location.name === "Lahore Warehouse"
  );

  if (!stockLocation) {
    const {
      result: [created],
    } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Lahore Warehouse",
            address: { city: "Lahore", country_code: "PK", address_1: "" },
          },
        ],
      },
    });
    stockLocation = created as unknown as { id: string };

    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
    });
  }

  if (!stockLocation) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "The Lahore Warehouse stock location could not be created."
    );
  }

  // ---- Fulfilment ----------------------------------------------------------
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id", "name"],
  });

  let shippingProfile: { id: string } | undefined = shippingProfiles[0];

  if (!shippingProfile) {
    const {
      result: [created],
    } = await createShippingProfilesWorkflow(container).run({
      input: {
        data: [
          {
            name: "KM Foods",
            type: "default",
          },
        ],
      },
    });
    shippingProfile = created as unknown as { id: string };
  }

  const { data: existingSets } = await query.graph({
    entity: "fulfillment_set",
    fields: ["id", "name"],
  });

  let fulfillmentSet:
    | { id: string; service_zones: Array<{ id: string }> }
    | undefined = existingSets.find((set) => set.name === "Lahore Delivery");

  if (!fulfillmentSet) {
    fulfillmentSet = (await fulfillmentModuleService.createFulfillmentSets({
      name: "Lahore Delivery",
      type: "shipping",
      service_zones: [
        {
          name: "Pakistan",
          geo_zones: [{ country_code: "pk", type: "country" }],
        },
      ],
    })) as unknown as { id: string; service_zones: Array<{ id: string }> };

    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
    });
  }

  if (!fulfillmentSet) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "The Lahore Delivery fulfilment set could not be created."
    );
  }

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: stockLocation.id, add: [salesChannel.id] },
  });

  // ---- Shipping option -----------------------------------------------------
  const { data: existingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name"],
    filters: { name: "Lahore Delivery" },
  });

  if (!existingOptions.length) {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Lahore Delivery",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Delivery charges are confirmed on WhatsApp.",
            code: "lahore_standard",
          },
          // 0 until the owner confirms the delivery fee. The WhatsApp handoff
          // asks staff to confirm charges before the order is final.
          prices: [{ region_id: region.id, amount: 0 }],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    });
  }

  // ---- Product categories --------------------------------------------------
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  });

  const missingCategories = CATEGORIES.filter(
    (slug) =>
      !existingCategories.some(
        (category) => category.handle === slug || category.name === slug
      )
  );

  if (missingCategories.length) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategories.map((slug) => ({
          name: CATEGORY_LABELS[slug].en,
          handle: slug,
          is_active: true,
        })),
      },
    });
  }

  // ---- Shared pack-size option --------------------------------------------
  const { data: existingOptionsList } = await query.graph({
    entity: "product_option",
    fields: ["id", "title", "is_exclusive"],
  });

  const hasPackSize = existingOptionsList.some(
    (option) => option.title === "Pack Size"
  );

  if (!hasPackSize) {
    await createProductOptionsWorkflow(container).run({
      input: {
        product_options: [
          {
            title: "Pack Size",
            values: ["100g", "1kg"],
          },
        ],
      },
    });
  }

  logger.info("Finished seeding KM Foods store data.");
  logger.info(
    "Next: npm run import:catalog to load the product catalogue from the price list."
  );

  // Referenced so the import is not flagged as unused in strict configs.
  void ProductStatus;
}

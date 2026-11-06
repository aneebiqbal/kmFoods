import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261105140213 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "whatsapp_handoff" drop constraint if exists "whatsapp_handoff_reference_unique";`);
    this.addSql(`alter table if exists "whatsapp_handoff" drop constraint if exists "whatsapp_handoff_cart_id_unique";`);
    this.addSql(`alter table if exists "whatsapp_handoff" drop constraint if exists "whatsapp_handoff_order_id_unique";`);
    this.addSql(`create table if not exists "whatsapp_handoff" ("id" text not null, "order_id" text not null, "cart_id" text not null, "reference" text not null, "status" text check ("status" in ('pending', 'confirmed')) not null default 'pending', "message" text not null, "customer_name" text not null, "customer_phone" text not null, "delivery_city" text not null, "delivery_area" text null, "delivery_address" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "whatsapp_handoff_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_whatsapp_handoff_order_id_unique" ON "whatsapp_handoff" ("order_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_whatsapp_handoff_cart_id_unique" ON "whatsapp_handoff" ("cart_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_whatsapp_handoff_reference_unique" ON "whatsapp_handoff" ("reference") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_whatsapp_handoff_deleted_at" ON "whatsapp_handoff" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "whatsapp_handoff" cascade;`);
  }

}

import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261105140212 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "delivery_area" ("id" text not null, "city" text not null, "area_name" text not null, "serviceable" boolean not null default true, "fee_pkr" integer not null default 0, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "delivery_area_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_delivery_area_deleted_at" ON "delivery_area" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "delivery_area" cascade;`);
  }

}

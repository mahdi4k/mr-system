import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const productTypes = [
  "cpu",
  "motherboard",
  "graphic",
  "power",
  "fan",
  "ram",
  "ssd",
  "case",
] as const;

export type ProductType = (typeof productTypes)[number];

export interface ProductCompatibility {
  cpus?: number[];
  motherboards?: number[];
  graphics?: number[];
  powers?: number[];
  fans?: number[];
  rams?: number[];
}

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    legacyId: integer("legacy_id").notNull(),
    slug: text("slug").notNull().unique(),
    type: text("type").$type<ProductType>().notNull(),
    name: text("name").notNull(),
    brand: text("brand").notNull(),
    aliases: jsonb("aliases").$type<string[]>().notNull().default([]),
    specifications: jsonb("specifications")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    compatibility: jsonb("compatibility")
      .$type<ProductCompatibility>()
      .notNull()
      .default({}),
    image: text("image").notNull(),
    price: integer("price"),
    links: jsonb("links").$type<string[]>().notNull().default([]),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    typeLegacyId: uniqueIndex("products_type_legacy_id_unique").on(
      table.type,
      table.legacyId,
    ),
  }),
);

export const productOffers = pgTable(
  "product_offers",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    source: text("source").notNull(),
    externalId: text("external_id").notNull(),
    title: text("title").notNull(),
    price: integer("price"),
    image: text("image"),
    url: text("url").notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    sourceExternalId: uniqueIndex("offers_source_external_id_unique").on(
      table.source,
      table.externalId,
    ),
  }),
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

import {
  mysqlTable,
  int,
  varchar,
  text,
  longtext,
  datetime,
  double,
  json,
  mysqlEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const news = mysqlTable("news", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  date: datetime("date").notNull(),
  excerpt: text("excerpt"),
  body: longtext("body").notNull(),
  imageKey: varchar("image_key", { length: 100 }),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: datetime("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date())
    .notNull(),
});

export const leads = mysqlTable(
  "leads",
  {
    id: int("id").autoincrement().primaryKey(),
    type: mysqlEnum("type", ["contact", "gate"]).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    phone: varchar("phone", { length: 30 }),
    company: varchar("company", { length: 150 }),
    service: varchar("service", { length: 150 }),
    aircraft: varchar("aircraft", { length: 150 }),
    flights: json("flights"),
    notes: text("notes"),
    fileName: varchar("file_name", { length: 255 }),
    createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    typeIdx: index("leads_type_idx").on(table.type),
    createdAtIdx: index("leads_created_at_idx").on(table.createdAt),
  })
);

export const images = mysqlTable(
  "images",
  {
    id: int("id").autoincrement().primaryKey(),
    category: varchar("category", { length: 50 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }),
    alt: varchar("alt", { length: 255 }),
    width: int("width"),
    height: int("height"),
    size: int("size"),
    uploadedAt: datetime("uploaded_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    categorySlugIdx: uniqueIndex("images_category_slug_idx").on(table.category, table.slug),
  })
);

export const permitDownloads = mysqlTable("permit_downloads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  fileType: varchar("file_type", { length: 20 }).notNull(),
  icon: mysqlEnum("icon", ["check", "star", "send", "shield", "plane", "document"])
    .default("document")
    .notNull(),
  size: int("size"),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const adminUsers = mysqlTable("admin_users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["admin", "editor"]).default("editor").notNull(),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const mapCategories = mysqlTable("map_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  short: varchar("short", { length: 50 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: datetime("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date())
    .notNull(),
});

export const airports = mysqlTable(
  "airports",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    lat: double("lat").notNull(),
    lng: double("lng").notNull(),
    categoryId: int("category_id")
      .notNull()
      .references(() => mapCategories.id, { onDelete: "restrict" }),
    info: text("info"),
    pdfUrl: varchar("pdf_url", { length: 500 }),
    createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: datetime("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    categoryIdx: index("airports_category_idx").on(table.categoryId),
  })
);

export type NewsRow = typeof news.$inferSelect;
export type NewNewsRow = typeof news.$inferInsert;
export type LeadRow = typeof leads.$inferSelect;
export type NewLeadRow = typeof leads.$inferInsert;
export type ImageRow = typeof images.$inferSelect;
export type NewImageRow = typeof images.$inferInsert;
export type AdminUserRow = typeof adminUsers.$inferSelect;
export type PermitDownloadRow = typeof permitDownloads.$inferSelect;
export type NewPermitDownloadRow = typeof permitDownloads.$inferInsert;
export type MapCategoryRow = typeof mapCategories.$inferSelect;
export type NewMapCategoryRow = typeof mapCategories.$inferInsert;
export type AirportRow = typeof airports.$inferSelect;
export type NewAirportRow = typeof airports.$inferInsert;

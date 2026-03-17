import { pgTable, serial, text, decimal, boolean, integer, real, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const accommodationTypeEnum = pgEnum("accommodation_type", [
  "hotel", "apartment", "hostel", "guesthouse", "lodge", "villa", "other"
]);

export const accommodationsTable = pgTable("accommodations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: accommodationTypeEnum("type").notNull(),
  description: text("description").notNull(),
  province: text("province").notNull(),
  district: text("district").notNull(),
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("RWF"),
  mainImage: text("main_image").notNull(),
  images: text("images").array().notNull().default([]),
  amenities: text("amenities").array().notNull().default([]),
  maxGuests: integer("max_guests").notNull().default(2),
  bedrooms: integer("bedrooms").notNull().default(1),
  bathrooms: integer("bathrooms").notNull().default(1),
  averageRating: real("average_rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAccommodationSchema = createInsertSchema(accommodationsTable).omit({ id: true, createdAt: true });
export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;
export type Accommodation = typeof accommodationsTable.$inferSelect;

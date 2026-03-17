import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { accommodationsTable } from "./accommodations";

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  accommodationId: integer("accommodation_id").notNull().references(() => accommodationsTable.id),
  guestName: text("guest_name").notNull(),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  comment: text("comment").notNull(),
  stayDate: text("stay_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviewsTable).omit({ id: true, createdAt: true });
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviewsTable.$inferSelect;

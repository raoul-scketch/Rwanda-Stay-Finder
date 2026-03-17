import { pgTable, serial, text, decimal, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { accommodationsTable } from "./accommodations";

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending", "confirmed", "cancelled", "completed"
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "credit_card", "mobile_money", "airtel_money"
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending", "paid", "refunded"
]);

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  accommodationId: integer("accommodation_id").notNull().references(() => accommodationsTable.id),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone").notNull(),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out").notNull(),
  guests: integer("guests").notNull().default(1),
  nights: integer("nights").notNull().default(1),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("RWF"),
  status: bookingStatusEnum("status").notNull().default("pending"),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
  confirmationCode: text("confirmation_code").notNull(),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;

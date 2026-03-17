import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bookingsTable, accommodationsTable } from "@workspace/db/schema";
import { eq, ilike } from "drizzle-orm";
import {
  ListBookingsQueryParams,
  CreateBookingBody,
  GetBookingParams,
  UpdateBookingParams,
  UpdateBookingBody,
  ProcessPaymentParams,
  ProcessPaymentBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateConfirmationCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "RW";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffMs = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

function formatBooking(
  b: typeof bookingsTable.$inferSelect,
  accommodation?: { name: string; mainImage: string }
) {
  return {
    id: b.id,
    accommodationId: b.accommodationId,
    accommodationName: accommodation?.name ?? "",
    accommodationImage: accommodation?.mainImage ?? "",
    guestName: b.guestName,
    guestEmail: b.guestEmail,
    guestPhone: b.guestPhone,
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    guests: b.guests,
    nights: b.nights,
    pricePerNight: Number(b.pricePerNight),
    totalPrice: Number(b.totalPrice),
    currency: b.currency,
    status: b.status,
    paymentMethod: b.paymentMethod,
    paymentStatus: b.paymentStatus,
    confirmationCode: b.confirmationCode,
    specialRequests: b.specialRequests ?? undefined,
    createdAt: b.createdAt.toISOString(),
  };
}

router.get("/", async (req, res) => {
  const query = ListBookingsQueryParams.parse(req.query);

  let bookings = await db.select().from(bookingsTable).orderBy(bookingsTable.createdAt);

  if (query.guestEmail) {
    bookings = bookings.filter((b) =>
      b.guestEmail.toLowerCase().includes(query.guestEmail!.toLowerCase())
    );
  }
  if (query.status) {
    bookings = bookings.filter((b) => b.status === query.status);
  }

  const accommodationIds = [...new Set(bookings.map((b) => b.accommodationId))];
  const accommodations =
    accommodationIds.length > 0
      ? await db
          .select({ id: accommodationsTable.id, name: accommodationsTable.name, mainImage: accommodationsTable.mainImage })
          .from(accommodationsTable)
      : [];
  const accMap = new Map(accommodations.map((a) => [a.id, a]));

  res.json({
    bookings: bookings.map((b) => formatBooking(b, accMap.get(b.accommodationId))),
    total: bookings.length,
  });
});

router.post("/", async (req, res) => {
  const body = CreateBookingBody.parse(req.body);

  const accommodation = await db
    .select()
    .from(accommodationsTable)
    .where(eq(accommodationsTable.id, body.accommodationId))
    .limit(1);

  if (!accommodation[0]) {
    res.status(404).json({ error: "not_found", message: "Accommodation not found" });
    return;
  }

  const acc = accommodation[0];
  const nights = calculateNights(body.checkIn, body.checkOut);
  const pricePerNight = Number(acc.pricePerNight);
  const totalPrice = pricePerNight * nights;

  if (body.guests > acc.maxGuests) {
    res.status(400).json({
      error: "too_many_guests",
      message: `This property allows a maximum of ${acc.maxGuests} guests`,
    });
    return;
  }

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      accommodationId: body.accommodationId,
      guestName: body.guestName,
      guestEmail: body.guestEmail,
      guestPhone: body.guestPhone,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      guests: body.guests,
      nights,
      pricePerNight: String(pricePerNight),
      totalPrice: String(totalPrice),
      currency: acc.currency,
      status: "pending",
      paymentMethod: body.paymentMethod as any,
      paymentStatus: "pending",
      confirmationCode: generateConfirmationCode(),
      specialRequests: body.specialRequests,
    })
    .returning();

  res.status(201).json(formatBooking(booking, { name: acc.name, mainImage: acc.mainImage }));
});

router.get("/:id", async (req, res) => {
  const { id } = GetBookingParams.parse({ id: Number(req.params.id) });

  const booking = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.id, id))
    .limit(1);

  if (!booking[0]) {
    res.status(404).json({ error: "not_found", message: "Booking not found" });
    return;
  }

  const accommodation = await db
    .select({ name: accommodationsTable.name, mainImage: accommodationsTable.mainImage })
    .from(accommodationsTable)
    .where(eq(accommodationsTable.id, booking[0].accommodationId))
    .limit(1);

  res.json(formatBooking(booking[0], accommodation[0]));
});

router.patch("/:id", async (req, res) => {
  const { id } = UpdateBookingParams.parse({ id: Number(req.params.id) });
  const body = UpdateBookingBody.parse(req.body);

  const existing = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.id, id))
    .limit(1);

  if (!existing[0]) {
    res.status(404).json({ error: "not_found", message: "Booking not found" });
    return;
  }

  const updates: Partial<typeof bookingsTable.$inferInsert> = {};
  if (body.status) updates.status = body.status as any;
  if (body.specialRequests !== undefined) updates.specialRequests = body.specialRequests;

  const [updated] = await db
    .update(bookingsTable)
    .set(updates)
    .where(eq(bookingsTable.id, id))
    .returning();

  const accommodation = await db
    .select({ name: accommodationsTable.name, mainImage: accommodationsTable.mainImage })
    .from(accommodationsTable)
    .where(eq(accommodationsTable.id, updated.accommodationId))
    .limit(1);

  res.json(formatBooking(updated, accommodation[0]));
});

router.post("/:id/payment", async (req, res) => {
  const { id } = ProcessPaymentParams.parse({ id: Number(req.params.id) });
  const body = ProcessPaymentBody.parse(req.body);

  const booking = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.id, id))
    .limit(1);

  if (!booking[0]) {
    res.status(404).json({ error: "not_found", message: "Booking not found" });
    return;
  }

  if (booking[0].paymentStatus === "paid") {
    res.status(400).json({ error: "already_paid", message: "Booking is already paid" });
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, 800));

  const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const [updated] = await db
    .update(bookingsTable)
    .set({ paymentStatus: "paid", status: "confirmed" })
    .where(eq(bookingsTable.id, id))
    .returning();

  const accommodation = await db
    .select({ name: accommodationsTable.name, mainImage: accommodationsTable.mainImage })
    .from(accommodationsTable)
    .where(eq(accommodationsTable.id, updated.accommodationId))
    .limit(1);

  res.json({
    success: true,
    transactionId,
    message: "Payment processed successfully",
    booking: formatBooking(updated, accommodation[0]),
  });
});

export default router;

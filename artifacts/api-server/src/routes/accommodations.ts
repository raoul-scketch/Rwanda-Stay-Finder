import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { accommodationsTable, reviewsTable } from "@workspace/db/schema";
import { eq, and, gte, lte, ilike, inArray, sql } from "drizzle-orm";
import {
  ListAccommodationsQueryParams,
  GetAccommodationParams,
  GetAccommodationReviewsParams,
  GetAccommodationReviewsQueryParams,
  CreateReviewParams,
  CreateReviewBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  const query = ListAccommodationsQueryParams.parse(req.query);
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const offset = (page - 1) * limit;

  const conditions: ReturnType<typeof eq>[] = [];

  if (query.type) {
    conditions.push(eq(accommodationsTable.type, query.type as any));
  }
  if (query.province) {
    conditions.push(ilike(accommodationsTable.province, `%${query.province}%`));
  }
  if (query.district) {
    conditions.push(ilike(accommodationsTable.district, `%${query.district}%`));
  }
  if (query.minPrice !== undefined) {
    conditions.push(gte(accommodationsTable.pricePerNight, String(query.minPrice)));
  }
  if (query.maxPrice !== undefined) {
    conditions.push(lte(accommodationsTable.pricePerNight, String(query.maxPrice)));
  }
  if (query.minRating !== undefined) {
    conditions.push(gte(accommodationsTable.averageRating, query.minRating));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [accommodations, totalResult] = await Promise.all([
    db
      .select()
      .from(accommodationsTable)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(accommodationsTable.featured, accommodationsTable.averageRating),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(accommodationsTable)
      .where(whereClause),
  ]);

  const total = totalResult[0]?.count ?? 0;

  res.json({
    accommodations: accommodations.map(formatAccommodation),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

router.get("/:id", async (req, res) => {
  const { id } = GetAccommodationParams.parse({ id: Number(req.params.id) });

  const accommodation = await db
    .select()
    .from(accommodationsTable)
    .where(eq(accommodationsTable.id, id))
    .limit(1);

  if (!accommodation[0]) {
    res.status(404).json({ error: "not_found", message: "Accommodation not found" });
    return;
  }

  const recentReviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.accommodationId, id))
    .limit(5)
    .orderBy(sql`${reviewsTable.createdAt} desc`);

  res.json({
    ...formatAccommodation(accommodation[0]),
    recentReviews: recentReviews.map(formatReview),
  });
});

router.get("/:id/reviews", async (req, res) => {
  const { id } = GetAccommodationReviewsParams.parse({ id: Number(req.params.id) });
  const query = GetAccommodationReviewsQueryParams.parse(req.query);
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const offset = (page - 1) * limit;

  const [reviews, totalResult] = await Promise.all([
    db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.accommodationId, id))
      .limit(limit)
      .offset(offset)
      .orderBy(sql`${reviewsTable.createdAt} desc`),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(reviewsTable)
      .where(eq(reviewsTable.accommodationId, id)),
  ]);

  const total = totalResult[0]?.count ?? 0;

  res.json({
    reviews: reviews.map(formatReview),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

router.post("/:id/reviews", async (req, res) => {
  const { id } = CreateReviewParams.parse({ id: Number(req.params.id) });
  const body = CreateReviewBody.parse(req.body);

  const accommodation = await db
    .select()
    .from(accommodationsTable)
    .where(eq(accommodationsTable.id, id))
    .limit(1);

  if (!accommodation[0]) {
    res.status(404).json({ error: "not_found", message: "Accommodation not found" });
    return;
  }

  const [review] = await db
    .insert(reviewsTable)
    .values({
      accommodationId: id,
      guestName: body.guestName,
      rating: body.rating,
      title: body.title,
      comment: body.comment,
      stayDate: body.stayDate,
    })
    .returning();

  const allReviews = await db
    .select({ rating: reviewsTable.rating })
    .from(reviewsTable)
    .where(eq(reviewsTable.accommodationId, id));

  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await db
    .update(accommodationsTable)
    .set({
      averageRating: avgRating,
      reviewCount: allReviews.length,
    })
    .where(eq(accommodationsTable.id, id));

  res.status(201).json(formatReview(review));
});

function formatAccommodation(a: typeof accommodationsTable.$inferSelect) {
  return {
    id: a.id,
    name: a.name,
    type: a.type,
    description: a.description,
    province: a.province,
    district: a.district,
    address: a.address,
    latitude: a.latitude,
    longitude: a.longitude,
    pricePerNight: Number(a.pricePerNight),
    currency: a.currency,
    mainImage: a.mainImage,
    images: a.images ?? [],
    amenities: a.amenities ?? [],
    maxGuests: a.maxGuests,
    bedrooms: a.bedrooms,
    bathrooms: a.bathrooms,
    averageRating: a.averageRating,
    reviewCount: a.reviewCount,
    featured: a.featured,
    createdAt: a.createdAt.toISOString(),
  };
}

function formatReview(r: typeof reviewsTable.$inferSelect) {
  return {
    id: r.id,
    accommodationId: r.accommodationId,
    guestName: r.guestName,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    stayDate: r.stayDate,
    createdAt: r.createdAt.toISOString(),
  };
}

export default router;

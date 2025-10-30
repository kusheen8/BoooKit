import { z } from "zod";

// Experience Schema
export const experienceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  category: z.string(),
  availableDates: z.array(z.string()), // ISO date strings
  timeSlots: z.array(z.object({
    time: z.string(),
    available: z.boolean(),
    capacity: z.number().optional(),
  })),
  minAge: z.number().optional(),
  duration: z.string().optional(),
});

export type Experience = z.infer<typeof experienceSchema>;

export const insertExperienceSchema = experienceSchema.omit({ id: true });
export type InsertExperience = z.infer<typeof insertExperienceSchema>;

// Booking Schema
export const bookingSchema = z.object({
  id: z.string(),
  experienceId: z.string(),
  experienceName: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  date: z.string(),
  time: z.string(),
  quantity: z.number().min(1),
  promoCode: z.string().optional(),
  subtotal: z.number(),
  taxes: z.number(),
  discount: z.number().default(0),
  total: z.number(),
  bookingReference: z.string(),
  createdAt: z.string(),
});

export type Booking = z.infer<typeof bookingSchema>;

export const insertBookingSchema = z.object({
  experienceId: z.string(),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  date: z.string(),
  time: z.string(),
  quantity: z.number().min(1),
  promoCode: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to terms and conditions"),
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;

// Promo Code Schema
export const promoCodeSchema = z.object({
  code: z.string(),
  type: z.enum(["percentage", "fixed"]),
  value: z.number(),
  description: z.string(),
});

export type PromoCode = z.infer<typeof promoCodeSchema>;

// Promo Validation Request/Response
export const promoValidationRequestSchema = z.object({
  code: z.string(),
  subtotal: z.number(),
});

export const promoValidationResponseSchema = z.object({
  valid: z.boolean(),
  discount: z.number(),
  message: z.string(),
});

export type PromoValidationRequest = z.infer<typeof promoValidationRequestSchema>;
export type PromoValidationResponse = z.infer<typeof promoValidationResponseSchema>;

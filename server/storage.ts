import mongoose from "mongoose";
import { randomUUID } from "crypto";
import {
  type Experience,
  type InsertExperience,
  type Booking,
  type InsertBooking,
  type PromoCode,
} from "@shared/schema";

const experienceSchema = new mongoose.Schema({
  id: { type: String, default: () => randomUUID() },
  name: { type: String, required: true },
  description: String,
  location: String,
  category: String,
  price: Number,
  imageUrl: String,
  availableDates: { type: [String], default: [] },
  timeSlots: [
    {
      time: String,
      available: Boolean,
      capacity: { type: Number, default: 0 },
    },
  ],
  minAge: Number,
  duration: String,
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  id: { type: String, default: () => randomUUID() },
  experienceId: String,
  experienceName: String,
  fullName: String,
  email: String,
  date: String,
  time: String,
  quantity: Number,
  promoCode: String,
  subtotal: Number,
  taxes: Number,
  discount: Number,
  total: Number,
  bookingReference: String,
  createdAt: { type: Date, default: Date.now },
});

const promoSchema = new mongoose.Schema({
  code: String,
  type: String,
  value: Number,
  description: String,
});

const ExperienceModel = mongoose.model("Experience", experienceSchema);
const BookingModel = mongoose.model("Booking", bookingSchema);
const PromoModel = mongoose.model("PromoCode", promoSchema);

export const storage = {
  async getAllExperiences(searchQuery?: string): Promise<Experience[]> {
    const filter = searchQuery
      ? {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
          { location: { $regex: searchQuery, $options: "i" } },
          { category: { $regex: searchQuery, $options: "i" } },
        ],
      }
      : {};
    return await ExperienceModel.find(filter).lean();
  },

  async getExperienceById(id: string) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const doc = await ExperienceModel.findById(id).lean();
        if (doc) return doc;
      }
      return (await ExperienceModel.findOne({ id }).lean()) ?? null;
    } catch (error) {
      console.error("Error fetching experience by ID:", error);
      return null;
    }
  },

  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    const exp = new ExperienceModel({ ...insertExperience });
    await exp.save();
    return exp;
  },

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const experience = await this.getExperienceById(insertBooking.experienceId);
    if (!experience) throw new Error("Experience not found");

    const bookingReference = `HUF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const subtotal = experience.price * insertBooking.quantity;
    const taxes = Math.round(subtotal * 0.05);
    let discount = 0;

    if (insertBooking.promoCode) {
      const promo = await this.getPromoCode(insertBooking.promoCode);
      if (promo) {
        discount =
          promo.type === "percentage"
            ? Math.round(subtotal * (promo.value / 100))
            : promo.value;
      }
    }

    const total = subtotal + taxes - discount;

    const booking = new BookingModel({
      ...insertBooking,
      experienceName: experience.name,
      subtotal,
      taxes,
      discount,
      total,
      bookingReference,
    });

    await booking.save();
    const plain = booking.toObject();
    plain.id = booking.id || booking._id.toString();
    return plain;
  },

  async getBookingById(id: string): Promise<Booking | undefined> {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const booking = await BookingModel.findById(id).lean();
        if (booking) return booking;
      }
      const booking = await BookingModel.findOne({ id }).lean();
      return booking ?? undefined;
    } catch (error) {
      console.error("Error fetching booking by ID:", error);
      return undefined;
    }
  },

  async getAllBookings(): Promise<Booking[]> {
    return await BookingModel.find().lean();
  },

  async checkSlotAvailability(experienceId: string, date: string, time: string): Promise<boolean> {
    const count = await BookingModel.countDocuments({ experienceId, date, time });
    return count < 10;
  },

  async getPromoCode(code: string): Promise<PromoCode | undefined> {
    const promo = await PromoModel.findOne({ code: code.toUpperCase() });
    return promo ?? undefined;
  },
};

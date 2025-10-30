import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertBookingSchema,
  promoValidationRequestSchema,
  type PromoValidationResponse
} from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  await seedExperiences();

  app.get("/api/experiences", async (req, res) => {
    try {
      const searchQuery = req.query.search as string | undefined;
      const experiences = await storage.getAllExperiences(searchQuery);

      const formatted = experiences.map(exp => ({
        ...exp,
        id: exp._id || exp.id,
      }));

      res.json(formatted);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      res.status(500).json({ error: "Failed to fetch experiences" });
    }
  });

  app.get("/api/experiences/:id", async (req, res) => {
    try {
      const experience = await storage.getExperienceById(req.params.id);
      if (!experience) {
        return res.status(404).json({ error: "Experience not found" });
      }

      res.json({
        ...experience,
        id: (experience as any)._id ? String((experience as any)._id) : experience.id,
      });
    } catch (error) {
      console.error("Error fetching experience:", error);
      res.status(500).json({ error: "Failed to fetch experience" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const parsed = insertBookingSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: fromError(parsed.error).message });
      }

      const bookingData = parsed.data;
      const booking = await storage.createBooking(bookingData);

      console.log("✅ Booking created and saved:", booking);
      res.status(201).json({
        ...booking,
        _id: booking._id?.toString(),
        id: booking._id?.toString(),
      });
    } catch (err) {
      console.error("❌ Error creating booking:", err);
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json({
        ...booking,
        id: booking._id?.toString() || booking.id,
      });
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  app.post("/api/promo/validate", async (req, res) => {
    try {
      const result = promoValidationRequestSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: "Invalid request",
          details: fromError(result.error).toString()
        });
      }

      const { code, subtotal } = result.data;
      const promo = await storage.getPromoCode(code);

      if (!promo) {
        const response: PromoValidationResponse = {
          valid: false,
          discount: 0,
          message: "Invalid promo code",
        };
        return res.json(response);
      }

      // Calculate discount
      let discount = 0;
      if (promo.type === "percentage") {
        discount = Math.round(subtotal * (promo.value / 100));
      } else {
        discount = promo.value;
      }

      const response: PromoValidationResponse = {
        valid: true,
        discount,
        message: `${promo.description} applied! You save ₹${discount}`,
      };

      res.json(response);
    } catch (error) {
      console.error("Error validating promo code:", error);
      res.status(500).json({ error: "Failed to validate promo code" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Seed initial experiences data
async function seedExperiences() {
  try {
    const existingExperiences = await storage.getAllExperiences();
    if (existingExperiences.length > 0) {
      console.log("✅ Experiences already exist, skipping seed.");
      return;
    }

    console.log("🌱 Seeding experiences data into MongoDB...");

    const availableDates: string[] = [];
    for (let i = 1; i <= 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      availableDates.push(date.toISOString().split("T")[0]);
    }

    // Default time slots
    const defaultTimeSlots = [
      { time: "6:00 AM", available: true, capacity: 8 },
      { time: "9:00 AM", available: true, capacity: 10 },
      { time: "12:00 PM", available: true, capacity: 6 },
      { time: "3:00 PM", available: true, capacity: 10 },
      { time: "6:00 PM", available: true, capacity: 8 },
    ];

    const experiences = [
      {
        name: "Kayaking",
        description:
          "Curated small-group experience. Certified guide. Safety first with gear included. Helmet and life jackets along with an expert will accompany you in kayaking.",
        location: "Udupi",
        price: 999,
        imageUrl: "/images/experiences/kayaking.png",
        category: "Udupi",
        availableDates,
        timeSlots: defaultTimeSlots,
        minAge: 10,
        duration: "2 hours",
      },
      {
        name: "Kayaking",
        description:
          "Curated small-group experience. Certified guide. Safety first with gear included. Helmet and life jackets along with an expert will accompany you in kayaking.",
        location: "Udupi",
        price: 999,
        imageUrl: "/images/experiences/Kayaking2.png",
        category: "Udupi",
        availableDates,
        timeSlots: defaultTimeSlots,
        minAge: 10,
        duration: "2 hours",
      },
      {
        name: "Kayaking",
        description:
          "Curated small-group experience. Certified guide. Safety first with gear included. Helmet and life jackets along with an expert will accompany you in kayaking.",
        location: "Udupi",
        price: 999,
        imageUrl: "/images/experiences/KayaKing3.png",
        category: "Udupi",
        availableDates,
        timeSlots: defaultTimeSlots,
        minAge: 10,
        duration: "2 hours",
      },
      {
        name: "Kayaking",
        description:
          "Curated small-group experience. Certified guide. Safety first with gear included. Helmet and life jackets along with an expert will accompany you in kayaking.",
        location: "Udupi",
        price: 999,
        imageUrl: "/images/experiences/KayaKing4.png",
        category: "Udupi",
        availableDates,
        timeSlots: defaultTimeSlots,
        minAge: 10,
        duration: "2 hours",
      },
      {
        name: "Kayaking",
        description:
          "Curated small-group experience. Certified guide. Safety first with gear included. Helmet and life jackets along with an expert will accompany you in kayaking.",
        location: "Udupi",
        price: 999,
        imageUrl: "/images/experiences/Kayaking5.png",
        category: "Udupi",
        availableDates,
        timeSlots: defaultTimeSlots,
        minAge: 10,
        duration: "2 hours",
      },
      {
        name: "Nandi Hills Sunrise",
        description:
          "Early morning trek to catch the breathtaking sunrise from Nandi Hills with a certified guide and refreshments.",
        location: "Bangalore",
        price: 899,
        imageUrl: "/images/experiences/nandi-hills.jpg",
        category: "Bangalore",
        availableDates,
        timeSlots: defaultTimeSlots,
        minAge: 12,
        duration: "4 hours",
      },
      {
        name: "Nandi Hills Sunrise",
        description:
          "Early morning trek to catch the breathtaking sunrise from Nandi Hills with a certified guide and refreshments.",
        location: "Bangalore",
        price: 899,
        imageUrl: "/images/experiences/nandi-hills2.png",
        category: "Bangalore",
        availableDates,
        timeSlots: defaultTimeSlots,
        minAge: 12,
        duration: "4 hours",
      },
      {
        name: "Coffee Trail",
        description:
          "Explore coffee plantations in Coorg and learn the process from bean to cup.",
        location: "Coorg",
        price: 1299,
        imageUrl: "/images/experiences/coffee-trail.jpg",
        category: "Coorg",
        availableDates,
        timeSlots: defaultTimeSlots,
        minAge: 10,
        duration: "3 hours",
      },
      {
        name: "Boat Cruise",
        description:
          "Relaxing boat cruise in Goa with scenic views and refreshments included.",
        location: "Goa",
        price: 999,
        imageUrl: "/images/experiences/boat-cruise.png",
        category: "Goa",
        availableDates,
        timeSlots: defaultTimeSlots,
        minAge: 8,
        duration: "2 hours",
      },
      {
        name: "Bungee Jumping",
        description:
          "Experience the ultimate adrenaline rush with professional supervision in Rishikesh.",
        location: "Rishikesh",
        price: 3499,
        imageUrl: "/images/experiences/bungee-jumping.png",
        category: "Rishikesh",
        availableDates,
        timeSlots: defaultTimeSlots,
        minAge: 18,
        duration: "1 hour",
      },
    ];

    for (const exp of experiences) {
      await storage.createExperience(exp);
    }

    console.log(`✅ Seeded ${experiences.length} experiences into MongoDB!`);
  } catch (error) {
    console.error("❌ Error seeding experiences:", error);
  }
}

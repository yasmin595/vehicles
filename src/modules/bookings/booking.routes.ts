import { Router } from "express";
import * as controller from "./booking.controller";
import { authenticate, authorize } from "../../middleware/auth";

export const bookingRoutes = Router();

// Create booking (admin or customer)
bookingRoutes.post(
  "/",
  authenticate,
  authorize("admin", "customer"),
  controller.createBooking
);

// Get bookings (role based)
bookingRoutes.get(
  "/",
  authenticate,
  controller.getBookings
);

// Update booking
bookingRoutes.put(
  "/:bookingId",
  authenticate,
  controller.updateBookingStatus
);

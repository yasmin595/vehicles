import { Request, Response } from "express";
import * as bookingService from "./booking.service";

export const createBooking = async (req: any, res: Response) => {
  const booking = await bookingService.createBooking(req.body, req.user);

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
};

export const getBookings = async (req: any, res: Response) => {
  const bookings = await bookingService.getBookings(req.user);
  res.json({ success: true, data: bookings });
};

export const updateBookingStatus = async (req: any, res: Response) => {
  const updated = await bookingService.updateBookingStatus(
    req.params.bookingId,
    req.user
  );
  res.json({ success: true, data: updated });
};

import { pool } from "../../config/db";

export const createBooking = async (payload: any, user: any) => {
  const { vehicle_id, rent_start_date, rent_end_date } = payload;

  // get vehicle
  const vehicleRes = await pool.query(
    "SELECT * FROM vehicles WHERE id=$1",
    [vehicle_id]
  );

  if (!vehicleRes.rows.length) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleRes.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle not available");
  }

  // calculate days
  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);

  const diff = end.getTime() - start.getTime();
  const days = diff / (1000 * 60 * 60 * 24);

  if (days <= 0) {
    throw new Error("Invalid rent duration");
  }

  const totalPrice = days * vehicle.daily_rent_price;

  // create booking
  const bookingRes = await pool.query(
    `INSERT INTO bookings
     (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1,$2,$3,$4,$5,'active')
     RETURNING *`,
    [user.id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );

  // update vehicle status
  await pool.query(
    "UPDATE vehicles SET availability_status='booked' WHERE id=$1",
    [vehicle_id]
  );

  return bookingRes.rows[0];
};

export const getBookings = async (user: any) => {
  if (user.role === "admin") {
    const result = await pool.query("SELECT * FROM bookings");
    return result.rows;
  }

  const result = await pool.query(
    "SELECT * FROM bookings WHERE customer_id=$1",
    [user.id]
  );
  return result.rows;
};

export const updateBookingStatus = async (
  bookingId: string,
  user: any
) => {
  const bookingRes = await pool.query(
    "SELECT * FROM bookings WHERE id=$1",
    [bookingId]
  );

  if (!bookingRes.rows.length) {
    throw new Error("Booking not found");
  }

  const booking = bookingRes.rows[0];

  // customer cancel
  if (user.role === "customer") {
    if (booking.customer_id !== user.id) {
      throw new Error("Forbidden");
    }

    if (new Date() >= new Date(booking.rent_start_date)) {
      throw new Error("Cannot cancel after start date");
    }

    await pool.query(
      "UPDATE bookings SET status='cancelled' WHERE id=$1",
      [bookingId]
    );

    await pool.query(
      "UPDATE vehicles SET availability_status='available' WHERE id=$1",
      [booking.vehicle_id]
    );

    return { status: "cancelled" };
  }

  // admin return
  if (user.role === "admin") {
    await pool.query(
      "UPDATE bookings SET status='returned' WHERE id=$1",
      [bookingId]
    );

    await pool.query(
      "UPDATE vehicles SET availability_status='available' WHERE id=$1",
      [booking.vehicle_id]
    );

    return { status: "returned" };
  }
};

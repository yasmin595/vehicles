import { pool } from "../../config/db";

export const getAllVehicles = async () => {
  const result = await pool.query("SELECT * FROM vehicles");
  return result.rows;
};

export const getVehicleById = async (vehicleId: string) => {
  const result = await pool.query(
    "SELECT * FROM vehicles WHERE id=$1",
    [vehicleId]
  );

  if (!result.rows.length) {
    throw new Error("Vehicle not found");
  }

  return result.rows[0];
};

export const createVehicle = async (payload: any) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `INSERT INTO vehicles
     (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status || "available",
    ]
  );

  return result.rows[0];
};

export const updateVehicle = async (
  vehicleId: string,
  payload: any
) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in payload) {
    fields.push(`${key}=$${index}`);
    values.push(payload[key]);
    index++;
  }

  if (!fields.length) {
    throw new Error("No data to update");
  }

  const query = `
    UPDATE vehicles
    SET ${fields.join(", ")}
    WHERE id=$${index}
    RETURNING *
  `;

  values.push(vehicleId);

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteVehicle = async (vehicleId: string) => {
  const activeBooking = await pool.query(
    "SELECT 1 FROM bookings WHERE vehicle_id=$1 AND status='active'",
    [vehicleId]
  );

  if (activeBooking.rows.length) {
    throw new Error("Vehicle has active bookings");
  }

  await pool.query("DELETE FROM vehicles WHERE id=$1", [vehicleId]);
};

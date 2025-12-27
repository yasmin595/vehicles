import { pool } from "../../config/db";

export const getAllUsers = async () => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM users"
  );
  return result.rows;
};

export const updateUser = async (
  userId: string,
  payload: any,
  currentUser: any
) => {
  // customer can update only own profile
  if (currentUser.role !== "admin" && currentUser.id != userId) {
    throw new Error("Forbidden");
  }

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
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id=$${index}
    RETURNING id, name, email, phone, role
  `;

  values.push(userId);

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteUser = async (userId: string) => {
  // check active bookings
  const bookingCheck = await pool.query(
    "SELECT 1 FROM bookings WHERE customer_id=$1 AND status='active'",
    [userId]
  );

  if (bookingCheck.rows.length) {
    throw new Error("User has active bookings");
  }

  await pool.query("DELETE FROM users WHERE id=$1", [userId]);
};

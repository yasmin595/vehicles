import { Pool } from "pg";
import config from ".";

// DB pool
export const pool = new Pool({
  connectionString: config.connection_str,
  ssl: { rejectUnauthorized: false },
});

const initDB = async () => {
  // USERS
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL CHECK (email = LOWER(email)),
      password TEXT NOT NULL CHECK (LENGTH(password) >= 6),
      phone TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'customer')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // VEHICLES
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      vehicle_name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('car','bike','van','SUV')),
      registration_number TEXT UNIQUE NOT NULL,
      daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price > 0),
      availability_status TEXT NOT NULL CHECK (availability_status IN ('available','booked'))
    );
  `);

  // BOOKINGS
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      customer_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
      total_price NUMERIC NOT NULL CHECK (total_price > 0),
      status TEXT NOT NULL CHECK (status IN ('active','cancelled','returned'))
    );
  `);

  console.log(" Database tables initialized");
};

export default initDB;

import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";
import { hashPassword, comparePassword } from "../../utils/password";

export const signup = async (payload: any) => {
  const { name, email, password, phone,role } = payload;

  const hashedPassword = await hashPassword(password);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id, name, email, role`,
    [name, email.toLowerCase(), hashedPassword,phone,role]
  );

  return result.rows[0];
};

export const signin = async (payload: any) => {
  const { email, password } = payload;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email.toLowerCase()]
  );

  if (!result.rows.length) {
    throw new Error("Invalid credentials");
  }

  const user = result.rows[0];

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign (
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret as string,
    {   expiresIn: "7d",}
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

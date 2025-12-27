import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  connection_str: process.env.CONNECTION_STR,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ,
};

export default config;
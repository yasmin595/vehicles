import express, { Request, Response } from "express";
import config from "./config";

import logger from "./middleware/logger";
import initDB from "./config/db";

// routes
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/user.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";

const app = express();

// parser
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// initialize database
initDB();

// root route
app.get("/", logger, (req: Request, res: Response) => {
  res.send(" Vehicle Rental API is running");
});

// ================= ROUTES =================

// auth
app.use("/api/v1/auth", authRoutes);

// users
app.use("/api/v1/users", userRoutes);

// vehicles
app.use("/api/v1/vehicles", vehicleRoutes);

// bookings
app.use("/api/v1/bookings", bookingRoutes);

// ============== NOT FOUND ==============
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

export default app;

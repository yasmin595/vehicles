import { Router } from "express";
import * as controller from "./user.controller";
import { authenticate, authorize } from "../../middleware/auth";

export const userRoutes = Router();

// Admin only
userRoutes.get("/", authenticate, authorize("admin"), controller.getAllUsers);

// Admin or own profile
userRoutes.put(
  "/:userId",
  authenticate,
  controller.updateUser
);

// Admin only
userRoutes.delete(
  "/:userId",
  authenticate,
  authorize("admin"),
  controller.deleteUser
);

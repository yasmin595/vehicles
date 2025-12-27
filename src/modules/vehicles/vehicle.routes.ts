import { Router } from "express";
import * as controller from "./vehichles.controller";
import { authenticate, authorize } from "../../middleware/auth";
// import { authenticate } from "../../middleware/auth.middleware";
// import { authorize } from "../../middleware/role.middleware";

export const vehicleRoutes = Router();

// Public
vehicleRoutes.get("/", controller.getAllVehicles);
vehicleRoutes.get("/:vehicleId", controller.getSingleVehicle);

// Admin only
vehicleRoutes.post(
  "/",
  authenticate,
  authorize("admin"),
  controller.createVehicle
);

vehicleRoutes.put(
  "/:vehicleId",
  authenticate,
  authorize("admin"),
  controller.updateVehicle
);

vehicleRoutes.delete(
  "/:vehicleId",
  authenticate,
  authorize("admin"),
  controller.deleteVehicle
);

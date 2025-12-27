import { Request, Response } from "express";
import * as vehicleService from "./vehicle.service";

export const getAllVehicles = async (req: Request, res: Response) => {
  const vehicles = await vehicleService.getAllVehicles();
  res.json({ success: true, data: vehicles });
};

export const getSingleVehicle = async (req: Request, res: Response) => {
  const vehicle = await vehicleService.getVehicleById(req.params.vehicleId as string);
  res.json({ success: true, data: vehicle });
};

export const createVehicle = async (req: Request, res: Response) => {
  const vehicle = await vehicleService.createVehicle(req.body);
  res.status(201).json({ success: true, data: vehicle });
};

export const updateVehicle = async (req: Request, res: Response) => {
  const updated = await vehicleService.updateVehicle(
    req.params.vehicleId as string,
    req.body
  );
  res.json({ success: true, data: updated });
};

export const deleteVehicle = async (req: Request, res: Response) => {
  await vehicleService.deleteVehicle(req.params.vehicleId as string);
  res.json({ success: true, message: "Vehicle deleted successfully" });
};

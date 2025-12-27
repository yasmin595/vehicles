import { Request, Response } from "express";
import * as userService from "./user.service";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json({ success: true, data: users });
};

export const updateUser = async (req: any, res: Response) => {
  const updated = await userService.updateUser(
    req.params.userId,
    req.body,
    req.user
  );
  res.json({ success: true, data: updated });
};

export const deleteUser = async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.userId as string);
  res.json({ success: true, message: "User deleted successfully" });
};

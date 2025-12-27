import { Router } from "express";
import { signup, signin } from "./auth.controller";

export const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/signin", signin);

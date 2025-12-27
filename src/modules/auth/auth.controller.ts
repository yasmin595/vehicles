import { Request, Response } from "express";
import * as authService from "./auth.service";

export const signup = async (req: Request, res: Response) => {
  const user = await authService.signup(req.body);
  console.log(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
};

export const signin = async (req: Request, res: Response) => {
  const result = await authService.signin(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token: result.token,
    user: result.user,
  });
};

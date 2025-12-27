// higher order function -> returns middleware function

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

interface AuthRequest extends Request {
  user?: JwtPayload;
}

// roles = ["admin", "customer"]
const auth = (...roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      // 1️⃣ Token check
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Token missing",
        });
      }

      // 2️⃣ Bearer token extract
      const token = authHeader.split(" ")[1];

      // 3️⃣ Verify token
      const decoded = jwt.verify(
        token as string,
        config.jwtSecret as string
      ) as JwtPayload;

      // 4️⃣ attach user to request
      req.user = decoded;

      // 5️⃣ role check
      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You are not allowed",
        });
      }

      next();
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
};

export default auth;

export const authenticate = auth();
export const authorize = (...roles: string[]) => auth(...roles);

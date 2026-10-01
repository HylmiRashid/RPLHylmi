import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Env } from "../config/Env";
import { JwtPayload } from "../types/Models";
import { HttpError } from "../utils/HttpError";

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new HttpError(401, "Anda belum masuk. Silakan login terlebih dahulu.");
  }
  let payload: JwtPayload;
  try {
    payload = jwt.verify(header.slice(7), Env.JwtSecret) as JwtPayload;
  } catch {
    throw new HttpError(401, "Sesi berakhir. Silakan login kembali.");
  }
  req.UserId = payload.UserId;
  next();
}

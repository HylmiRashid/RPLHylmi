import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/HttpError";

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(new HttpError(404, "Endpoint tidak ditemukan."));
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof HttpError) {
    res.status(error.StatusCode).json({ Message: error.message });
    return;
  }
  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({ Message: "Format JSON tidak valid." });
    return;
  }
  console.error(error);
  res.status(500).json({ Message: "Terjadi kesalahan pada server." });
}

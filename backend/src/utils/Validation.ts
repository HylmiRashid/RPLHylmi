import { HttpError } from "./HttpError";

const EmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DatePattern = /^\d{4}-\d{2}-\d{2}$/;

export function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new HttpError(400, "Data yang dikirim tidak valid.");
  }
  return value as Record<string, unknown>;
}

export function requireText(value: unknown, label: string, maxLength = 100): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new HttpError(400, `${label} wajib diisi.`);
  }
  const text = value.trim();
  if (text.length > maxLength) {
    throw new HttpError(400, `${label} maksimal ${maxLength} karakter.`);
  }
  return text;
}

export function optionalText(value: unknown, label: string, maxLength = 300): string {
  if (value === undefined || value === null || value === "") {
    return "";
  }
  return requireText(value, label, maxLength);
}

export function requireEmail(value: unknown): string {
  const email = requireText(value, "Email", 150).toLowerCase();
  if (!EmailPattern.test(email)) {
    throw new HttpError(400, "Format email tidak valid.");
  }
  return email;
}

export function requirePassword(value: unknown): string {
  if (typeof value !== "string" || value.length < 6) {
    throw new HttpError(400, "Kata sandi minimal 6 karakter.");
  }
  if (value.length > 72) {
    throw new HttpError(400, "Kata sandi maksimal 72 karakter.");
  }
  return value;
}

export function requireNumber(value: unknown, label: string, min: number, integer = false): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new HttpError(400, `${label} harus berupa angka.`);
  }
  if (integer && !Number.isInteger(value)) {
    throw new HttpError(400, `${label} harus berupa bilangan bulat.`);
  }
  if (value < min) {
    throw new HttpError(400, `${label} minimal ${min}.`);
  }
  return value;
}

export function optionalDateString(value: unknown, label: string): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const isValid =
    typeof value === "string" &&
    DatePattern.test(value) &&
    new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;
  if (!isValid) {
    throw new HttpError(400, `${label} tidak valid. Gunakan format YYYY-MM-DD.`);
  }
  return value as string;
}

export function toIsoDate(value: unknown, label: string): string {
  const date = optionalDateString(value, label);
  return date ? `${date}T00:00:00.000Z` : new Date().toISOString();
}

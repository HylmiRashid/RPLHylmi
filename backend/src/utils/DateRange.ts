import { DateRangeDto } from "../types/Dtos";
import { HttpError } from "./HttpError";
import { optionalDateString } from "./Validation";

export function resolveDateRange(query: Record<string, unknown>): DateRangeDto {
  const now = new Date();
  const firstDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().slice(0, 10);
  const lastDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).toISOString().slice(0, 10);
  const startDate = optionalDateString(query.StartDate, "StartDate") ?? firstDay;
  const endDate = optionalDateString(query.EndDate, "EndDate") ?? lastDay;
  if (startDate > endDate) {
    throw new HttpError(400, "Tanggal mulai tidak boleh lebih besar dari tanggal akhir.");
  }
  return { StartDate: startDate, EndDate: endDate };
}

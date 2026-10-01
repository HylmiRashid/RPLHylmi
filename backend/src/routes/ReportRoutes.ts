import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { buildProfitLoss } from "../services/ReportService";
import { ReportGroupBy } from "../types/Models";
import { resolveDateRange } from "../utils/DateRange";
import { HttpError } from "../utils/HttpError";

const router = Router();

router.get(
  "/profit-loss",
  asyncHandler(async (req, res) => {
    const range = resolveDateRange(req.query);
    const groupBy = (req.query.GroupBy ?? ReportGroupBy.Daily) as ReportGroupBy;
    if (!Object.values(ReportGroupBy).includes(groupBy)) {
      throw new HttpError(400, "GroupBy harus bernilai daily atau monthly.");
    }
    res.json(await buildProfitLoss(req.UserId as string, range.StartDate, range.EndDate, groupBy));
  })
);

export default router;

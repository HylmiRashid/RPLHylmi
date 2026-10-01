import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { buildSummary } from "../services/ReportService";
import { resolveDateRange } from "../utils/DateRange";

const router = Router();

router.get(
  "/summary",
  asyncHandler(async (req, res) => {
    const range = resolveDateRange(req.query);
    res.json(await buildSummary(req.UserId as string, range.StartDate, range.EndDate));
  })
);

export default router;

import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import {
  createExpense,
  createIncome,
  deleteTransaction,
  findTransactions,
} from "../services/TransactionService";
import { IncomeItemDto } from "../types/Dtos";
import { HttpError } from "../utils/HttpError";
import { asRecord, optionalDateString, optionalText, requireNumber, requireText, toIsoDate } from "../utils/Validation";

const router = Router();

function parseIncomeItems(value: unknown): IncomeItemDto[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new HttpError(400, "Daftar item penjualan wajib diisi.");
  }
  return value.map((entry) => {
    const item = asRecord(entry);
    return {
      ProductId: requireText(item.ProductId, "Produk", 200),
      Quantity: requireNumber(item.Quantity, "Jumlah", 1, true),
    };
  });
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const startDate = optionalDateString(req.query.StartDate, "StartDate");
    const endDate = optionalDateString(req.query.EndDate, "EndDate");
    const items = await findTransactions(req.UserId as string, startDate, endDate);
    const limit = Number(req.query.Limit);
    res.json(Number.isInteger(limit) && limit > 0 ? items.slice(0, limit) : items);
  })
);

router.post(
  "/income",
  asyncHandler(async (req, res) => {
    const body = asRecord(req.body);
    const transaction = await createIncome(req.UserId as string, {
      TransactionDate: toIsoDate(body.TransactionDate, "Tanggal transaksi"),
      Description: optionalText(body.Description, "Keterangan"),
      Items: parseIncomeItems(body.Items),
    });
    res.status(201).json(transaction);
  })
);

router.post(
  "/expense",
  asyncHandler(async (req, res) => {
    const body = asRecord(req.body);
    const transaction = await createExpense(req.UserId as string, {
      TransactionDate: toIsoDate(body.TransactionDate, "Tanggal transaksi"),
      Description: requireText(body.Description, "Keterangan", 300),
      TotalAmount: requireNumber(body.TotalAmount, "Nominal", 1),
    });
    res.status(201).json(transaction);
  })
);

router.delete(
  "/:Id",
  asyncHandler(async (req, res) => {
    await deleteTransaction(req.UserId as string, req.params.Id);
    res.status(204).send();
  })
);

export default router;

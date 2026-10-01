import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { createProduct, deleteProduct, listProducts, updateProduct } from "../services/ProductService";
import { ProductDto } from "../types/Dtos";
import { asRecord, requireNumber, requireText } from "../utils/Validation";

const router = Router();

function parseProduct(body: unknown): ProductDto {
  const data = asRecord(body);
  return {
    Name: requireText(data.Name, "Nama produk"),
    Price: requireNumber(data.Price, "Harga", 0),
    Stock: requireNumber(data.Stock, "Stok", 0, true),
  };
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json(await listProducts(req.UserId as string));
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    res.status(201).json(await createProduct(req.UserId as string, parseProduct(req.body)));
  })
);

router.put(
  "/:Id",
  asyncHandler(async (req, res) => {
    res.json(await updateProduct(req.UserId as string, req.params.Id, parseProduct(req.body)));
  })
);

router.delete(
  "/:Id",
  asyncHandler(async (req, res) => {
    await deleteProduct(req.UserId as string, req.params.Id);
    res.status(204).send();
  })
);

export default router;

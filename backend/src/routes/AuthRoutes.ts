import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { login, register } from "../services/AuthService";
import { asRecord, requireEmail, requirePassword, requireText } from "../utils/Validation";

const router = Router();

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const body = asRecord(req.body);
    const result = await register({
      Name: requireText(body.Name, "Nama"),
      StoreName: requireText(body.StoreName, "Nama toko"),
      Email: requireEmail(body.Email),
      Password: requirePassword(body.Password),
    });
    res.status(201).json(result);
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const body = asRecord(req.body);
    const result = await login({
      Email: requireEmail(body.Email),
      Password: requireText(body.Password, "Kata sandi", 72),
    });
    res.json(result);
  })
);

export default router;

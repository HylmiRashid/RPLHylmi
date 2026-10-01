import cors from "cors";
import express from "express";
import { Env } from "./config/Env";
import { requireAuth } from "./middleware/Auth";
import { errorHandler, notFoundHandler } from "./middleware/ErrorHandler";
import AuthRoutes from "./routes/AuthRoutes";
import DashboardRoutes from "./routes/DashboardRoutes";
import ProductRoutes from "./routes/ProductRoutes";
import ReportRoutes from "./routes/ReportRoutes";
import TransactionRoutes from "./routes/TransactionRoutes";

const app = express();

app.use(cors({ origin: Env.CorsOrigin }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ Status: "OK" });
});

app.use("/api/auth", AuthRoutes);
app.use("/api/products", requireAuth, ProductRoutes);
app.use("/api/transactions", requireAuth, TransactionRoutes);
app.use("/api/dashboard", requireAuth, DashboardRoutes);
app.use("/api/reports", requireAuth, ReportRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

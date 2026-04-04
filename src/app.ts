import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.status(200).json(
    new ApiResponse(
      true,
      {
        message: "Hello World :) access swagger docs at /docs",
      },
      null,
    ),
  );
});

import authRoutes from "./modules/auth/auth.route";
import userRoutes from "./modules/user/user.route";
import recordRoutes from "./modules/record/record.route";
import dashboardRoutes from "./modules/dashboard/dashboard.route";
import healthRoutes from "./modules/health/health.route";
import { ApiResponse } from "./utils/ApiResponse";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/records", recordRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/health", healthRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // swagger docs

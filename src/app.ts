import express from "express";
import cors from "cors";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/v1/health", (_, res) => {
  return res.status(200).json({
    message: "finledger-api v1 is up and running!",
  });
});

import authRoutes from "./modules/auth/auth.route";
import userRoutes from "./modules/user/user.route";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

import express from "express";
import cors from "cors";

export const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/v1/health", (_, res) => {
  return res.status(200).json({
    message: "finledger-api v1 is up and running!",
  });
});

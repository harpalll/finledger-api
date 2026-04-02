import type { Request, Response } from "express";
import { loginSchema } from "./auth.validation";
import { loginUser } from "./auth.service";
import { ApiResponse } from "../../utils/ApiResponse";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);

    return res.status(200).json(new ApiResponse(true, result, null));
  } catch (error: any) {
    return res.status(400).json(
      new ApiResponse(false, null, {
        message: error.message || "Login failed",
      }),
    );
  }
};

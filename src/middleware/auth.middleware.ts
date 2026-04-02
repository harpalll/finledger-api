import { config } from "../config/config";
import type { User } from "../types";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(400)
      .json(new ApiResponse(false, null, { message: "INVALID HEADER" }));
  }

  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res
      .status(400)
      .json(new ApiResponse(false, null, { message: "INVALID ACCESS TOKEN" }));
  }

  try {
    const decodedToken = jwt.verify(token, config.JWT_SECRET!);
    if (!decodedToken) {
      return res
        .status(401)
        .json(
          new ApiResponse(false, null, { message: "INVALID ACCESS TOKEN" }),
        );
    }

    const { userId, role } = decodedToken as User;
    if ([userId, role].some((field) => !field)) {
      return res
        .status(401)
        .json(new ApiResponse(false, null, { message: "UNAUTHORIZED" }));
    }

    req.user = {
      userId,
      role,
    };

    next();
  } catch (error) {
    return res
      .status(401)
      .json(new ApiResponse(false, null, { message: "INVALID ACCESS TOKEN" }));
  }
});

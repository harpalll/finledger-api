import type { Role } from "../../generated/prisma/enums";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { StatusCodes } from "http-status-codes";

export const allowedRoles = (allowedRoles: Role[]) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json(new ApiResponse(false, null, { message: "UNAUTHORIZED" }));
    }

    if (!allowedRoles.includes(req.user?.role!)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json(new ApiResponse(false, null, { message: "FORBIDDEN" }));
    }

    next();
  });
};

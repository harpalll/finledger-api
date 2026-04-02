import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/ApiResponse";
import type { errorMessage } from "../types";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: errorMessage[] = error.issues.map((issue) => {
          return {
            field: issue.path.join("."),
            message: issue.message,
          };
        });

        res
          .status(StatusCodes.BAD_REQUEST)
          .json(new ApiResponse(false, null, formattedErrors));
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal Server Error" });
      }
    }
  };
}

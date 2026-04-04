import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse";
import {
  createUserService,
  getUsersService,
  updateUserService,
} from "./user.service";

export const createUser = async (req: Request, res: Response) => {
  try {
    const result = await createUserService(req.body, req.user!);

    return res.status(201).json(new ApiResponse(true, result, null));
  } catch (error: any) {
    return res.status(400).json(
      new ApiResponse(false, null, {
        message: error.message || "Failed to create user",
      }),
    );
  }
};

export const getUsers = async (_: Request, res: Response) => {
  try {
    const users = await getUsersService();

    return res.status(200).json(new ApiResponse(true, users, null));
  } catch (error: any) {
    return res.status(500).json(
      new ApiResponse(false, null, {
        message: "Failed to fetch users",
      }),
    );
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;

    const updatedUser = await updateUserService(userId, req.body, req.user!);

    return res.status(200).json(new ApiResponse(true, updatedUser, null));
  } catch (error: any) {
    const isNotFound = error.message === "User not found";

    return res.status(isNotFound ? 404 : 400).json(
      new ApiResponse(false, null, {
        message: error.message || "Failed to update user",
      }),
    );
  }
};

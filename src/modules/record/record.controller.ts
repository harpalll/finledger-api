import type { Request, Response } from "express";
import {
  createRecordService,
  getRecordsService,
  getRecordByIdService,
  updateRecordService,
  deleteRecordService,
} from "./record.service";
import { ApiResponse } from "../../utils/ApiResponse";

export const createRecord = async (req: Request, res: Response) => {
  try {
    const record = await createRecordService(req.body, req.user!);

    return res.status(201).json(new ApiResponse(true, record, null));
  } catch (error: any) {
    return res.status(400).json(
      new ApiResponse(false, null, {
        message: error.message || "Failed to create record",
      }),
    );
  }
};

export const getRecords = async (req: Request, res: Response) => {
  try {
    const records = await getRecordsService(req.query);

    return res.status(200).json(new ApiResponse(true, records, null));
  } catch (error: any) {
    return res.status(500).json(
      new ApiResponse(false, null, {
        message: "Failed to fetch records",
      }),
    );
  }
};

export const getRecordById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const record = await getRecordByIdService(id);

    return res.status(200).json(new ApiResponse(true, record, null));
  } catch (error: any) {
    return res.status(404).json(
      new ApiResponse(false, null, {
        message: error.message || "Record not found",
      }),
    );
  }
};

export const updateRecord = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const updated = await updateRecordService(id, req.body, req.user!);

    return res.status(200).json(new ApiResponse(true, updated, null));
  } catch (error: any) {
    return res.status(400).json(
      new ApiResponse(false, null, {
        message: error.message || "Failed to update record",
      }),
    );
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const result = await deleteRecordService(id, req.user!);

    return res.status(200).json(new ApiResponse(true, result, null));
  } catch (error: any) {
    return res.status(400).json(
      new ApiResponse(false, null, {
        message: error.message || "Failed to delete record",
      }),
    );
  }
};

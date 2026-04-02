import type { errorMessage } from "../types";

export class ApiResponse<T> {
  success: boolean;
  data: T;
  error: errorMessage[] | errorMessage | null;

  constructor(
    success: boolean,
    data: T,
    error: errorMessage[] | errorMessage | null,
  ) {
    this.success = success;
    this.data = data;
    this.error = error;
  }
}

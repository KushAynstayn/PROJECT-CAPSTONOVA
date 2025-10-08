// (MODIFIED)
// Location: frontend/src/lib/api.ts
import { authStore } from "./auth";

const API_BASE = "http://127.0.0.1:8000/api";

// Custom Error class to handle API errors more gracefully
export class ApiError extends Error {
  public status: number;
  public details: any;

  constructor(message: string, status: number, details: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const formHeaders = {
  Accept: "application/json",
};

export const apiCall = async (
  path: string,
  method: string = "GET",
  body?: any,
  isForm: boolean = false
) => {
  const headers: { [key: string]: string } = {
    ...(isForm ? formHeaders : defaultHeaders),
  };

  const token = authStore.getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    if (isForm) {
      options.body = body;
    } else {
      options.body = JSON.stringify(body);
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
    }
  }

  const response = await fetch(`${API_BASE}${path}`, options);

  if (response.status === 401) {
    authStore.clearAuth();
    throw new ApiError("Unauthorized", 401, {
      message: "Please log in again.",
    });
  }

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    // Throw a custom error with status and details
    throw new ApiError(
      errorData.message || "An error occurred during the API call.",
      response.status,
      errorData.errors || {}
    );
  }

  return await response.json();
};

// [NEW FUNCTION] A new function for fetching blobs (like images)
export const apiCallForBlob = async (path: string): Promise<Blob> => {
  const headers: { [key: string]: string } = {};

  const token = authStore.getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method: "GET",
    headers,
  };

  const response = await fetch(`${API_BASE}${path}`, options);

  if (response.status === 401) {
    authStore.clearAuth();
    throw new ApiError("Unauthorized", 401, {
      message: "Please log in again.",
    });
  }

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new ApiError(
      errorData.message || "An error occurred during the API call.",
      response.status,
      errorData.errors || {}
    );
  }

  return await response.blob();
};

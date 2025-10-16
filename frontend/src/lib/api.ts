// Location: frontend/src/lib/api.ts
import { authStore } from "./auth";

const ROOT_URL = "http://localhost:8000"; // Use localhost to match the server
const API_BASE = `${ROOT_URL}/api`;

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

export const initializeCsrf = async () => {
  try {
    await fetch(`${ROOT_URL}/sanctum/csrf-cookie`, {
      credentials: "include",
    });
  } catch (error) {
    console.error("Could not initialize CSRF cookie", error);
  }
};

// Helper function to read a cookie from the browser
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
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

  // As per docs, fetch needs the X-XSRF-TOKEN header set manually.
  const csrfToken = getCookie("XSRF-TOKEN");
  if (csrfToken) {
    headers["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
  }

  const options: RequestInit = {
    method,
    headers,
    credentials: "include",
  };

  if (body) {
    if (isForm) {
      options.body = body;
    } else {
      options.body = JSON.stringify(body);
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
    throw new ApiError(
      errorData.message || "An error occurred",
      response.status,
      errorData
    );
  }

  if (response.status === 204) {
    return;
  }

  return await response.json();
};

// No changes needed for apiCallForBlob, the logic is the same.
export const apiCallForBlob = async (path: string): Promise<Blob> => {
  const headers: { [key: string]: string } = {};

  const csrfToken = getCookie("XSRF-TOKEN");
  if (csrfToken) {
    headers["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
  }

  const options: RequestInit = {
    method: "GET",
    headers,
    credentials: "include",
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
      errorData.message || "An error occurred",
      response.status,
      errorData
    );
  }

  return await response.blob();
};

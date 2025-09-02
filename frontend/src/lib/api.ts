import { authStore } from "./auth";

const API_BASE = "http://127.0.0.1:8000/api";

// Default headers for JSON data
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
    options.body = isForm ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, options);

  if (response.status === 401) {
    authStore.clearAuth();

    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || "An error occurred");
  }

  return await response.json();
};

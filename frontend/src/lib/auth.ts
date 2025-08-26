// lib/auth.ts
import { apiCall } from "./api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

class AuthStore {
  private user: User | null = null;
  private token: string | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        this.user = JSON.parse(storedUser);
        this.token = storedToken;
      }
    }
  }

  setAuth(user: User, token: string) {
    this.user = user;
    this.token = token;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  }

  getUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  clearAuth() {
    this.user = null;
    this.token = null;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiCall("/auth/login", "POST", { email, password });
    this.setAuth(response.user, response.token);
    return response;
  }

  async logout(): Promise<void> {
    await apiCall("/auth/logout", "POST");
    this.clearAuth();
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<LoginResponse> {
    const response = await apiCall("/auth/register", "POST", {
      name,
      email,
      password,
    });
    this.setAuth(response.user, response.token);
    return response;
  }
}

export const authStore = new AuthStore();

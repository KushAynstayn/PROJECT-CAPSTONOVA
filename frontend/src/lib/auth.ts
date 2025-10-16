import { apiCall, initializeCsrf } from "./api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  user: User;
  two_factor_required?: boolean;
}

interface TwoFactorResponse {
  user: User;
}

class AuthStore {
  private user: User | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    }
  }

  setAuth(user: User) {
    this.user = user;
    localStorage.setItem("user", JSON.stringify(user));
  }

  getUser(): User | null {
    return this.user;
  }

  clearAuth() {
    this.user = null;
    localStorage.removeItem("user");
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  async login(
    email: string,
    password: string,
    remember: boolean // <-- ADD 'remember' PARAMETER
  ): Promise<LoginResponse> {
    await initializeCsrf();

    // Pass 'remember' in the request body
    const response = await apiCall("/auth/login", "POST", {
      email,
      password,
      remember,
    });
    if (!response.two_factor_required) {
      this.setAuth(response.user);
    }
    return response;
  }

  async verifyTwoFactor(
    email: string,
    code: string
  ): Promise<TwoFactorResponse> {
    const response = await apiCall("/auth/verify-2fa", "POST", { email, code });
    this.setAuth(response.user);
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
    this.setAuth(response.user);
    return response;
  }
}

export const authStore = new AuthStore();

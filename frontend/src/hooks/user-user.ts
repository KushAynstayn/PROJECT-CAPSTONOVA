"use client";

import { useState, useEffect } from "react";
import { apiCall } from "@/lib/api";

// Represents the clean user object used throughout the UI
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Represents the raw user object from the backend
interface BackendUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        // Fetch the raw user data from the backend
        const backendUserData: BackendUser = await apiCall(
          "/user/profile",
          "GET"
        );

        // Transform it into the clean format our UI expects
        if (backendUserData) {
          const transformedUser: User = {
            id: backendUserData.id.toString(),
            name: `${backendUserData.first_name} ${backendUserData.last_name}`.trim(),
            email: backendUserData.email,
            role: backendUserData.role,
          };
          setUser(transformedUser);
        }
      } catch (err) {
        setError(err as Error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, isLoading, error };
}

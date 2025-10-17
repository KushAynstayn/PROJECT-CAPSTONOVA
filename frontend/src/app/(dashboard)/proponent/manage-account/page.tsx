"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react"; // Import Suspense
import { useRouter } from "next/navigation";
import { authStore } from "@/lib/auth";
import { apiCall, ApiError } from "@/lib/api";
import { ProponentManageAccountForm } from "@/components/proponent/manage-account-form";

// Define the User interface
interface User {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  user_detail?: {
    department: string; // Changed back from 'course' to 'department'
    program: string;
  };
}

const ManageAccountPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [originalData, setOriginalData] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!authStore.isAuthenticated()) {
      router.push("/login");
      return;
    }
    try {
      const userData = await apiCall("/user/profile");
      setUser(userData);
      const initialFormData = {
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        middle_name: userData.middle_name || "",
        department: userData.user_detail?.department || "", // Changed back from 'course'
        program: userData.user_detail?.program || "",
        password: "",
        password_confirmation: "",
      };
      setFormData(initialFormData);
      setOriginalData(initialFormData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch profile.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { id: string; value: string } }
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const payload: any = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== originalData[key] && formData[key] !== "") {
          payload[key] = formData[key];
        }
      });

      if (Object.keys(payload).length > 0) {
        await apiCall("/user/profile", "PUT", payload);
        fetchProfile(); // Re-fetch to get updated data
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authStore.logout();
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Logout failed.");
    }
  };

  const hasChanged = JSON.stringify(formData) !== JSON.stringify(originalData);

  if (isLoading) {
    return <div>Loading...</div>; // This loading state handles the data fetch
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <main>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-5xl center rounded-md border border-gray-300 shadow-md overflow-hidden bg-white text-gray-900">
          <div className="h-35 w-full relative p-0">
            <img
              src="/images/hands.jpg"
              alt="A collage of hands working together on a project"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleLogout}
              className="absolute top-full right-4 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-300 transition-transform active:scale-95"
            >
              <img
                src="/images/logout.png"
                className="w-10 h-10"
                alt="logout"
              />
            </button>
          </div>

          <div className="flex flex-col items-center mt-4">
            <h1 className="text-[#800000] text-3xl font-bold">
              {user
                ? `${user.first_name} ${user.middle_name || ""} ${
                    user.last_name
                  }`
                : "Proponent"}
            </h1>
            <h1 className="text-gray-700">{user?.email}</h1>
          </div>

          <div className="pt-8 p-6">
            {/* Wrap the component using useSearchParams in Suspense */}
            <Suspense
              fallback={<div>Loading form...</div>} // This fallback handles the Suspense
            >
              <ProponentManageAccountForm
                formData={formData}
                onFormChange={handleFormChange}
                onSubmit={handleUpdate}
                onClear={() => setFormData(originalData)}
                hasChanged={hasChanged}
                isLoading={isLoading} // This prop is for the button loading state
              />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ManageAccountPage;

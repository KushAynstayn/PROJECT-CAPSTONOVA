"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditProfile from "../../../../components/settings/editprofile";
import { apiCall, ApiError } from "@/lib/api";
import { authStore } from "@/lib/auth";

// Define the User interface based on your API response
interface User {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  email: string;
  id_number: string;
  user_detail?: {
    department: string;
  };
}

const AdviserSettingsPage = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [originalData, setOriginalData] = useState<any>({});
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchProfile = useCallback(async () => {
    if (!authStore.isAuthenticated()) {
      router.push("/login");
      return;
    }
    setIsLoading(true);
    try {
      const userData = await apiCall("/user/profile");
      setUser(userData);
      // MODIFIED: Removed unnecessary fields from initial state
      const initialFormData = {
        first_name: userData.first_name || "",
        middle_name: userData.middle_name || "",
        last_name: userData.last_name || "",
        userType: "Adviser",
        email: userData.email || "",
        newPassword: "",
        confirmPassword: "",
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleEditClick = () => {
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleSaveChanges = async () => {
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setError("New passwords do not match!");
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload: any = {};
    if (formData.first_name !== originalData.first_name)
      payload.first_name = formData.first_name;
    if (formData.last_name !== originalData.last_name)
      payload.last_name = formData.last_name;
    if (formData.middle_name !== originalData.middle_name)
      payload.middle_name = formData.middle_name;
    if (formData.newPassword) {
      payload.password = formData.newPassword;
      payload.password_confirmation = formData.confirmPassword;
    }

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      setIsLoading(false);
      return;
    }

    try {
      await apiCall("/user/profile", "PUT", payload);
      await fetchProfile();
      setIsEditing(false);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during update.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // FIXED: Removed the `(prev)` callback to prevent TypeScript errors.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (fieldName: string, value: string) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const handleLogout = async () => {
    try {
      await authStore.logout();
      router.push("/login");
    } catch (error) {
      setError("Logout failed. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 sm:pt-8 sm:px-8 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden relative">
        <div className="relative w-full h-40">
          <Image
            src="/images/ctubldg.png"
            alt="Cebu Technological University Main Campus Building"
            className="w-full h-full object-cover"
            fill
            priority
          />
        </div>

        {!isEditing && (
          <div ref={menuRef} className="absolute top-[168px] right-4 z-10">
            <div
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="cursor-pointer p-2 rounded-full hover:bg-gray-100"
            >
              <Image
                src="/images/dots_icon.png"
                alt="More options"
                width={24}
                height={24}
              />
            </div>
            {isMenuOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    onClick={handleEditClick}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-8 md:p-12">
          {isEditing ? (
            <EditProfile
              formData={formData}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onSave={handleSaveChanges}
              onCancel={handleCancel}
              isAdviser={true}
            />
          ) : (
            <ViewProfile userData={formData} />
          )}
        </div>
      </div>
    </div>
  );
};

// --- Sub-component for Viewing Profile ---
const ViewProfile = ({ userData }: { userData: any }) => {
  const fullName = [
    userData.first_name,
    userData.middle_name,
    userData.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <h1 className="text-center text-3xl font-serif tracking-wider text-gray-800 mb-1">
        {fullName}
      </h1>
      <p className="text-center text-lg text-gray-500">Adviser</p>
      <div className="border-t my-8"></div>
      {/* MODIFIED: Simplified to show only the email field. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div>
          <Label className="text-sm font-medium text-gray-600">CTU Email</Label>
          <Input
            value={userData.email}
            readOnly
            className="w-full mt-2 border-gray-300 rounded-md bg-gray-50 cursor-default"
          />
        </div>
      </div>
    </>
  );
};

export default AdviserSettingsPage;

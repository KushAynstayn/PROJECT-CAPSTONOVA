"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditSuperAdminProfile from "../../../../components/settings/edit-super-admin";
import { apiCall, ApiError } from "@/lib/api";
import { authStore } from "@/lib/auth";

// Define the User and FormData interfaces for type safety
interface User {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  email: string;
}

interface SuperAdminFormData {
  email: string;
  newPassword?: string;
  confirmPassword?: string;
}

const SuperAdminSettingsPage = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<SuperAdminFormData>>({});
  const [originalData, setOriginalData] = useState<Partial<SuperAdminFormData>>(
    {}
  );
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchProfile = useCallback(async () => {
    if (
      !authStore.isAuthenticated() ||
      authStore.getUser()?.role.toLowerCase() !== "super admin"
    ) {
      router.push("/login");
      return;
    }
    setIsLoading(true);
    try {
      const userData = await apiCall("/user/profile");
      setUser(userData);
      const initialFormData = {
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

    const payload: { [key: string]: string | null } = {};

    if (formData.newPassword && formData.confirmPassword) {
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
      await fetchProfile(); // Re-fetch profile to show updated data
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogout = async () => {
    try {
      await authStore.logout();
      router.push("/login");
    } catch (error) {
      setError("Logout failed. Please try again.");
    }
  };

  if (isLoading)
    return <div className="text-center p-8">Loading profile...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  const fullName = user
    ? [user.first_name, user.middle_name, user.last_name]
        .filter(Boolean)
        .join(" ")
    : "Super Admin";

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
                <div className="origin-top-right absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-md">                <div className="py-1">
                  <button
                    onClick={handleEditClick}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-[#660000] hover:text-white rounded-md"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-[#660000] hover:text-white rounded-md"
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
            <EditSuperAdminProfile
              formData={formData}
              onInputChange={handleInputChange}
              onSave={handleSaveChanges}
              onCancel={handleCancel}
            />
          ) : (
            <>
              <h1 className="text-center text-3xl font-serif tracking-wider text-gray-800 mb-1">
                {fullName}
              </h1>
              {/* Email is now here */}
              <p className="text-center text-md text-gray-500 mb-2">
                {formData.email}
              </p>
              <p className="text-center text-lg text-gray-500">Super Admin</p>
              <div className="border-t my-8"></div>
              {/* The old email section is removed */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSettingsPage;
"use client";

import React, { useState } from "react"; // <-- IMPORT useState
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react"; // <-- IMPORT ICONS

interface EditProfileProps {
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditSuperAdminProfile: React.FC<EditProfileProps> = ({
  formData,
  onInputChange,
  onSave,
  onCancel,
}) => {
  // --- ADD STATE FOR PASSWORD VISIBILITY ---
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <h1 className="text-center text-3xl font-serif tracking-wider text-gray-800 mb-1">
        Edit Profile
      </h1>
      <p className="text-center text-lg text-gray-500">
        Update your information
      </p>
      <div className="border-t my-8"></div>

      <div className="space-y-8">
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-600">
            CTU Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            readOnly
            className="w-full mt-2 border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="mt-10 pt-6 border-t">
        <h2 className="text-gray-700 mb-6">
          Change Password
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          {/* --- MODIFIED NEW PASSWORD FIELD --- */}
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative mt-2">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={onInputChange}
                className="w-full border-gray-300 rounded-md pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* --- MODIFIED CONFIRM PASSWORD FIELD --- */}
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative mt-2">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={onInputChange}
                className="w-full border-gray-300 rounded-md pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center mt-12 pt-6 border-t gap-4">
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border-gray-300 text-gray-700"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onSave}
          className="px-6 py-2 bg-[#A42A27] hover:bg-[#8b2220] text-white rounded-md font-semibold"
        >
          Save Changes
        </Button>
      </div>
    </>
  );
};

export default EditSuperAdminProfile;

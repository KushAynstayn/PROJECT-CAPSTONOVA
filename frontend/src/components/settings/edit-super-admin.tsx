"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
}) => (
  <>
    <h1 className="text-center text-3xl font-serif tracking-wider text-gray-800 mb-1">
      Edit Profile
    </h1>
    <p className="text-center text-lg text-gray-500">Update your information</p>
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
      <h2 className="text-xl font-serif tracking-wider text-gray-700 mb-6">
        Change Password
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={onInputChange}
            className="w-full mt-2 border-gray-300 rounded-md"
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={onInputChange}
            className="w-full mt-2 border-gray-300 rounded-md"
          />
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

export default EditSuperAdminProfile;

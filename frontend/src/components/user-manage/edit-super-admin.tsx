"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputWithClear } from "../ui/inputWithClear";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  email: string;
}

interface EditSuperAdminViewProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

const EditSuperAdminView = ({
  user,
  onSave,
  onCancel,
}: EditSuperAdminViewProps) => {
  // State to manage the form data
  const [formData, setFormData] = useState<User>(user);

  const handleClear = (field: string) =>
    setFormData((prev) => ({ ...prev, [field]: "" }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    // Main container with border, rounded corners, and shadow
    <div className="mx-auto max-w-4xl rounded-md border border-gray-300 bg-white shadow-md">
      {/* 1. IMAGE INSERTED HERE */}
      <img
        src="/images/ctubldg.png"
        alt="Header"
        className="w-full rounded-t-lg object-cover"
        style={{ height: "1.3in" }}
      />

      <div className="p-8">
        {/* Centered title with a line underneath */}
        <div className="mb-8">
          <h2 className="text-center font-serif text-2xl uppercase tracking-widest text-gray-700">
            Edit Super Admin Information
          </h2>
          <hr className="mx-auto mt-2 w-1/3 border-t border-gray-300" />
        </div>

        {/* REVISED: Form Fields using a Grid layout */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          {/* First Name */}
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-semibold text-gray-600"
            >
              First Name
            </label>
            <InputWithClear
              id="first_name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              onClear={() => handleClear("first_name")}
              className="rounded-md border-gray-300 shadow-md"
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-semibold text-gray-600"
            >
              Last Name
            </label>
            <InputWithClear
              id="last_name"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              onClear={() => handleClear("last_name")}
              className="rounded-md border-gray-300 shadow-md"
            />
          </div>

          {/* Middle Name */}
          <div className="md:col-span-2">
            <label
              htmlFor="middle_name"
              className="block text-sm font-semibold text-gray-600"
            >
              Middle Name (Optional)
            </label>
            <InputWithClear
              id="middle_name"
              type="text"
              name="middle_name"
              value={formData.middle_name || ""}
              onChange={handleChange}
              onClear={() => handleClear("middle_name")}
              className="rounded-md border-gray-300 shadow-md"
            />
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-600"
            >
              Email
            </label>
            <InputWithClear
              id="email"
              type="email"
              name="email"
              value={formData.email}
              disabled // Field is now disabled
              className="rounded-md border-gray-300 bg-gray-100 shadow-md" // Added bg-gray-100
            />
          </div>
        </div>

        {/* Action Buttons aligned to the right */}
        <div className="mt-8 flex justify-end gap-4">
          <Button
            onClick={handleSave}
            className="bg-[#660000] hover:bg-[#630808] text-white font-semibold px-6 py-2 rounded-full shadow transition-transform duration-200 ease-in-out hover:scale-105"
          >
            Save Changes
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="bg-gray hover:bg-[#630808] border-1 border-gray-300 text-gray-700 hover:text-white font-semibold px-6 py-2 rounded-full shadow transition-transform duration-200 ease-in-out hover:scale-105"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditSuperAdminView;

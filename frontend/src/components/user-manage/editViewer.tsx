"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputWithClear } from "../ui/inputWithClear";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_detail: {
    student_id: string;
    department: string;
    program: string;
  } | null;
}

interface EditViewerViewProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

const EditViewerView = ({ user, onSave, onCancel }: EditViewerViewProps) => {
  const [formData, setFormData] = useState<User>(user);

  // ✅ RE-FIXED: This handler now correctly and explicitly sets 'student_id'
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Check if the field is a user_detail field
    if (name === "student_id") {
      setFormData((prev) => ({
        ...prev,
        user_detail: {
          // Initialize with existing values (or defaults if null)
          department: prev.user_detail?.department || "",
          program: prev.user_detail?.program || "",
          // ✅ THE FIX: Explicitly set 'student_id' instead of using [name]
          student_id: value,
        },
      }));
    } else {
      // This handles first_name, last_name (email is disabled)
      setFormData((prev) => ({ ...prev, [name]: value as never }));
    }
  };

  // ✅ This handler remains correct and null-safe
  const handleSelectChange = (
    fieldName: keyof NonNullable<User["user_detail"]>,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      user_detail: {
        // Initialize with existing values (or defaults if null)
        student_id: prev.user_detail?.student_id || "",
        department: prev.user_detail?.department || "",
        program: prev.user_detail?.program || "",
        // This is correct because 'fieldName' is strongly typed
        [fieldName]: value,
      },
    }));
  };

  // ✅ This handler remains correct and null-safe
  const handleClear = (field: string) => {
    if (field === "student_id") {
      setFormData((prev) => ({
        ...prev,
        user_detail: {
          student_id: "", // Set this field to empty
          department: prev.user_detail?.department || "", // Keep others
          program: prev.user_detail?.program || "", // Keep others
        },
      }));
    } else {
      // This handles first_name, last_name
      setFormData((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg border border-gray-400 bg-white shadow-xl">
      <img
        src="/images/ctubldg.png"
        alt="Header"
        className="w-full rounded-t-lg object-cover"
        style={{ height: "1.3in" }}
      />
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-center font-serif text-2xl uppercase tracking-widest text-gray-700">
            Edit Information
          </h2>
          <hr className="mx-auto mt-2 w-1/3 border-t border-gray-300" />
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
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
              onChange={handleInputChange}
              onClear={() => handleClear("first_name")}
              className="rounded-md border-gray-300 shadow-md"
            />
          </div>
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
              onChange={handleInputChange}
              onClear={() => handleClear("last_name")}
              className="rounded-md border-gray-300 shadow-md"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-600"
            >
              CTU Email
            </label>
            <InputWithClear
              id="email"
              type="email"
              name="email"
              value={formData.email}
              disabled // Email field is disabled
              className="rounded-md border-gray-300 bg-gray-100 shadow-md"
            />
          </div>
          <div>
            <label
              htmlFor="student_id"
              className="block text-sm font-semibold text-gray-600"
            >
              ID Number
            </label>
            <InputWithClear
              id="student_id"
              type="text"
              name="student_id"
              value={formData.user_detail?.student_id || ""}
              onChange={handleInputChange}
              onClear={() => handleClear("student_id")}
              className="rounded-md border-gray-300 shadow-md"
            />
          </div>
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-semibold text-gray-600"
            >
              Department
            </label>
            <Select
              value={formData.user_detail?.department || ""}
              onValueChange={(value) => handleSelectChange("department", value)}
            >
              <SelectTrigger className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-md">
                <SelectValue placeholder="Select a Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BSIS">BSIS</SelectItem>
                <SelectItem value="BSIT">BSIT</SelectItem>
                <SelectItem value="BIT-CT">BIT-CT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label
              htmlFor="program"
              className="block text-sm font-semibold text-gray-600"
            >
              Program Schedule
            </label>
            <Select
              value={formData.user_detail?.program || ""}
              onValueChange={(value) => handleSelectChange("program", value)}
            >
              <SelectTrigger className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-md">
                <SelectValue placeholder="Select Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Day">Day Program</SelectItem>
                <SelectItem value="Evening">Evening Program</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-end gap-x-4">
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

export default EditViewerView;

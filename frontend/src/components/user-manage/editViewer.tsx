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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "student_id") {
      setFormData((prev) => ({
        ...prev,
        user_detail: { ...prev.user_detail!, student_id: value },
      }));
    } else if (name in (formData.user_detail || {})) {
      setFormData((prev) => ({
        ...prev,
        user_detail: { ...prev.user_detail!, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value as never }));
    }
  };

  const handleSelectChange = (
    fieldName: keyof NonNullable<User["user_detail"]>,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      user_detail: { ...prev.user_detail!, [fieldName]: value },
    }));
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
          <hr className="mx-auto mt-2 w-1/3 border-t border-gray-400" />
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-semibold text-gray-600"
            >
              First Name
            </label>
            <input
              id="first_name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-semibold text-gray-600"
            >
              Last Name
            </label>
            <input
              id="last_name"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-600"
            >
              CTU Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
            />
          </div>
          <div>
            <label
              htmlFor="student_id"
              className="block text-sm font-semibold text-gray-600"
            >
              ID Number
            </label>
            <input
              id="student_id"
              type="text"
              name="student_id"
              value={formData.user_detail?.student_id || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
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
              <SelectTrigger className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]">
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
              <SelectTrigger className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]">
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
            variant="outline"
            onClick={onCancel}
            className="border-gray-400 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="border border-black/50 bg-[#8B0000] text-white shadow-md hover:bg-[#7a0000]"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditViewerView;

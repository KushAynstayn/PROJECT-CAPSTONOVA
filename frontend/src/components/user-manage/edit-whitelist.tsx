"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputWithClear } from "@/components/ui/inputWithClear";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WhitelistItem } from "./view-whitelist";

interface EditWhitelistProps {
  item: WhitelistItem;
  onSave: (updatedItem: WhitelistItem) => void;
  onCancel: () => void;
}

const EditWhitelist: React.FC<EditWhitelistProps> = ({
  item,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<WhitelistItem>(item);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as "Admin" | "Adviser" }));
  };

  const handleClear = (field: keyof WhitelistItem) => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="mx-auto max-w-2xl rounded-md border border-gray-300 bg-white shadow-md">
      {/* Header Image */}
      <img
        src="/images/ctubldg.png"
        alt="Header"
        className="w-full rounded-t-lg object-cover"
        style={{ height: "1.3in" }}
      />

      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-center font-serif text-2xl uppercase tracking-widest text-gray-700">
            Edit Whitelist Entry
          </h2>
          <hr className="mx-auto mt-2 w-1/3 border-t border-gray-300" />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Faculty ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Faculty ID
            </label>
            <InputWithClear
              name="faculty_id"
              value={formData.faculty_id}
              onChange={handleChange}
              onClear={() => handleClear("faculty_id")}
              className="rounded-md border-gray-300 shadow-md"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Role
            </label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-full rounded-md border-gray-300 shadow-md">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Adviser">Adviser</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Email Address
            </label>
            <InputWithClear
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onClear={() => handleClear("email")}
              className="rounded-md border-gray-300 shadow-md"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button
            onClick={() => onSave(formData)}
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

export default EditWhitelist;

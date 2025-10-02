"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { apiCall } from "@/lib/api";
import { InputWithClear } from "../ui/inputWithClear";

// The WhitelistEntry interface now uses a number for student_id to align with the backend.
interface WhitelistEntry {
  whitelist_id: number;
  student_id: number;
  student_email: string;
  adviser_id: number;
}

// The incoming user prop might have student_id as a string from the form state.
interface WhitelistEditData {
  whitelist_id: number;
  student_id: string;
  student_email: string;
  adviser_id: number;
}

interface Adviser {
  id: number;
  full_name: string;
}

interface EditWhitelistViewProps {
  user: WhitelistEditData;
  onSave: (updatedUser: WhitelistEntry) => void;
  onCancel: () => void;
}

const EditWhitelistView = ({
  user,
  onSave,
  onCancel,
}: EditWhitelistViewProps) => {
  // The form state will keep student_id as a string for input field compatibility.
  const [formData, setFormData] = useState<WhitelistEditData>(user);
  const [advisers, setAdvisers] = useState<Adviser[]>([]);

  useEffect(() => {
    const fetchAdvisers = async () => {
      try {
        const response = await apiCall("/util/advisers");
        if (response.success) {
          setAdvisers(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch advisers:", error);
      }
    };
    fetchAdvisers();
  }, []);

   const handleClear = (field: string) =>
    setFormData((prev) => ({ ...prev, [field]: "" }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdviserChange = (adviserId: string) => {
    setFormData((prev) => ({ ...prev, adviser_id: parseInt(adviserId, 10) }));
  };

  const handleSave = () => {
    // Convert student_id to a number before saving, as the backend expects an integer.
    onSave({
      ...formData,
      student_id: parseInt(formData.student_id, 10),
    });
  };

  return (
    <div className="mx-auto max-w-4xl rounded-md border border-gray-300 bg-white shadow-md">
      <img
        src="/images/hands.jpg"
        alt="Header"
        className="w-full rounded-t-lg object-cover"
        style={{ height: "1.3in" }}
      />
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-center font-serif text-2xl uppercase tracking-wider text-gray-700">
            Edit Whitelist Information
          </h2>
          <hr className="mx-auto mt-2 w-1/3 border-t border-gray-300" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <div className="flex-1">
              <label
                htmlFor="student_email"
                className="block text-sm font-semibold text-gray-600"
              >
                Email
              </label>
              <InputWithClear
                id="student_email"
                type="email"
                name="student_email"
                value={formData.student_email}
                onChange={handleChange}
                onClear={() => handleClear("student_email")}
                className="rounded-md border-gray-300 shadow-md"
              />
            </div>
            <div className="flex-1">
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
                value={formData.student_id}
                onChange={handleChange}
                onClear={() => handleClear("student_id")}
                className="rounded-md border-gray-300 shadow-md"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <label
                htmlFor="adviser_id"
                className="block text-sm font-semibold text-gray-600"
              >
                Adviser
              </label>
              <SearchableCombobox
                value={
                  formData.adviser_id ? formData.adviser_id.toString() : ""
                }
                onValueChange={handleAdviserChange}
                className="rounded-md border-gray-300 shadow-md"
                items={advisers.map((adv) => ({
                  value: adv.id.toString(),
                  label: adv.full_name,
                }))}
                placeholder="Select Adviser"
              />
            </div>
          </div>
        </div>
        <div className="mt-8 flex items-center gap-2 justify-center">
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
export default EditWhitelistView;

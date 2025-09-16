"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { apiCall } from "@/lib/api";

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
    <div className="mx-auto max-w-4xl rounded-lg border border-gray-400 bg-white shadow-xl">
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
          <hr className="mx-auto mt-2 w-1/3 border-t border-gray-400" />
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
              <input
                id="student_email"
                type="email"
                name="student_email"
                value={formData.student_email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f] font-normal"
              />
            </div>
            <div className="flex-1">
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
                value={formData.student_id}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f] font-normal"
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
                items={advisers.map((adv) => ({
                  value: adv.id.toString(),
                  label: adv.full_name,
                }))}
                placeholder="Select Adviser"
              />
            </div>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between">
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
export default EditWhitelistView;

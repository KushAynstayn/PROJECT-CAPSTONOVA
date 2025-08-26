"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

// Corrected the User interface to be consistent with other files
interface User {
  id: number;
  name: string;
  idNumber: string;
  email: string;
  branch: string;
  department: string;
}

interface EditAdminViewProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

const EditAdminView = ({ user, onSave, onCancel }: EditAdminViewProps) => {
  // State to manage the form data
  const [formData, setFormData] = useState<User>(user);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    onSave(formData);
  };

  // Dummy data for comboboxes
  const branches = ["BSIS", "BSIT", "BIT-CT"];
  const departments = ["CCICT", "COT-D", "COT-E", "CME", "CAS", "COE", "COeD"];

  return (
    // Main container with border, rounded corners, and shadow
    <div className="mx-auto max-w-4xl rounded-lg border border-gray-400 bg-white shadow-xl">
      {/* 1. IMAGE INSERTED HERE */}
      <img
        src="/images/hands.jpg"
        alt="Header"
        className="w-full rounded-t-lg object-cover"
        style={{ height: "1.3in" }}
      />

      <div className="p-8">
        {/* Centered title with a line underneath */}
        <div className="mb-8">
          <h2 className="text-center font-serif text-2xl uppercase tracking-widest text-gray-700">
            Edit Admin Information
          </h2>
          <hr className="mx-auto mt-2 w-1/3 border-t border-gray-400" />
        </div>

        {/* REVISED: Form Fields using a Flexbox layout */}
        <div className="flex flex-col gap-4">
          {/* Row 1: Full Name and ID Number */}
          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <div className="flex-1">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-600">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="idNumber" className="block text-sm font-semibold text-gray-600">
                ID Number
              </label>
              <input
                id="idNumber"
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
              />
            </div>
          </div>

          {/* Row 2: Email and Branch */}
          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <div className="flex-1">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="branch" className="block text-sm font-semibold text-gray-600">
                Branch
              </label>
              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
              >
                <option value="">Select a Branch</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Department field in the middle */}
          <div className="flex justify-center">
            <div className="w-full md:w-1/2">
              <label htmlFor="department" className="block text-sm font-semibold text-gray-600">
                Department
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
              >
                <option value="">Select a Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons with distinct styling and layout */}
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

export default EditAdminView;

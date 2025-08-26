"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

// Define a type for the user object for type safety
interface User {
  id: number;
  name: string;
  email: string;
  idNumber: string;
  course: string;
  adviser: string;
}

interface EditProponentViewProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

const EditProponentView = ({
  user,
  onSave,
  onCancel,
}: EditProponentViewProps) => {
  // State to manage the form data
  const [formData, setFormData] = useState<User>(user);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

  const handleSave = () => {
    onSave(formData);
  };

  const advisers = ["Monkey Luffy", "Roronoa Zoro", "Sanji Vinsmoke-CT", "Trafalgar Law", "Nico Robin", "Rob Lucci","Dracule Mihawk" ];

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
            Edit Proponent Information
          </h2>
          <hr className="mx-auto mt-2 w-1/3 border-t border-gray-400" />
        </div>

        {/* Form Fields using a grid layout for alignment */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          {/* 2. REVISED LAYOUT for Full Name and Email using Flexbox */}
          <div>
            <label
              htmlFor="idNumber"
              className="block text-sm font-semibold text-gray-600"
            >
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

          <div>
            <label
              htmlFor="idNumber"
              className="block text-sm font-semibold text-gray-600"
            >
              CTU Email
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

          {/* ID Number and Course remain the same as they align correctly in the grid */}
          <div>
            <label
              htmlFor="idNumber"
              className="block text-sm font-semibold text-gray-600"
            >
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

          <div>
            <label
              htmlFor="course"
              className="block text-sm font-semibold text-gray-600"
            >
              Course
            </label>
            <input
              id="course"
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
            />
          </div>

          <div className="md:col-span-2 w-1/2 flex flex-col items-left ml-50">
            <label
              htmlFor="adviser"
              className="block text-sm font-semibold text-gray-600"
            >
              Adviser
            </label>
           <select
                id="adviser"
                name="adviser"
                value={formData.adviser}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
              >
                <option value="">Select a Branch</option>
                {advisers.map(adviser => (
                  <option key={adviser} value={adviser}>{adviser}</option>
                ))}
              </select>
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

export default EditProponentView;

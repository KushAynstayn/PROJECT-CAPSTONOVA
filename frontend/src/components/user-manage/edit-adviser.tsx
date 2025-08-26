"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

// Corrected the User interface to be consistent with other files
interface User {
  id: number;
  name: string;
  idNumber: string;
  email: string;
  numberOfAdvisees: string;
}

interface EditAdviserViewProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

const EditAdviserView = ({ user, onSave, onCancel }: EditAdviserViewProps) => {
  // State to manage the form data
  const [formData, setFormData] = useState<User>(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // For number input, ensure value is parsed correctly
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfAdvisees" ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

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
            Edit Adviser Information
          </h2>
          <hr className="mx-auto mt-2 w-1/3 border-t border-gray-400" />
        </div>

        {/* Form Fields using a grid layout for alignment */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          {/* REVISED LAYOUT for Full Name and Email using Flexbox */}
          <div>
            <label
              htmlFor="name"
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
              htmlFor="email"
              className="block text-sm font-semibold text-gray-600"
            >
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

          {/* Add a field for numberOfAdvisees */}
          <div>
            <label
              htmlFor="numberOfAdvisees"
              className="block text-sm font-semibold text-gray-600"
            >
              Number of Advisees
            </label>
            <input
              id="numberOfAdvisees"
              type="number"
              name="numberOfAdvisees"
              value={formData.numberOfAdvisees}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
            />
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

export default EditAdviserView;

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/ui/combobox";

// Define a type for the user object for type safety
interface User {
  id: number;
  firstName: string;
  lastName: string;
  idNumber: string;
  email: string;
  adviser: string;
  schedule: string;
}

interface EditWhitelistViewProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

const EditWhitelistView = ({ user, onSave, onCancel }: EditWhitelistViewProps) => {
  // State to manage the form data
  const [formData, setFormData] = useState<User>(user);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> // REVISED: Change to handle select events
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    onSave(formData);
  };
  
  // REVISED: Using simple string arrays as shown in the screenshot's UI.
  const advisers = [
    "Samantha Jones",
    "Michael Chen",
    "Emily Carter",
    "David Rodriguez",
    "Jessica Lee",
    "Daniel Kim",
    "Olivia Brown",
  ];
  
  const schedules = [
    "Day Program",
    "Evening Program",
  ];

  return (
    // Main container with border, rounded corners, and shadow
    <div className="mx-auto max-w-4xl rounded-lg border border-gray-400 bg-white shadow-xl">
      
      {/* 1. IMAGE INSERTED HERE */}
      <img
        src="/images/hands.jpg"
        alt="Header"
        className="w-full rounded-t-lg object-cover"
        style={{ height: '1.3in' }}
      />
      
      <div className="p-8">
        {/* Centered title with a line underneath */}
        <div className="mb-8">
          <h2 className="text-center font-serif text-2xl uppercase tracking-widest text-gray-700">
            Edit Whitelist Information
          </h2>
          <hr className="mx-auto mt-2 w-1/3 border-t border-gray-400" />
        </div>

        {/* REVISED: Form Fields using a Flexbox layout */}
        <div className="flex flex-col gap-4">
          {/* Row 1: First and Last Name */}
          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <div className="flex-1">
              <label htmlFor="firstName" className="block text-sm font-semibold text-gray-600">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f] font-normal"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="block text-sm font-semibold text-gray-600">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f] font-normal"
              />
            </div>
          </div>

          {/* Row 2: ID Number and Email */}
          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
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
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f] font-normal"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-600">
                CTU Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f] font-normal"
              />
            </div>
          </div>
          
          {/* Row 3: Adviser and Class Program fields */}
          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <div className="flex-1">
              <label htmlFor="adviser" className="block text-sm font-semibold text-gray-600">
                Adviser
              </label>
              <select
                id="adviser"
                name="adviser"
                value={formData.adviser}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f] font-normal"
              >
                <option value="">Select Adviser</option>
                {advisers.map((adviser) => (
                  <option key={adviser} value={adviser}>
                    {adviser}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="schedule" className="block text-sm font-semibold text-gray-600">
                Class Program
              </label>
              <select
                id="schedule"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f] font-normal"
              >
                <option value="">Select Program</option>
                {schedules.map((schedule) => (
                  <option key={schedule} value={schedule}>
                    {schedule}
                  </option>
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
export default EditWhitelistView;

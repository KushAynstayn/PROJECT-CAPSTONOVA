"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
// Import the Select components from your UI library
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define a type for the user object for type safety
interface User {
  id: number;
  name: string;
  email: string;
  idNumber: string;
  course: string;
  dateRequested: string;
  // Add the new program field to the User interface
  program: string;
}

interface EditGuestViewProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

const EditGuestView = ({ user, onSave, onCancel }: EditGuestViewProps) => {
  // State to manage the form data
  const [formData, setFormData] = useState<User>(user);

  // This handler is for the standard text inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // This new handler is specifically for the ShadCN Select component for Course
  const handleCourseChange = (value: string) => {
    setFormData((prev) => ({ ...prev, course: value }));
  };

  // New handler for the Program Select component
  const handleProgramChange = (value: string) => {
    setFormData((prev) => ({ ...prev, program: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    // Main container with border, rounded corners, and shadow
    <div className="mx-auto max-w-4xl rounded-lg border border-gray-400 bg-white shadow-xl">
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
            Edit Information
          </h2>
          <hr className="mx-auto mt-2 w-1/3 border-t border-gray-400" />
        </div>

        {/* Form Fields using a grid layout for alignment */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          {/* Full Name */}
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
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
            />
          </div>

          {/* CTU Email */}
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

          {/* ID Number */}
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
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
            />
          </div>

          {/* Course Dropdown */}
          <div>
            <label
              htmlFor="course"
              className="block text-sm font-semibold text-gray-600"
            >
              Degree Program
            </label>
            <Select
              value={formData.course}
              onValueChange={handleCourseChange}
            >
              <SelectTrigger className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]">
                <SelectValue placeholder="Select a Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BSIS">BSIS</SelectItem>
                <SelectItem value="BSIT">BSIT</SelectItem>
                <SelectItem value="BIT-CT">BIT-CT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Program Dropdown */}
          <div>
            <label
              htmlFor="program"
              className="block text-sm font-semibold text-gray-600"
            >
              Program Schedule
            </label>
            <Select
              value={formData.program}
              onValueChange={handleProgramChange}
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

        {/* Action Buttons with updated layout */}
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

export default EditGuestView;

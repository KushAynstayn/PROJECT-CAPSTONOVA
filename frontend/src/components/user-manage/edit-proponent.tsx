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
// Added the new fields to the interface
interface User {
  id: number;
  name: string;
  email: string;
  idNumber: string;
  course: string;
  adviser: string;
  capstoneTitle: string; // New field
  groupName: string;      // New field
  program: string;        // New field
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
  // State to manage the form data, now includes the new fields
  const [formData, setFormData] = useState<User>(user);

  // Handler for standard text inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for the ShadCN Select components
  const handleSelectChange = (fieldName: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const advisers = ["Monkey Luffy", "Roronoa Zoro", "Sanji Vinsmoke-CT", "Trafalgar Law", "Nico Robin", "Rob Lucci","Dracule Mihawk" ];
  const courses = ["BSIS", "BSIT", "BIT-CT"];
  const programs = ["Day Program", "Evening Program"];

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
            Edit Proponent Information
          </h2>
          <hr className="mx-auto mt-2 w-1/3 border-t border-gray-400" />
        </div>

        {/* Form Fields using a grid layout for alignment */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          {/* Capstone Project Title (Full Width) - Now Typable */}
          <div className="md:col-span-2">
            <label
              htmlFor="capstoneTitle"
              className="block text-sm font-semibold text-gray-600"
            >
              Capstone Project Title
            </label>
            <input
              id="capstoneTitle"
              type="text"
              name="capstoneTitle"
              value={formData.capstoneTitle}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
            />
          </div>
          
          {/* Group Name (Full Width) - Now Typable */}
          <div className="md:col-span-2">
            <label
              htmlFor="groupName"
              className="block text-sm font-semibold text-gray-600"
            >
              Group Name
            </label>
            <input
              id="groupName"
              type="text"
              name="groupName"
              value={formData.groupName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
            />
          </div>

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
              onValueChange={(value) => handleSelectChange("course", value)}
            >
              <SelectTrigger className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]">
                <SelectValue placeholder="Select a Course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
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
              onValueChange={(value) => handleSelectChange("program", value)}
            >
              <SelectTrigger className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]">
                <SelectValue placeholder="Select a Program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map(program => (
                  <SelectItem key={program} value={program}>{program}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Adviser Dropdown */}
          <div>
            <label
              htmlFor="adviser"
              className="block text-sm font-semibold text-gray-600"
            >
              Adviser
            </label>
            <Select
              value={formData.adviser}
              // THIS LINE IS NOW FIXED
              onValueChange={(value) => handleSelectChange("adviser", value)}
            >
              <SelectTrigger className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]">
                <SelectValue placeholder="Select an Adviser" />
              </SelectTrigger>
              <SelectContent>
                {advisers.map(adviser => (
                  <SelectItem key={adviser} value={adviser}>{adviser}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons with distinct styling and layout */}
        <div className="mt-8 flex justify-end gap-x-4">
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

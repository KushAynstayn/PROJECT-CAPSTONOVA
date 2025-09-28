"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { apiCall } from "@/lib/api";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  student_id: string;
  department: string;
  program: string;
  adviser_id: number | null;
}

interface Adviser {
  id: number;
  full_name: string;
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
  const [formData, setFormData] = useState<User>(user);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (fieldName: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleAdviserChange = (value: string) => {
    const adviserId = parseInt(value, 10);
    setFormData((prev) => ({
      ...prev,
      adviser_id: isNaN(adviserId) ? null : adviserId,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  // This should ideally be fetched from an API
  const courses = ["BSIS", "BSIT", "BIT-CT"];
  const programs = ["Day Program", "Evening Program"];

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
            Edit Proponent Information
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
              value={formData.student_id}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]"
            />
          </div>

          <div>
            <label
              htmlFor="department"
              className="block text-sm font-semibold text-gray-600"
            >
              Degree Program
            </label>
            <Select
              value={formData.department}
              onValueChange={(value) => handleSelectChange("department", value)}
            >
              <SelectTrigger className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]">
                <SelectValue placeholder="Select a Course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
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
              value={formData.program}
              onValueChange={(value) => handleSelectChange("program", value)}
            >
              <SelectTrigger className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-transparent focus:ring-2 focus:ring-[#a7561f]">
                <SelectValue placeholder="Select a Program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="adviser_id"
              className="block text-sm font-semibold text-gray-600"
            >
              Adviser
            </label>
            <SearchableCombobox
              value={formData.adviser_id ? String(formData.adviser_id) : ""}
              onValueChange={handleAdviserChange}
              items={advisers.map((adviser) => ({
                value: String(adviser.id),
                label: adviser.full_name,
              }))}
              placeholder={"Select Adviser"}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-x-4">
          <Button
            onClick={handleSave}
            className="bg-[#660000] hover:bg-[#630808] text-white font-semibold px-6 py-2 rounded-full shadow transition-transform duration-200 ease-in-out hover:scale-105"
          >
            Save Changes
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="bg-gray hover:bg-[#630808] text-gray-700 hover:text-white font-semibold px-6 py-2 rounded-full shadow transition-transform duration-200 ease-in-out hover:scale-105"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProponentView;

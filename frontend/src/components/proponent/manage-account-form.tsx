"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";

// Define the structure of the form data
interface ProponentFormData {
  first_name: string;
  last_name: string;
  middle_name: string;
  department: string; // Changed back from 'course' to 'department'
  program: string;
  password?: string;
  password_confirmation?: string;
}

// Define the props for the component
interface ProponentManageAccountFormProps {
  formData: ProponentFormData;
  onFormChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { id: string; value: string } }
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  hasChanged: boolean;
  isLoading: boolean;
}

export const ProponentManageAccountForm: React.FC<
  ProponentManageAccountFormProps
> = ({ formData, onFormChange, onSubmit, onClear, hasChanged, isLoading }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
        {/* First Name */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            placeholder="Juan"
            value={formData.first_name}
            onChange={onFormChange}
            className="w-full mt-1 border border-gray-300 rounded-md focus:border-gray-400 focus:ring-1 focus:ring-gray-300 outline-none"
          />
        </div>
        {/* Middle Name */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="middle_name">Middle Name (Optional)</Label>
          <Input
            id="middle_name"
            placeholder="Rizal"
            value={formData.middle_name}
            onChange={onFormChange}
            className="w-full mt-1 border border-gray-300 rounded-md focus:border-gray-400 focus:ring-1 focus:ring-gray-300 outline-none"
          />
        </div>
        {/* Last Name */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            placeholder="dela Cruz"
            value={formData.last_name}
            onChange={onFormChange}
            className="w-full mt-1 border border-gray-300 rounded-md focus:border-gray-400 focus:ring-1 focus:ring-gray-300 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Department (labeled as Course) */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="department">Course</Label>
          <Combobox
            value={formData.department}
            onValueChange={(value) =>
              onFormChange({ target: { id: "department", value } })
            }
            items={[
              { value: "BSIS", label: "BSIS" },
              { value: "BSIT", label: "BSIT" },
              { value: "BIT-CT", label: "BIT-CT" },
            ]}
            placeholder={"Select Course"}
          />
        </div>

        {/* Program */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="program">Program (Day or Night)</Label>
          <Combobox
            value={formData.program}
            onValueChange={(value) =>
              onFormChange({ target: { id: "program", value } })
            }
            items={[
              { value: "Day Program", label: "Day Program" },
              { value: "Evening Program", label: "Evening Program" },
            ]}
            placeholder={"Select Program"}
          />
        </div>
      </div>

      {/* Change Password Section */}
      <div className="mt-6 pt-6 border-t">
        <h2 className="text-gray-700 mb-4">
          Change Password
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col">
            <Label htmlFor="password" className="mb-2">New Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password || ""}
              onChange={onFormChange}
              className="w-full border border-gray-300 rounded-md focus:border-gray-400 focus:ring-1 focus:ring-gray-300 outline-none"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="password_confirmation" className="mb-2">Confirm New Password</Label>
            <Input
              id="password_confirmation"
              type="password"
              value={formData.password_confirmation || ""}
              onChange={onFormChange}
              className="w-full border border-gray-300 rounded-md focus:border-gray-400 focus:ring-1 focus:ring-gray-300 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        {hasChanged && (
          <>
            <Button
              type="button"
              onClick={onClear}
              className="bg-gray-200 text-gray-800 rounded-md shadow-md hover:bg-gray-400 hover:text-white"
            >
              Clear Changes
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#660000] text-white rounded-md shadow-md hover:bg-[#4d0000]"
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

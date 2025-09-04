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
            className="rounded-none border-[rgba(0,0,0,0.5)]"
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
            className="rounded-none border-[rgba(0,0,0,0.5)]"
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
            className="rounded-none border-[rgba(0,0,0,0.5)]"
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
        <h2 className="text-xl font-serif tracking-wider text-gray-700 mb-4">
          Change Password
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password || ""}
              onChange={onFormChange}
              className="w-full mt-1 border-gray-300 rounded-md"
            />
          </div>
          <div>
            <Label htmlFor="password_confirmation">Confirm New Password</Label>
            <Input
              id="password_confirmation"
              type="password"
              value={formData.password_confirmation || ""}
              onChange={onFormChange}
              className="w-full mt-1 border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-6">
        {hasChanged && (
          <>
            <Button
              type="button"
              onClick={onClear}
              className="bg-gray-200 text-gray font-serif rounded-md shadow-md hover:bg-[#6b211d] hover:text-white"
            >
              Clear Changes
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white font-serif rounded-md shadow-md hover:bg-blue-700"
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

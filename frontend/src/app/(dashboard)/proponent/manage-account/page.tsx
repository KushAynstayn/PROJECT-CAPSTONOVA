"use client";

import React, { useState, useEffect } from "react";

const accountData = {
  capstone: "AI-Powered Waste Management System",
  groupname: "Eco Warriors",
  adviser: "Sanji Vinsmoke",
  idNumber: "2025-9876",
  department: "CCICT",
  course: "BSIS",
  program: "Day Program",
};

// NOTE: Assuming these are custom components from your project (e.g., using shadcn/ui)
// Since I don't have the code for them, I'll create simple placeholders.

const Separator = ({ className }: { className?: string }) => (
  <div className={`border-t ${className}`}></div>
);
const Button = ({
  onClick,
  className,
  children,
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-semibold rounded-md ${className}`}
  >
    {children}
  </button>
);
const InputWithClear = ({
  id,
  placeholder,
  value,
  onChange,
  onClear,
  className,
  onFocus, // Added onFocus to props
}: {
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  className?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void; // Added onFocus type
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e); // Call parent onFocus if it exists
  };

  return (
    <div className="relative">
      <input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={() => setIsFocused(false)}
        className={`w-full p-2 border ${className}`}
      />
      {value && isFocused && (
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onClear();
          }}
          className="absolute inset-y-0 right-0 px-3 text-gray-500"
        >
          X
        </button>
      )}
    </div>
  );
};

const Combobox = ({
  value,
  onValueChange,
  items,
  placeholder,
  onFocus, // Added onFocus to props
}: {
  value: string;
  onValueChange: (value: string) => void;
  items: { value: string; label: string }[];
  placeholder: string;
  onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void; // Added onFocus type
}) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    onFocus={onFocus} // Attach onFocus to the select element
    className="w-full p-2 border bg-white rounded-none border-[rgba(0,0,0,0.5)]"
  >
    <option value="" disabled>
      {placeholder}
    </option>
    {items.map((item) => (
      <option key={item.value} value={item.value}>
        {item.label}
      </option>
    ))}
  </select>
);

// A simple local component for Label
const Label = ({ htmlFor, className, children }: any) => (
  <label
    htmlFor={htmlFor}
    className={`font-normal text-sm text-gray-700 ${className}`}
  >
    {children}
  </label>
);

// Define the User interface inside this file if it's not already globally defined
interface User {
  capstone: string;
  groupname: string;
  idNumber: string;
  adviser: string;
  department: string;
  course: string;
  program: string;
}

const ManageAccountPage = () => {
  const initialFormState: User = {
    capstone: "",
    groupname: "",
    adviser: "",
    idNumber: "",
    department: "",
    course: "",
    program: "",
  };

  const [formData, setFormData] = useState<User>(initialFormState);
  const [originalData, setOriginalData] = useState<User>(initialFormState);
  // --- State to track if any form input has been touched ---
  const [isFormTouched, setIsFormTouched] = useState(false);

  useEffect(() => {
    setFormData(accountData);
    setOriginalData(accountData);
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAdviserChange = (value: any) => {
    setFormData({ ...formData, adviser: value });
  };

  const handleProgramChange = (value: any) => {
    setFormData({ ...formData, program: value });
  };

  const handleDepartmentChange = (value: any) => {
    setFormData({ ...formData, department: value });
  };

  const handleCourseChange = (value: any) => {
    setFormData({ ...formData, course: value });
  };

  const handleClearAll = () => {
    setFormData(initialFormState);
  };

  const handleClear = (fieldName: any) => {
    setFormData({ ...formData, [fieldName]: "" });
  };

  const handleUpdate = () => {
    console.log("Saving updated data:", formData);
    setOriginalData(formData);
    // --- FIX: Reset the touched state to hide the clear button ---
    setIsFormTouched(false);
  };

  // --- This function will be called once when any input is focused ---
  const handleInitialFocus = () => {
    if (!isFormTouched) {
      setIsFormTouched(true);
    }
  };

  const hasChanged = JSON.stringify(formData) !== JSON.stringify(originalData);

  return (
    <>
      <main>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-5xl center rounded-lg border-black shadow-lg shadow-gray-800/50 overflow-hidden border bg-white text-gray-900">
            <div className="h-35 w-full relative p-0">
              <img
                src="/images/hands.jpg"
                alt="A collage of hands working together on a project"
                className="w-full h-full object-cover"
              />
              {/* Logout Button */}
              <button className="absolute top-full right-4 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-300 transition-transition active:scale-95">
                <img src="/images/logout.png" className="w-10 h-10" />
              </button>
            </div>

            <div className="flex flex-col items-center mt-4">
              <h1 className="text-red-700 text-3xl font-bold">
                Conrad B. Fisher
              </h1>
              <h1 className="text-gray-700">conradbfisher@gmail.com</h1>
            </div>

            <div className="pt-1 p-6">
              <form className="space-y-4">
                {/* Capstone Title - Full Width */}
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="capstone">Capstone Title</Label>
                  <InputWithClear
                    id="capstone"
                    placeholder="E-Commerce Platform for Local Artisans"
                    value={formData.capstone}
                    onChange={handleChange}
                    onClear={() => handleClear("capstone")}
                    onFocus={handleInitialFocus}
                    className="rounded-none border-[rgba(0,0,0,0.5)]"
                  />
                </div>

                {/* Two-Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {/* Group Name */}
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="groupName">Group Name</Label>
                    <InputWithClear
                      id="groupname"
                      placeholder="Pixel Pioneers"
                      value={formData.groupname}
                      onChange={handleChange}
                      onClear={() => handleClear("groupname")}
                      onFocus={handleInitialFocus}
                      className="rounded-none border-[rgba(0,0,0,0.5)]"
                    />
                  </div>

                  {/* Adviser */}
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="adviser">Adviser</Label>
                    <Combobox
                      value={formData.adviser}
                      onValueChange={handleAdviserChange}
                      onFocus={handleInitialFocus}
                      items={[
                        { value: "Monkey Luffy", label: "Monkey Luffy" },
                        { value: "Roronoa Zoro", label: "Roronoa Zoro" },
                        { value: "Sanji Vinsmoke", label: "Sanji Vinsmoke" },
                        { value: "Trafalgar Law", label: "Trafalgar Law" },
                        { value: "Nico Robin", label: "Nico Robin" },
                        { value: "Rob Lucci", label: "Rob Lucci" },
                        { value: "Dracule Mihawk", label: "Dracule Mihawk" },
                      ]}
                      placeholder={"Select Adviser"}
                    />
                  </div>

                  {/* CTU ID Number */}
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="idNumber">CTU ID Number</Label>
                    <InputWithClear
                      id="idNumber"
                      placeholder="123456789"
                      value={formData.idNumber}
                      onChange={handleChange}
                      onClear={() => handleClear("idNumber")}
                      onFocus={handleInitialFocus}
                      className="rounded-none border-[rgba(0,0,0,0.5)]"
                    />
                  </div>

                  {/* Department */}
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="department">Department</Label>
                    <Combobox
                      value={formData.department}
                      onValueChange={handleDepartmentChange}
                      onFocus={handleInitialFocus}
                      items={[
                        { value: "CCICT", label: "CCICT" },
                        { value: "CME", label: "CME" },
                        { value: "COT", label: "COT" },
                      ]}
                      placeholder={"Select Department"}
                    />
                  </div>

                  {/* Course */}
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="course">Course</Label>
                    <Combobox
                      value={formData.course}
                      onValueChange={handleCourseChange}
                      onFocus={handleInitialFocus}
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
                    <Label htmlFor="schedule">Program (Day or Night)</Label>
                    <Combobox
                      value={formData.program}
                      onValueChange={handleProgramChange}
                      onFocus={handleInitialFocus}
                      items={[
                        { value: "Day Program", label: "Day Program" },
                        { value: "Evening Program", label: "Evening Program" },
                      ]}
                      placeholder={"Select Program"}
                    />
                  </div>
                </div>
              </form>
            </div>
            {/* --- Button container with smooth transition --- */}
            <div
              className="flex justify-center gap-4 mt-6 mb-8 transition-all duration-300 ease-in-out"
              style={{ minHeight: hasChanged || isFormTouched ? "40px" : "0" }}
            >
              {/* --- Conditionally render buttons based on interaction --- */}
              {(isFormTouched || hasChanged) && (
                <Button
                  onClick={handleClearAll}
                  className="bg-gray-200 text-gray-800 font-serif rounded-md shadow-md shadow-gray-500/80
                  transition-transform hover:scale-105 hover:bg-[#6b211d] hover:text-white
                  active:shadow-lg active:shadow-gray-700/90"
                >
                  Clear Information
                </Button>
              )}
              {hasChanged && (
                <Button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white font-serif rounded-md shadow-md shadow-gray-500/80
                    transition-transform hover:scale-105 hover:bg-blue-700
                    active:shadow-lg active:shadow-gray-700/90"
                >
                  Update
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ManageAccountPage;

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { InputWithClear } from "@/components/ui/inputWithClear";
import Combobox from "@/components/ui/combobox";
import { SaveConfirm } from "@/components/ui/save-new-admin";

interface AddAdminProps {
  onClose: () => void;
}

const AddAdmin: React.FC<AddAdminProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    email: "",
    branch: "",
    department: "",
  });

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleClear = (field: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
  };

  const handleClearAll = () => {
    setFormData({
      firstName: "",
      lastName: "",
      idNumber: "",
      email: "",
      branch: "",
      department: "",
    });
  };

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department: value }));
  };

  const handleBranchChange = (value: string) => {
    setFormData((prev) => ({ ...prev, branch: value }));
  };

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveConfirm(true);
  };

  const handleConfirmSave = () => {
    console.log("New Admin Data:", formData);
  };

  const handleCancelSave = () => {
    setShowSaveConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="w-full ml-65 max-w-2xl rounded-md border border-black shadow-lg shadow-gray-800/50 bg-white relative">
        <CardHeader className="p-0 pt-1 pb-0">
          <CardTitle className="m-0 text-center text-2xl font-serif font-normal tracking-wider opacity-60">
            New Admin
          </CardTitle>
        </CardHeader>
        <div className="w-3/5 mx-auto mb-1">
          <Separator className="bg-black" />
        </div>
        <CardContent className="pt-1">
          <form onSubmit={handleSaveClick} className="space-y-6">
            {/* First row of inputs (First Name, Last Name, ID Number) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* First Name */}
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="firstName" className="font-normal">
                  First Name
                </Label>
                <InputWithClear
                  id="firstName"
                  placeholder="Juan"
                  value={formData.firstName}
                  onChange={handleChange}
                  onClear={() => handleClear("firstName")}
                  className="rounded-none border-[rgba(0,0,0,0.5)]"
                />
              </div>
              {/* Last Name */}
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="lastName" className="font-normal">
                  Last Name
                </Label>
                <InputWithClear
                  id="lastName"
                  placeholder="dela Cruz"
                  value={formData.lastName}
                  onChange={handleChange}
                  onClear={() => handleClear("lastName")}
                  className="rounded-none border-[rgba(0,0,0,0.5)]"
                />
              </div>
              {/* ID Number */}
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="idNumber" className="font-normal">
                  ID Number
                </Label>
                <InputWithClear
                  id="idNumber"
                  placeholder="1331370"
                  value={formData.idNumber}
                  onChange={handleChange}
                  onClear={() => handleClear("idNumber")}
                  className="rounded-none border-[rgba(0,0,0,0.5)]"
                />
              </div>
            </div>

            {/* Second row of inputs (Email, Branch, Department) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Email */}
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email" className="font-normal">
                  Email
                </Label>
                <InputWithClear
                  id="email"
                  placeholder="juan.delacruz@ctu.edu.ph"
                  value={formData.email}
                  onChange={handleChange}
                  onClear={() => handleClear("email")}
                  className="rounded-none border-[rgba(0,0,0,0.5)]"
                />
              </div>
              {/* Branch Combobox */}
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="branch" className="font-normal">
                  Branch
                </Label>
                <Combobox
                  value={formData.branch}
                  onValueChange={handleBranchChange}
                  items={[
                    { value: "branch1", label: "BSIS" },
                    { value: "branch2", label: "BSIT" },
                    { value: "branch3", label: "BIT-CT" },
                  ]}
                  placeholder={"Select Branch"}
                />
              </div>
              {/* Department Combobox */}
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="department" className="font-normal">
                  Department
                </Label>
                <Combobox
                  value={formData.department}
                  onValueChange={handleDepartmentChange}
                  items={[
                    { value: "department1", label: "CCICT" },
                    { value: "department2", label: "CME" },
                    { value: "department3", label: "CAS" },
                  ]}
                  placeholder={"Select Department"}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <Button
                type="button"
                onClick={handleClearAll}
                className="bg-gray-200 text-gray font-serif rounded-1px shadow-md shadow-gray-500/80
              transition-transform hover:scale-105 hover:bg-[#6b211d] hover:text-white
              active:shadow-lg active:shadow-gray-700/90"
              >
                Clear
              </Button>
              <Button
                type="submit"
                className="bg-gray-200 text-gray font-serif rounded-1px shadow-md shadow-gray-500/80
              transition-transform hover:scale-105 hover:bg-[#6b211d] hover:text-white
              active:shadow-lg active:shadow-gray-700/90"
              >
                Save
              </Button>
            </div>
          </form>
        </CardContent>

        <button
          onClick={onClose}
          className="absolute opacity-70 right-3 top-3 text-gray-400 hover:opacity-100 hover:text-gray-600 transition-transform hover:scale-110"
        >
          <img src="/images/close.png" alt="Close" className="h-6 w-6" />
        </button>
      </Card>

      {showSaveConfirm && (
        <SaveConfirm
          onConfirm={handleConfirmSave}
          onCancel={handleCancelSave}
        />
      )}
    </div>
  );
};

export default AddAdmin;

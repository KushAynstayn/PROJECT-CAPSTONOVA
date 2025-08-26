"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { InputWithClear } from "@/components/ui/inputWithClear";
import Combobox from "@/components/ui/combobox";
import { SaveConfirm } from "@/components/ui/save-new-adviser";

interface AddAdviserProps {
  onClose: () => void;
}

const AddAdviser: React.FC<AddAdviserProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    email: "",
    numberOfAdvisees: "",
  });

  // State to control the visibility of the confirmation dialog
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
      numberOfAdvisees: "",
    });
  };

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department: value }));
  };

  const handleBranchChange = (value: string) => {
    setFormData((prev) => ({ ...prev, branch: value }));
  };

  // This function is called by the form's submit button.
  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveConfirm(true); // Show the confirmation dialog
  };

  // This function is passed as a prop to the SaveConfirm component.
  // It is called when the user clicks "Yes" in the dialog.
  const handleConfirmSave = () => {
    console.log("New Adviser Data:", formData);
    // You can now proceed with your actual save logic here (e.g., API call).
    // The dialog will handle the rest of the closing process.
  };

  // This function is called if the user confirms "No" in the dialog or closes the success dialog.
  const handleCancelSave = () => {
    setShowSaveConfirm(false); // Hide the entire dialog component.
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="w-full max-w-2xl rounded-md border border-black shadow-lg shadow-gray-800/50 bg-white relative ml-65">
        <CardHeader className="p-0 pt-1 pb-0">
          <CardTitle className="m-0 text-center text-2xl font-serif font-normal tracking-wider opacity-60">
            New Adviser
          </CardTitle>
        </CardHeader>
        <div className="w-3/5 mx-auto mb-1">
          <Separator className="bg-black" />
        </div>

        <CardContent className="pt-1">
          <form onSubmit={handleSaveClick} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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

            <div className="flex justify-center w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-md">
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

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="numberOfAdvisees" className="font-normal">
                    Number of Advisees
                  </Label>
                  <InputWithClear
                    id="numberOfAdvisees"
                    placeholder="1"
                    value={formData.numberOfAdvisees}
                    onChange={handleChange}
                    onClear={() => handleClear("numberOfAdvisees")}
                    className="rounded-none border-[rgba(0,0,0,0.5)]"
                  />
                </div>
              </div>
            </div>

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

        {/* Correctly positioned and styled close button with image */}
        <button
          onClick={onClose}
          className="absolute opacity-70 right-3 top-3 text-gray-400 hover:opacity-100 hover:text-gray-600 transition-transform hover:scale-110"
        >
          <img src="/images/close.png" alt="Close" className="h-6 w-6" />
        </button>
      </Card>

      {/* Conditionally render the SaveConfirm dialog */}
      {showSaveConfirm && (
        <SaveConfirm
          onConfirm={handleConfirmSave}
          onCancel={handleCancelSave}
        />
      )}
    </div>
  );
};

export default AddAdviser;

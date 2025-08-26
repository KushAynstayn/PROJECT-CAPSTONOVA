"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { InputWithClear } from "@/components/ui/inputWithClear";
import Combobox from "@/components/ui/combobox";
import { SaveConfirm } from "@/components/ui/save-new-proponent";

interface AddProponentProps {
  onClose: () => void;
}

const AddProponent: React.FC<AddProponentProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    email: "",
    course: "",
    adviser: "",
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
      course: "",
      adviser: "",
    });
  };

  // Corrected handler for the course combobox
  const handleCourseChange = (value: string) => {
    setFormData((prev) => ({ ...prev, course: value }));
  };

  // Corrected handler for the adviser combobox
  const handleAdviserChange = (value: string) => {
    setFormData((prev) => ({ ...prev, adviser: value }));
  };

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveConfirm(true);
  };

  const handleConfirmSave = () => {
    console.log("New Proponent Data:", formData);
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
            New Proponent
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
              {/* Course Combobox */}
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="course" className="font-normal">
                  Course
                </Label>
                <Combobox
                  value={formData.course}
                  onValueChange={handleCourseChange}
                  items={[
                    { value: "BSIS", label: "BSIS" },
                    { value: "BSIT", label: "BSIT" },
                    { value: "BIT-CT", label: "BIT-CT" },
                  ]}
                  placeholder={"Select Course"}
                />
              </div>
              {/* Adviser Combobox */}
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="adviser" className="font-normal">
                  Adviser
                </Label>
                <Combobox
                  value={formData.adviser}
                  onValueChange={handleAdviserChange}
                  items={[
                    { value: "adviser1", label: "Monkey Luffy" },
                    { value: "adviser2", label: "Roronoa Zoro" },
                    { value: "adviser3", label: "Sanji Vinsmoke" },
                    { value: "adviser4", label: "Trafalgar Law" },
                    { value: "adviser5", label: "Nico Robin" },
                    { value: "adviser6", label: "Rob Lucci" },
                    { value: "adviser7", label: "Dracule Mihawk" },
                  ]}
                  placeholder={"Select Adviser"}
                />
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

export default AddProponent;

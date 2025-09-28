"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { InputWithClear } from "@/components/ui/inputWithClear";
import { SaveConfirm } from "@/components/ui/save-new-adviser"; // This can be generalized later

interface AddAdviserProps {
  onClose: () => void;
  onAdd: (adviserData: any) => void;
}

const AddAdviser: React.FC<AddAdviserProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
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
      first_name: "",
      last_name: "",
      middle_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
  };

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setError("");
    setShowSaveConfirm(true);
  };

  const handleConfirmSave = () => {
    const { confirmPassword, ...adviserData } = formData;
    onAdd(adviserData);
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
                <Label htmlFor="first_name">First Name</Label>
                <InputWithClear
                  id="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  onClear={() => handleClear("first_name")}
                  className="rounded-none border-[rgba(0,0,0,0.5)]"
                  required
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="middle_name">Middle Name (Optional)</Label>
                <InputWithClear
                  id="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  onClear={() => handleClear("middle_name")}
                  className="rounded-none border-[rgba(0,0,0,0.5)]"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="last_name">Last Name</Label>
                <InputWithClear
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  onClear={() => handleClear("last_name")}
                  className="rounded-none border-[rgba(0,0,0,0.5)]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <InputWithClear
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onClear={() => handleClear("email")}
                  className="rounded-none border-[rgba(0,0,0,0.5)]"
                  required
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="password">Password</Label>
                <InputWithClear
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  onClear={() => handleClear("password")}
                  className="rounded-none border-[rgba(0,0,0,0.5)]"
                  required
                />
              </div>
              <div className="grid w-full items-center gap-1.5 md:col-span-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <InputWithClear
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onClear={() => handleClear("confirmPassword")}
                  className="rounded-none border-[rgba(0,0,0,0.5)]"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-center text-red-500">{error}</p>
            )}

            <div className="flex justify-center gap-4 mt-6">
              <Button
                type="submit"
                className="bg-[#660000] hover:bg-[#630808] text-white font-semibold px-6 py-2 rounded-full shadow transition-transform duration-200 ease-in-out hover:scale-105"
              >
                Save
              </Button>
              <Button
                type="button"
                onClick={handleClearAll}
                className="bg-gray border-1 border-gray-700 hover:border-[#630808] hover:bg-[#630808] text-gray-700 hover:text-white font-semibold px-6 py-2 rounded-full shadow transition-transform duration-200 ease-in-out hover:scale-105"
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>

        <button onClick={onClose} className="absolute opacity-70 right-3 top-3">
          <img src="/images/close.png" alt="Close" className="h-6 w-6" />
        </button>
      </Card>

      {showSaveConfirm && (
        <SaveConfirm
          onConfirm={handleConfirmSave}
          onCancel={() => setShowSaveConfirm(false)}
        />
      )}
    </div>
  );
};

export default AddAdviser;

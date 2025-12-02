"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { InputWithClear } from "@/components/ui/inputWithClear";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SaveConfirm } from "@/components/ui/save-new-super-admin"; // Reusing generic save confirm

interface AddWhitelistProps {
  onClose: () => void;
  onAdd: (data: any) => void;
}

const AddWhitelist: React.FC<AddWhitelistProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    faculty_id: "",
    role: "Adviser",
    email: "",
  });

  const [error, setError] = useState("");
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleClear = (field: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
  };

  const handleClearAll = () => {
    setFormData({
      faculty_id: "",
      role: "Adviser",
      email: "",
    });
    setError("");
  };

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.faculty_id || !formData.email) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setShowSaveConfirm(true);
  };

  const handleConfirmSave = () => {
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="w-full ml-65 max-w-lg rounded-md border border-gray-300 shadow-md bg-white relative">
        <CardHeader className="p-0 pt-1 pb-0">
          <CardTitle className="m-0 text-center text-2xl font-serif font-normal tracking-wider opacity-60">
            Whitelist Faculty
          </CardTitle>
        </CardHeader>
        <div className="w-3/5 mx-auto mb-1">
          <Separator className="bg-gray-300" />
        </div>
        <CardContent className="pt-4 px-8 pb-8">
          <form onSubmit={handleSaveClick} className="space-y-6">
            {/* Faculty ID */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="faculty_id">Faculty ID</Label>
              <InputWithClear
                id="faculty_id"
                value={formData.faculty_id}
                onChange={handleChange}
                onClear={() => handleClear("faculty_id")}
                className="rounded-md border-gray-300 shadow-md"
                required
              />
            </div>

            {/* Role Selection */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-full rounded-md border-gray-300 shadow-md">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Adviser">Adviser</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <InputWithClear
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onClear={() => handleClear("email")}
                className="rounded-md border-gray-300 shadow-md"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-center text-red-500">{error}</p>
            )}

            <div className="flex justify-center gap-4 mt-6">
              <Button
                type="submit"
                className="bg-[#660000] hover:bg-[#630808] text-white font-semibold px-6 py-2 rounded-full shadow transition-transform duration-200 ease-in-out hover:scale-105"
              >
                Add to Whitelist
              </Button>
              <Button
                type="button"
                onClick={handleClearAll}
                className="bg-gray border-1 border-gray-300 hover:border-[#630808] hover:bg-[#630808] text-gray-700 hover:text-white font-semibold px-6 py-2 rounded-full shadow transition-transform duration-200 ease-in-out hover:scale-105"
              >
                Clear
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
          onCancel={() => setShowSaveConfirm(false)}
        />
      )}
    </div>
  );
};

export default AddWhitelist;

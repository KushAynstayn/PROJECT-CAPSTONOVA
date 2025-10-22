"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { InputWithClear } from "@/components/ui/inputWithClear";
import { SaveConfirm } from "@/components/ui/save-new-super-admin"; // Changed import
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface AddSuperAdminProps {
  onClose: () => void;
  onAdd: (adminData: any) => void;
}

const AddSuperAdmin: React.FC<AddSuperAdminProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState("");
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      password_confirmation: "",
    });
    setError("");
  };

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
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
    onAdd(formData);
  };

  const handleCancelSave = () => {
    setShowSaveConfirm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="w-full ml-65 max-w-2xl rounded-md border border-gray-300 shadow-md bg-white relative">
        <CardHeader className="p-0 pt-1 pb-0">
          <CardTitle className="m-0 text-center text-2xl font-serif font-normal tracking-wider opacity-60">
            New Super Admin
          </CardTitle>
        </CardHeader>
        <div className="w-3/5 mx-auto mb-1">
          <Separator className="bg-gray-300" />
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
                  className="rounded-md border-gray-300 shadow-md"
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
                  className="rounded-md border-gray-300 shadow-md"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="last_name">Last Name</Label>
                <InputWithClear
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  onClear={() => handleClear("last_name")}
                  className="rounded-md border-gray-300 shadow-md"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* --- MODIFIED: Email field now spans two columns --- */}
              <div className="grid w-full items-center gap-1.5 md:col-span-2">
                <Label htmlFor="email">Email</Label>
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

              {/* Password Field */}
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="rounded-md border-gray-300 shadow-md pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* --- MODIFIED: Confirm Password field no longer spans two columns --- */}
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="rounded-md border-gray-300 shadow-md pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
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
          onCancel={handleCancelSave}
        />
      )}
    </div>
  );
};

export default AddSuperAdmin;

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InputWithClear } from "@/components/ui/inputWithClear";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { SaveConfirm } from "@/components/ui/save-new-proponent";
import { apiCall } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface Adviser {
  id: number;
  full_name: string;
}

interface AddProponentProps {
  onClose: () => void;
  onAdd: (proponentData: any) => void;
}

const AddProponent: React.FC<AddProponentProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    student_id: "",
    department: "",
    program: "",
    adviser_id: "",
  });
  const [advisers, setAdvisers] = useState<Adviser[]>([]);
  const [error, setError] = useState("");
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  // --- CORRECT PLACEMENT for State ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleClear = (field: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
  };

  const handleClearAll = () => {
    setFormData({
      first_name: "", last_name: "", email: "", password: "", password_confirmation: "",
      student_id: "", department: "", program: "", adviser_id: "",
    });
    setError("");
  };

  const handleAdviserChange = (value: string) => {
    setFormData((prev) => ({ ...prev, adviser_id: value }));
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="w-full max-w-2xl rounded-md border border-gray-300 shadow-md bg-white relative ml-65">
        <CardHeader className="p-0 pt-1 pb-0">
          <CardTitle className="m-0 text-center text-2xl font-serif font-normal tracking-wider opacity-60">
            New Proponent
          </CardTitle>
        </CardHeader>
        <div className="w-3/5 mx-auto mb-1">
          <Separator className="bg-gray-300" />
        </div>

        <CardContent className="pt-1">
          <form onSubmit={handleSaveClick} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithClear
                id="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                onClear={() => handleClear("first_name")}
                className="rounded-md border-gray-300 shadow-md"
                required
              />
              <InputWithClear
                id="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                onClear={() => handleClear("last_name")}
                className="rounded-md border-gray-300 shadow-md"
                required
              />
              <InputWithClear
                id="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                onClear={() => handleClear("email")}
                className="rounded-md border-gray-300 shadow-md"
                required
              />
              <InputWithClear
                id="student_id"
                placeholder="Student ID"
                value={formData.student_id}
                onChange={handleChange}
                onClear={() => handleClear("student_id")}
                className="rounded-md border-gray-300 shadow-md"
                required
              />
              
              {/* --- CORRECT PLACEMENT for Password field --- */}
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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

              {/* --- CORRECT PLACEMENT for Confirm Password field --- */}
              <div className="relative">
                <Input
                  id="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
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

              <InputWithClear
                id="department"
                placeholder="Department (e.g., BSIS)"
                value={formData.department}
                onChange={handleChange}
                onClear={() => handleClear("department")}
                className="rounded-md border-gray-300 shadow-md"
                required
              />
              <InputWithClear
                id="program"
                placeholder="Program (e.g., Day)"
                value={formData.program}
                onChange={handleChange}
                onClear={() => handleClear("program")}
                className="rounded-md border-gray-300 shadow-md"
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <SearchableCombobox
                value={formData.adviser_id}
                onValueChange={handleAdviserChange}
                items={advisers.map((adviser) => ({
                  value: adviser.id.toString(),
                  label: adviser.full_name,
                }))}
                placeholder={"Select Adviser"}
                className="rounded-md border-gray-300 shadow-md"
              />
            </div>

            {error && (
              <p className="text-sm text-center text-red-500 pt-2">{error}</p>
            )}

            <div className="flex justify-center gap-4 mt-4">
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

export default AddProponent;


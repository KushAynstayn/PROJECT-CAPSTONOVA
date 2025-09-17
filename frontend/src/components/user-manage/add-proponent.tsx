"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { InputWithClear } from "@/components/ui/inputWithClear";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { SaveConfirm } from "@/components/ui/save-new-proponent";
import { apiCall } from "@/lib/api";

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
    // Exclude confirmPassword before sending to the backend
    const { password_confirmation, ...proponentData } = formData;
    onAdd(proponentData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="w-full max-w-2xl rounded-md border border-black shadow-lg shadow-gray-800/50 bg-white relative ml-65">
        <CardHeader className="p-0 pt-1 pb-0">
          <CardTitle className="m-0 text-center text-2xl font-serif font-normal tracking-wider opacity-60">
            New Proponent
          </CardTitle>
        </CardHeader>
        <div className="w-3/5 mx-auto mb-1">
          <Separator className="bg-black" />
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
                required
              />
              <InputWithClear
                id="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                onClear={() => handleClear("last_name")}
                required
              />
              <InputWithClear
                id="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                onClear={() => handleClear("email")}
                required
              />
              <InputWithClear
                id="student_id"
                placeholder="Student ID"
                value={formData.student_id}
                onChange={handleChange}
                onClear={() => handleClear("student_id")}
                required
              />
              <InputWithClear
                id="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onClear={() => handleClear("password")}
                required
              />
              <InputWithClear
                id="password_confirmation"
                type="password"
                placeholder="Confirm Password"
                value={formData.password_confirmation}
                onChange={handleChange}
                onClear={() => handleClear("password_confirmation")}
                required
              />
              <InputWithClear
                id="department"
                placeholder="Department (e.g., BSIS)"
                value={formData.department}
                onChange={handleChange}
                onClear={() => handleClear("department")}
                required
              />
              <InputWithClear
                id="program"
                placeholder="Program (e.g., Day)"
                value={formData.program}
                onChange={handleChange}
                onClear={() => handleClear("program")}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="adviser_id" className="font-normal">
                Adviser
              </Label>
              <SearchableCombobox
                value={formData.adviser_id}
                onValueChange={handleAdviserChange}
                items={advisers.map((adviser) => ({
                  value: adviser.id.toString(),
                  label: adviser.full_name,
                }))}
                placeholder={"Select Adviser"}
              />
            </div>

            {error && (
              <p className="text-sm text-center text-red-500 pt-2">{error}</p>
            )}

            <div className="flex justify-center gap-4 mt-4">
              <Button
                type="button"
                onClick={handleClearAll}
                className="bg-gray-200 text-gray font-serif rounded-1px shadow-md"
              >
                Clear
              </Button>
              <Button
                type="submit"
                className="bg-gray-200 text-gray font-serif rounded-1px shadow-md"
              >
                Save
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

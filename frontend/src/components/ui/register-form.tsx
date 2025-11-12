"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiCall, ApiError } from "@/lib/api";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "Viewer",
    student_id: "",
    department: "",
    program: "",
  });
  const [errors, setErrors] = useState<Record<string, string[] | string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage(null);

    try {
      if (formData.role === "Viewer") {
        const settingStatus = await apiCall(
          "/public/system-settings/check?setting_name=viewer_registerAccount",
          "GET"
        );

        if (settingStatus && settingStatus.is_enabled === false) {
          setErrors({
            server:
              "Viewer registration is currently disabled by the administrator.",
          });
          setIsLoading(false);
          return;
        }
      }

      const response = await apiCall("/auth/register", "POST", formData);

      setSuccessMessage(response.message || "Registration successful!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      if (error instanceof ApiError) {
        const newErrors: Record<string, string[] | string> = {};
        const details = error.details || {};

        if (
          error.status === 404 ||
          (details.message && typeof details.message === "string")
        ) {
          newErrors.server = details.message;
        } else if (
          typeof details === "object" &&
          Object.keys(details).length > 0
        ) {
          Object.keys(details).forEach((key) => {
            newErrors[key] = details[key];
          });
        } else {
          newErrors.server = "An unexpected error occurred.";
        }
        setErrors(newErrors);
      } else {
        setErrors({
          server: "An unexpected client-side error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderErrors = (field: string) => {
    if (errors[field]) {
      const fieldErrors = Array.isArray(errors[field])
        ? errors[field]
        : [errors[field] as string];
      return fieldErrors.map((error, index) => (
        <p key={index} className="text-red-500 text-xs mt-1">
          {error}
        </p>
      ));
    }
    return null;
  };

  return (
    <Card className="border border-gray-300 shadow-md">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>
          Fill in the details below to join the community.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage ? (
            <div className="p-4 text-center bg-green-100 text-green-800 rounded-md">
              <p className="font-semibold">{successMessage}</p>
              <p className="text-sm">Redirecting to login...</p>
            </div>
          ) : (
            <>
              {/* ... (all other form fields are correct) ... */}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                  {renderErrors("first_name")}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                  {renderErrors("last_name")}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {renderErrors("email")}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pr-10"
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
                {renderErrors("password")}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    className="pr-10"
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
                {renderErrors("password_confirmation")}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Register as</Label>
                <Select
                  name="role"
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-300 shadow-md rounded-md hover:bg-gray-300 hover:text-black">
                    <SelectItem value="Viewer">Viewer</SelectItem>
                    <SelectItem value="Proponent">Proponent</SelectItem>
                  </SelectContent>
                </Select>
                {renderErrors("role")}
              </div>

              {formData.role === "Proponent" && (
                <div className="space-y-2">
                  <Label htmlFor="student_id">Student ID</Label>
                  <Input
                    id="student_id"
                    name="student_id"
                    type="text"
                    value={formData.student_id}
                    onChange={handleChange}
                    required={formData.role === "Proponent"}
                  />
                  {renderErrors("student_id")}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  name="department"
                  value={formData.department}
                  onValueChange={(value) =>
                    handleSelectChange("department", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-300 shadow-md rounded-md hover:bg-gray-300 hover:text-black">
                    <SelectItem value="BSIS">BSIS</SelectItem>
                    <SelectItem value="BSIT">BSIT</SelectItem>
                    <SelectItem value="BIT-CT">BIT-CT</SelectItem>
                  </SelectContent>
                </Select>
                {renderErrors("department")}
              </div>

              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <Select
                  name="program"
                  value={formData.program}
                  onValueChange={(value) =>
                    handleSelectChange("program", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-300 shadow-md rounded-md hover:bg-gray-300 hover:text-black">
                    <SelectItem value="Day Program">Day Program</SelectItem>
                    <SelectItem value="Evening Program">
                      Evening Program
                    </SelectItem>
                  </SelectContent>
                </Select>{" "}
                {/* <-- THIS IS THE FIX (was </This>) */}
                {renderErrors("program")}
              </div>

              {errors.server && (
                <p className="text-red-500 text-sm font-medium text-center">
                  {errors.server as string}
                </p>
              )}

              <div className="justify-center flex">
                <Button
                  type="submit"
                  className="w-1/2 bg-[#660000] hover:bg-[#660000] hover:text-white hover:scale-105 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

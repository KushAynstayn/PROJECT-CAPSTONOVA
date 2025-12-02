"use client";

import React, { useState, useEffect } from "react";
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

  // Tab state: 'student' or 'faculty'
  const [activeTab, setActiveTab] = useState<"student" | "faculty">("student");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "Viewer", // Default starting role
    student_id: "", // Used for both Student ID and Faculty ID based on context
    department: "",
    program: "",
  });

  const [errors, setErrors] = useState<Record<string, string[] | string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Reset role and relevant fields when tab changes
  useEffect(() => {
    setErrors({});
    if (activeTab === "student") {
      setFormData((prev) => ({
        ...prev,
        role: "Viewer",
        student_id: "",
        department: "",
        program: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        role: "Adviser",
        student_id: "",
        department: "", // Optional for faculty
        program: "", // Optional for faculty
      }));
    }
  }, [activeTab]);

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
      // Viewer Registration Check
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

      // Prepare payload - Clean up empty fields if necessary
      const payload = { ...formData };

      // If faculty, we don't strictly need department/program, but sending empty strings is fine
      // as the backend rules say 'nullable'.

      const response = await apiCall("/auth/register", "POST", payload);

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
            // Map backend errors to frontend fields
            // Ensure student_id errors show up on the ID field
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

        {/* --- CUSTOM TABS --- */}
        <div className="flex w-full mt-4 border rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => setActiveTab("student")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              activeTab === "student"
                ? "bg-[#660000] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Student / Viewer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("faculty")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              activeTab === "faculty"
                ? "bg-[#660000] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Faculty (Admin/Adviser)
          </button>
        </div>
        {/* --- END CUSTOM TABS --- */}
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

              {/* --- DYNAMIC ROLE SELECTION --- */}
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
                    {activeTab === "student" ? (
                      <>
                        <SelectItem value="Viewer">Viewer</SelectItem>
                        <SelectItem value="Proponent">Proponent</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="Adviser">Adviser</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {renderErrors("role")}
              </div>

              {/* --- DYNAMIC ID FIELD --- */}
              {/* Show for Proponent OR Faculty (Admin/Adviser) */}
              {(formData.role === "Proponent" || activeTab === "faculty") && (
                <div className="space-y-2">
                  <Label htmlFor="student_id">
                    {activeTab === "faculty" ? "Faculty ID" : "Student ID"}
                  </Label>
                  <Input
                    id="student_id"
                    name="student_id"
                    type="text"
                    value={formData.student_id}
                    onChange={handleChange}
                    required
                    placeholder={
                      activeTab === "faculty"
                        ? "Enter Faculty ID"
                        : "Enter Student ID"
                    }
                  />
                  {/* Backend validates 'student_id', so errors come back under this key */}
                  {renderErrors("student_id")}
                </div>
              )}

              {/* --- STUDENT SPECIFIC FIELDS (Department/Program) --- */}
              {activeTab === "student" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      name="department"
                      value={formData.department}
                      onValueChange={(value) =>
                        handleSelectChange("department", value)
                      }
                      required={activeTab === "student"}
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
                      required={activeTab === "student"}
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
                    </Select>
                    {renderErrors("program")}
                  </div>
                </>
              )}

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

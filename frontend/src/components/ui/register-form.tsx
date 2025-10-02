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
      const response = await apiCall("/auth/register", "POST", formData);

      // Set success message and redirect to login after a short delay
      setSuccessMessage(response.message || "Registration successful!");
      setTimeout(() => {
        router.push("/login");
      }, 2000); // 2-second delay before redirecting
    } catch (error) {
      if (error instanceof ApiError) {
        // The backend validation errors are now in error.details
        // The main error message is in error.message
        const newErrors: Record<string, string[] | string> = {};

        // Handle validation errors from details
        if (error.details && typeof error.details === "object") {
          Object.keys(error.details).forEach((key) => {
            newErrors[key] = error.details[key];
          });
        }

        // Set server error from the main message
        if (error.message) {
          newErrors.server = error.message;
        }

        setErrors(newErrors);
      } else {
        setErrors({
          server: "An unexpected error occurred. Please try again.",
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
    <Card>
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
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {renderErrors("password")}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
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
                  <SelectContent>
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
                  <SelectContent>
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
                  <SelectContent>
                    <SelectItem value="Day Program">Day Program</SelectItem>
                    <SelectItem value="Evening Program">
                      Evening Program
                    </SelectItem>
                  </SelectContent>
                </Select>
                {renderErrors("program")}
              </div>

              {errors.server && (
                <p className="text-red-500 text-sm font-medium text-center">
                  {errors.server}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-red-800 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

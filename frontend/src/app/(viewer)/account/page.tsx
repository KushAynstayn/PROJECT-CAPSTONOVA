"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/lib/auth";
import { apiCall } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserProfile {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  user_detail?: {
    department: string;
    program: string;
  };
}

/**
 * Extracts a valid email address from a string that may contain extra characters.
 * This is a workaround for the malformed email string coming from the API.
 * @param apiEmail The email string from the API.
 * @returns A cleaned-up email string.
 */
const cleanEmail = (apiEmail: string): string => {
  if (typeof apiEmail !== "string") {
    return "";
  }
  // This regex finds an email-like pattern in the string.
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = apiEmail.match(emailRegex);
  // Return the first match found, or the original string if no match.
  return match ? match[0] : apiEmail;
};

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const user = authStore.getUser();
    if (!user || user.role !== "Viewer") {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const userProfile: UserProfile = await apiCall("/user/profile", "GET");
        setFirstName(userProfile.first_name);
        setLastName(userProfile.last_name);
        setMiddleName(userProfile.middle_name || "");
        setEmail(cleanEmail(userProfile.email));
        setDepartment(userProfile.user_detail?.department || "");
        setProgram(userProfile.user_detail?.program || "");
      } catch (err) {
        setError("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    const payload: any = {
      first_name: firstName,
      last_name: lastName,
      middle_name: middleName,
      email,
      department,
      program,
    };

    if (password) {
      payload.password = password;
      payload.password_confirmation = passwordConfirmation;
    }

    try {
      const response = await apiCall("/user/profile", "PUT", payload);
      setSuccess(response.message);
      setPassword("");
      setPasswordConfirmation("");
    } catch (err: any) {
      setError(err.message || "An error occurred while updating the profile.");
    }
  };

  const handleLogout = async () => {
    try {
      await authStore.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setError("Logout failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="pt-8 border-2 border-[#E0A800]/50 bg-black text-gray-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-[#E0A800] mb-6">Account</h1>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="pt-8 space-y-8 bg-black text-gray-200 border-2 border-[#E0A800]/50 rounded-lg p-8">
      <h1 className="text-2xl font-bold text-[#E0A800] mb-6">Account</h1>
      <Card className="bg-neutral-950 border-gray-800 text-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-50">Manage Information</CardTitle>
          <CardDescription>Update your account details here.</CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdateProfile}>
          <CardContent className="space-y-4">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-neutral-900 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-neutral-900 border-gray-700"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="middle-name">Middle Name</Label>
              <Input
                id="middle-name"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="bg-neutral-900 border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-900 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="bg-neutral-900 border-gray-700">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-gray-700 text-gray-200">
                    <SelectItem value="BSIS">BSIS</SelectItem>
                    <SelectItem value="BSIT">BSIT</SelectItem>
                    <SelectItem value="BIT-CT">BIT-CT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <Select value={program} onValueChange={setProgram}>
                  <SelectTrigger className="bg-neutral-900 border-gray-700">
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-gray-700 text-gray-200">
                    <SelectItem value="Day program">Day program</SelectItem>
                    <SelectItem value="Evening program">
                      Evening program
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="bg-neutral-900 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="bg-neutral-900 border-gray-700"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-6 flex justify-between">
            <Button type="button" variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
            <Button
              type="submit"
              variant="ghost"
              className="border border-[#E0A800] hover:bg-[#E0A800]/10"
            >
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

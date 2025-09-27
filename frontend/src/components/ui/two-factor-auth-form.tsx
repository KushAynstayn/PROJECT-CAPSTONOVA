"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { authStore } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TwoFactorAuthFormProps extends React.ComponentProps<"form"> {
  email: string;
}

export function TwoFactorAuthForm({
  email,
  className,
  ...props
}: TwoFactorAuthFormProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // This will be a new method in your authStore
      const { user } = await authStore.verifyTwoFactor(email, code);

      // Redirect based on the user's role from the API response
      switch (user.role.toLowerCase()) {
        case "super admin":
          router.push("/super-admin/dashboard");
          break;
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "adviser":
          router.push("/adviser/dashboard");
          break;
        case "proponent":
          router.push("/proponent/manage-account");
          break;
        default:
          router.push("/"); // Default redirect for viewers or other roles
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-8", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
        <p className="text-muted-foreground text-sm text-balance">
          A verification code has been sent to your email. Please enter the code
          below.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="code">Verification Code</Label>
          <Input
            id="code"
            type="text"
            inputMode="numeric"
            placeholder="123456"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-red-800 text-white hover:bg-red-900 mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </div>
    </form>
  );
}

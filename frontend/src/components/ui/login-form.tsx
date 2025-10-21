"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { authStore } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TwoFactorAuthForm } from "./two-factor-auth-form";
import { EyeIcon, EyeOffIcon, MailCheck } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showPassword, setPasswordVisibility] = useState(false);

  // --- NEW STATE FOR EMAIL VERIFICATION ---
  const [isEmailUnverified, setIsEmailUnverified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  // --- END NEW STATE ---

  const handleResendVerification = async () => {
    setIsResending(true);
    setError(null);
    setResendStatus(null);
    try {
      const response = await authStore.resendVerificationEmail(email);
      setResendStatus({ message: response.message, type: "success" });
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "An unexpected error occurred.";
      setResendStatus({ message: errorMessage, type: "error" });
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsEmailUnverified(false);
    setResendStatus(null);

    try {
      const response = await authStore.login(email, password, remember);

      if (response.two_factor_required) {
        setShowTwoFactor(true);
      } else {
        const { user } = response;
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
            router.push("/");
        }
      }
    } catch (err: any) {
      if (
        err instanceof ApiError &&
        err.status === 403 &&
        err.message.toLowerCase().includes("not verified")
      ) {
        // --- HANDLE UNVERIFIED EMAIL ERROR ---
        setError(err.message);
        setIsEmailUnverified(true);
      } else if (err instanceof ApiError) {
        if (err.status === 422 && err.details.email) {
          setError(err.details.email[0]);
        } else {
          setError(err.message);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showTwoFactor) {
    return <TwoFactorAuthForm email={email} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-8", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || isResending}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || isResending}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setPasswordVisibility(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <p
            className={cn("text-sm text-center", {
              "text-red-500": !isEmailUnverified,
              "text-yellow-600": isEmailUnverified,
            })}
          >
            {error}
          </p>
        )}

        {/* --- RESEND BUTTON AND STATUS MESSAGE --- */}
        {isEmailUnverified && (
          <div className="flex flex-col items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResendVerification}
              disabled={isResending || isLoading}
            >
              {isResending ? "Sending..." : "Resend Verification Email"}
            </Button>
            {resendStatus && (
              <p
                className={cn("text-sm text-center", {
                  "text-green-600": resendStatus.type === "success",
                  "text-red-500": resendStatus.type === "error",
                })}
              >
                {resendStatus.message}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember-me"
              checked={remember}
              onCheckedChange={(checked) => setRemember(Boolean(checked))}
            />
            <Label htmlFor="remember-me" className="font-normal text-gray-600">
              Remember me
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="font-medium underline underline-offset-4"
          >
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-red-800 text-white hover:bg-red-900 mt-4"
          disabled={isLoading || isResending}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
}

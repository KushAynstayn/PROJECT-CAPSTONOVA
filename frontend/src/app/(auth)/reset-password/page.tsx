"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiCall, ApiError } from "@/lib/api";

function ResetPasswordComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token") || "";
    const emailFromUrl = searchParams.get("email") || "";
    setToken(tokenFromUrl);
    setEmail(emailFromUrl);

    if (!tokenFromUrl || !emailFromUrl) {
      setError("Invalid reset link. The token or email is missing.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (message) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) =>
          prevCountdown > 0 ? prevCountdown - 1 : 0
        );
      }, 1000);

      const redirectTimeout = setTimeout(() => {
        router.push("/login");
      }, 5000);

      return () => {
        clearInterval(timer);
        clearTimeout(redirectTimeout);
      };
    }
  }, [message, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiCall("/auth/reset-password", "POST", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setMessage(response.message);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "An unknown error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-xs">
          <div className="mb-8 flex justify-center">
            <div className="flex flex-col items-center">
              <Image
                src="/images/logo_capstonova.png"
                alt="Project Capstonova Logo"
                width={150}
                height={90}
              />
              <span className="-mt-10 font-cinzel bg-gradient-to-b from-amber-400 to-yellow-600 bg-clip-text text-[15px] font-bold text-transparent">
                PROJECT CAPSTONOVA
              </span>
            </div>
          </div>

          <div className="grid gap-2 text-center mb-6">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            {!message && (
              <p className="text-balance text-sm text-muted-foreground">
                Enter your new password below.
              </p>
            )}
          </div>

          {message ? (
            <div className="text-center grid gap-4">
              <p className="text-green-600">{message}</p>
              <p className="text-muted-foreground">
                Redirecting to login in {countdown} seconds...
              </p>
              <Link
                href="/login"
                className="font-medium text-red-600 hover:underline"
              >
                Sign in now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password-confirmation">
                  Confirm New Password
                </Label>
                <Input
                  id="password-confirmation"
                  type="password"
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !token || !email}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
              {error && (
                <p className="mt-2 text-sm text-center text-red-600">{error}</p>
              )}
            </form>
          )}
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/images/login_pic.png"
          alt="CTU Building"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordComponent />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { apiCall, ApiError } from "../../../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await apiCall("/auth/forgot-password", "POST", {
        email,
      });
      setMessage(response.message);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
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
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            {!message && (
              <p className="text-balance text-sm text-muted-foreground">
                Enter your email to receive a reset link.
              </p>
            )}
          </div>

          {message ? (
            <div className="text-center grid gap-4">
              <p className="text-green-600">{message}</p>
              <div className="mt-4 text-center text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="font-medium text-red-600 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
              {error && (
                <p className="mt-2 text-sm text-center text-red-600">{error}</p>
              )}
            </form>
          )}

          {!message && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-red-600 hover:underline"
              >
                Sign in
              </Link>
            </div>
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

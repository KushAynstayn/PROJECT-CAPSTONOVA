"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiCall, ApiError } from "@/lib/api";
import { MailCheck, MailWarning, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function VerificationContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<
    "verifying" | "success" | "error" | "idle"
  >("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const id = searchParams.get("id");
    const hash = searchParams.get("hash");
    const expires = searchParams.get("expires");
    const signature = searchParams.get("signature");

    if (id && hash && expires && signature) {
      setStatus("verifying");
      const verifyEmail = async () => {
        try {
          // Construct the verification URL with all required query parameters for the signed route
          const verificationUrl = `/auth/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`;
          const response = await apiCall(verificationUrl, "GET");
          setMessage(
            response.message ||
              "Email successfully verified. You can now log in."
          );
          setStatus("success");
        } catch (error) {
          if (error instanceof ApiError) {
            setMessage(
              error.message ||
                "Verification failed. The link may be invalid or expired."
            );
          } else {
            setMessage("An unexpected error occurred during verification.");
          }
          setStatus("error");
        }
      };
      verifyEmail();
    } else {
      setMessage("Invalid verification link. Required parameters are missing.");
      setStatus("error");
    }
  }, [searchParams]);

  const renderStatus = () => {
    switch (status) {
      case "verifying":
        return (
          <>
            <LoaderCircle className="h-12 w-12 animate-spin text-gray-500" />
            <h1 className="mt-4 text-2xl font-bold">Verifying Your Email</h1>
            <p className="mt-2 text-gray-600">Please wait a moment...</p>
          </>
        );
      case "success":
        return (
          <>
            <MailCheck className="h-12 w-12 text-green-500" />
            <h1 className="mt-4 text-2xl font-bold">
              Verification Successful!
            </h1>
            <p className="mt-2 text-gray-600">{message}</p>
          </>
        );
      case "error":
        return (
          <>
            <MailWarning className="h-12 w-12 text-red-500" />
            <h1 className="mt-4 text-2xl font-bold">Verification Failed</h1>
            <p className="mt-2 text-gray-600">{message}</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 text-center shadow-md">
        {renderStatus()}
        {(status === "success" || status === "error") && (
          <Button asChild className="mt-6 w-full bg-red-800 hover:bg-red-900">
            <Link href="/login">Return to Login</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationContent />
    </Suspense>
  );
}

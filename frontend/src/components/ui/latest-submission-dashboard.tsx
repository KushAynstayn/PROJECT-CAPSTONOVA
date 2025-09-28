"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiCall, ApiError } from "@/lib/api";

// Interface for the fetched data
interface SubmissionData {
  title: string;
  submitted_by: string;
  adviser: string;
  date_submitted: string;
}

export function LatestSubmission() {
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestSubmission = async () => {
      try {
        setIsLoading(true);
        const data = await apiCall("/util/latest-submission");
        setSubmission(data);
        setError(null);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setError("No submissions found yet.");
        } else {
          setError("Failed to load submission data.");
        }
        console.error("Failed to fetch latest submission:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestSubmission();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-sm text-gray-500">Loading...</p>;
    }
    if (error) {
      return <p className="text-sm text-red-500">{error}</p>;
    }
    if (submission) {
      return (
        <div className="flex flex-col space-y-3 text-sm text-muted-foreground">
          <p className="font-medium text-primary break-words">
            {submission.title}
          </p>
          <div className="flex flex-col space-y-1">
            <span>Submitted by {submission.submitted_by}</span>
            <span>Adviser: {submission.adviser}</span>
            <span>
              Date Submitted:{" "}
              {format(new Date(submission.date_submitted), "MMMM dd, yyyy")}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Latest Submission</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">{renderContent()}</CardContent>
      <CardFooter className="justify-center">
        <Button className="bg-[#660000] hover:bg-[#630808] text-white font-semibold px-6 py-2 rounded-full shadow transition-transform duration-200 ease-in-out hover:scale-105">
          View All Projects
        </Button>
      </CardFooter>
    </Card>
  );
}

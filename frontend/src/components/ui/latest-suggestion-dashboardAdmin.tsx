"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { apiCall, ApiError } from "@/lib/api";

// Interface for the API data
interface SuggestionData {
  adviser_name: string;
  suggestion_text: string;
  title: string;
}

// Helper function to get initials from a name
const getInitials = (name: string) => {
  const names = name.split(" ");
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const LatestSuggestion = () => {
  const [suggestion, setSuggestion] = useState<SuggestionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestSuggestion = async () => {
      try {
        setIsLoading(true);
        const data = await apiCall("/util/latest-suggestion");
        setSuggestion(data);
        setError(null);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setError("No suggestions found yet.");
        } else {
          setError("Failed to load suggestion.");
        }
        console.error("Failed to fetch latest suggestion:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatestSuggestion();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-sm text-gray-500">Loading...</p>;
    }
    if (error) {
      return <p className="text-sm text-red-500">{error}</p>;
    }
    if (suggestion) {
      return (
        <>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>
                {getInitials(suggestion.adviser_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">
                {suggestion.adviser_name}
              </p>
              <p className="text-sm text-muted-foreground">Adviser</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-700">
            {suggestion.suggestion_text}
          </p>
        </>
      );
    }
    return null;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Latest Suggestion</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">{renderContent()}</CardContent>
      <CardFooter className="justify-center">
        <Button className="w-1/2 bg-[#660000] text-white hover:bg-[#751717] active:bg-[#751717] transition-transform hover:scale-105">
          View All Suggestions
        </Button>
      </CardFooter>
    </Card>
  );
};

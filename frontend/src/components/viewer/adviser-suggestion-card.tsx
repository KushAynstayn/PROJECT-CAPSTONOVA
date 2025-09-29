"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiCall, ApiError } from "@/lib/api";
import { authStore } from "@/lib/auth";
import { ThumbsUp, Eye, HeartCrack } from "lucide-react";

interface Adviser {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Suggestion {
  id: number;
  title: string;
  suggestion_text: string;
  adviser: Adviser;
  interested_student_id: number | null;
  submission_date: string;
}

interface AdviserSuggestionCardProps {
  suggestion: Suggestion;
  currentUserId: number | null;
  onInterestChange: () => void; // Callback to refresh the list
}

export function AdviserSuggestionCard({
  suggestion,
  currentUserId,
  onInterestChange,
}: AdviserSuggestionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isInterestedByAnyone = suggestion.interested_student_id !== null;
  const isCurrentUserInterested =
    suggestion.interested_student_id === currentUserId;

  const handleInterestClick = async () => {
    setIsLoading(true);
    setError(null);

    if (!authStore.isAuthenticated()) {
      setError("Please log in to express interest.");
      setIsLoading(false);
      return;
    }

    try {
      if (isCurrentUserInterested) {
        await apiCall(
          `/viewer/suggestions/${suggestion.id}/interest`,
          "DELETE"
        );
      } else {
        await apiCall(`/viewer/suggestions/${suggestion.id}/interest`, "POST");
      }
      onInterestChange();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.details?.message || err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 text-white flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-yellow-400">
          {suggestion.title}
        </CardTitle>
        <p className="text-xs text-gray-400">
          Suggested by:{" "}
          <span className="font-medium">{`${suggestion.adviser.first_name} ${suggestion.adviser.last_name}`}</span>
        </p>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <p className="text-sm text-gray-300 mb-4 overflow-y-auto max-h-28">
          {suggestion.suggestion_text}
        </p>
        <div className="mt-auto pt-4 border-t border-gray-600">
          {error && <p className="text-red-400 text-xs mb-2">{error}</p>}

          {isInterestedByAnyone ? (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-green-400">
                <Eye className="h-4 w-4 mr-2" />
                <span>
                  {isCurrentUserInterested
                    ? "You are interested in this"
                    : "Someone is eyeing this project"}
                </span>
              </div>
              {isCurrentUserInterested && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="px-2 text-red-400 hover:text-red-300 hover:bg-red-900/50"
                  onClick={handleInterestClick}
                  disabled={isLoading}
                >
                  <HeartCrack className="h-4 w-4 mr-2" />
                  {isLoading ? "..." : "Remove Interest"}
                </Button>
              )}
            </div>
          ) : (
            <Button
              size="sm"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleInterestClick}
              disabled={isLoading}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              {isLoading ? "Submitting..." : "I'm Interested"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

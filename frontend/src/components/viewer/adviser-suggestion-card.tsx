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
    <Card className="bg-neutral-900 border-yellow-500/30 text-gray-200 flex flex-col h-full shadow-lg shadow-yellow-500/10 hover:border-yellow-500/60 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#E0A800]">
          {suggestion.title}
        </CardTitle>
        <p className="text-xs text-gray-500">
          By:{" "}
          <span className="font-medium text-gray-400">{`${suggestion.adviser.first_name} ${suggestion.adviser.last_name}`}</span>
        </p>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <p className="text-sm text-gray-300 mb-4 overflow-y-auto max-h-28">
          {suggestion.suggestion_text}
        </p>
        <div className="mt-auto pt-4 border-t border-gray-700/50">
          {error && <p className="text-red-400 text-xs mb-2">{error}</p>}

          {isInterestedByAnyone ? (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-yellow-300/80">
                <Eye className="h-4 w-4 mr-2" />
                <span>
                  {isCurrentUserInterested
                    ? "You are interested"
                    : "Interest shown"}
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
                  {isLoading ? "..." : "Withdraw"}
                </Button>
              )}
            </div>
          ) : (
            <Button
              size="sm"
              className="w-full bg-[#E0A800] text-black font-bold hover:bg-yellow-500"
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

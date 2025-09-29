"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiCall, ApiError } from "@/lib/api";
import { BrainCircuit } from "lucide-react";

interface AiSuggestionCardProps {
  prompt: string;
  category: string;
}

export function AiSuggestionCard({ prompt, category }: AiSuggestionCardProps) {
  const [suggestionText, setSuggestionText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestion = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiCall("/ml-service/get-suggestion", "POST", {
          query_text: prompt,
        });
        setSuggestionText(response.ai_response);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(`API Error: ${err.message}`);
        } else {
          setError("An unexpected error occurred.");
        }
        console.error("Failed to fetch AI suggestion:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Intentionally delay fetching to prioritize adviser suggestions
    const timer = setTimeout(() => {
      fetchSuggestion();
    }, 2500); // 2.5 second delay

    return () => clearTimeout(timer);
  }, [prompt]);

  return (
    <Card className="h-full flex flex-col bg-neutral-900 border-yellow-500/30 text-gray-200 shadow-lg shadow-yellow-500/10 hover:border-yellow-500/60 transition-colors duration-300">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center space-x-3">
          <BrainCircuit className="h-6 w-6 text-[#E0A800]" />
          <CardTitle className="text-xl font-bold text-[#E0A800]">
            AI: {category}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E0A800]"></div>
          </div>
        )}
        {error && (
          <div className="text-red-400 bg-red-900/50 p-4 rounded-md h-full flex items-center justify-center">
            <p>{error}</p>
          </div>
        )}
        {suggestionText && !isLoading && (
          <div className="space-y-4">
            <p className="text-gray-300 text-sm whitespace-pre-wrap">
              {suggestionText.replace(/\*\*/g, "").replace(/\\n/g, "\n")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

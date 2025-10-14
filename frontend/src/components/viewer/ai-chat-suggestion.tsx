"use client";
import React, { useState, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiCall } from "@/lib/api"; // Correctly import apiCall
import { Loader2 } from "lucide-react";

export const AiChatSuggestion = () => {
  const [platform, setPlatform] = useState("");
  const [field, setField] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const platformOptions = ["Web", "Mobile", "IoT", "Desktop", "Hybrid"];
  const fieldOptions = [
    "Agriculture",
    "Commerce",
    "Finance",
    "Health",
    "Education",
    "Entertainment",
  ];

  const handleBadgeClick = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!platform || !field) {
      setError("Platform and Field are required.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiResponse("");

    try {
      // Correctly use the apiCall function
      const response = await apiCall("/ml-service/generate-idea", "POST", {
        platform,
        field,
        additional_note: additionalNote,
      });

      if (response && response.ai_response) {
        setAiResponse(response.ai_response);
      } else {
        setError("Failed to get a valid response from the AI service.");
      }
    } catch (err) {
      setError(
        "An error occurred while generating the idea. Please try again."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-neutral-950 border-yellow-500/30 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-[#E0A800]">Generate a Custom Idea</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400">
              Platform
            </label>
            <Input
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              placeholder="e.g., Web, Mobile..."
              className="bg-neutral-900 border-gray-700 text-white"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {platformOptions.map((option) => (
                <Badge
                  key={option}
                  variant="outline"
                  onClick={() => handleBadgeClick(option, setPlatform)}
                  className="cursor-pointer hover:bg-neutral-700 border-gray-600 text-gray-300"
                >
                  {option}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-400">Field</label>
            <Input
              value={field}
              onChange={(e) => setField(e.target.value)}
              placeholder="e.g., Agriculture, Finance..."
              className="bg-neutral-900 border-gray-700 text-white"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {fieldOptions.map((option) => (
                <Badge
                  key={option}
                  variant="outline"
                  onClick={() => handleBadgeClick(option, setField)}
                  className="cursor-pointer hover:bg-neutral-700 border-gray-600 text-gray-300"
                >
                  {option}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-400">
              Additional Note (Optional)
            </label>
            <Textarea
              value={additionalNote}
              onChange={(e) => setAdditionalNote(e.target.value)}
              placeholder="e.g., focus on student productivity..."
              className="bg-neutral-900 border-gray-700 text-white"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E0A800] hover:bg-yellow-600 text-black"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading ? "Generating..." : "Generate Idea"}
          </Button>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-700/50 flex-1 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            Generated Idea
          </h3>
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-[#E0A800]" />
            </div>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {aiResponse && (
            <div className="p-4 bg-neutral-900 rounded-md">
              <p className="text-gray-200 whitespace-pre-wrap">{aiResponse}</p>
            </div>
          )}
          {!isLoading && !aiResponse && !error && (
            <p className="text-gray-500 text-sm">
              Your generated idea will appear here.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

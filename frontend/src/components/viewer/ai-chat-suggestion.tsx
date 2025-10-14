"use client";
import React, { useState, FormEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiCall } from "@/lib/api";
import { Loader2, Wand2 } from "lucide-react";
import { FormattedAiResponse } from "./formatted-ai-response"; // Import the new component

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
    <Card className="bg-neutral-950 border-yellow-500/30">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-[#E0A800]">
          AI Idea Generator
        </CardTitle>
        <CardDescription className="text-gray-400">
          Describe your desired project, and let AI create a detailed concept
          for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Panel: The Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
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
                  variant={platform === option ? "default" : "outline"}
                  onClick={() => handleBadgeClick(option, setPlatform)}
                  className="cursor-pointer hover:bg-neutral-700 border-gray-600 text-gray-300"
                >
                  {option}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Field
            </label>
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
                  variant={field === option ? "default" : "outline"}
                  onClick={() => handleBadgeClick(option, setField)}
                  className="cursor-pointer hover:bg-neutral-700 border-gray-600 text-gray-300"
                >
                  {option}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Additional Note (Optional)
            </label>
            <Textarea
              value={additionalNote}
              onChange={(e) => setAdditionalNote(e.target.value)}
              placeholder="e.g., focus on student productivity..."
              className="bg-neutral-900 border-gray-700 text-white min-h-[100px]"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E0A800] hover:bg-yellow-600 text-black font-bold"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Generating..." : "Generate Idea"}
          </Button>
        </form>

        {/* Right Panel: Result Display */}
        <div className="bg-neutral-900 rounded-lg p-4 flex flex-col h-[465px] border border-gray-800">
          <h3 className="text-lg font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-2">
            Generated Idea
          </h3>
          <div className="flex-1 overflow-y-auto pr-2">
            {isLoading && (
              <div className="flex flex-col justify-center items-center h-full text-gray-400">
                <Loader2 className="h-10 w-10 animate-spin text-[#E0A800] mb-4" />
                <p>Generating your next big idea...</p>
              </div>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {aiResponse && <FormattedAiResponse responseText={aiResponse} />}
            {!isLoading && !aiResponse && !error && (
              <div className="flex flex-col justify-center items-center h-full text-center text-gray-500">
                <Wand2 className="h-12 w-12 mb-4" />
                <p>Your generated idea will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

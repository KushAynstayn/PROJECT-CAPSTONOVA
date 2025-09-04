"use client";

import React from "react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";

// --- Mock Data Generation ---
// In a real app, this data would come from an API call.
const generateMockSuggestions = (count: number) => {
  const suggestions = [];
  const sampleTexts = [
    "Develop a mobile app for local community event management.",
    "AI-powered system for early detection of crop diseases.",
    "Blockchain-based solution for transparent supply chain tracking.",
    "A web platform for connecting student tutors with learners.",
    "IoT device for monitoring home water consumption and detecting leaks.",
    "Virtual reality simulation for training medical students in surgical procedures.",
  ];

  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i * 3); // Go back in time for variety
    suggestions.push({
      id: i + 1,
      description: sampleTexts[i % sampleTexts.length],
      timestamp: date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    });
  }
  return suggestions;
};

const AdviserSuggestionLog = () => {
  const suggestions = generateMockSuggestions(20);

  return (
    // This container enables the custom scrollbar
    <div className="flex-1 overflow-y-auto space-y-2 mt-2 pr-2">
      {suggestions.map((suggestion) => (
        <Card key={suggestion.id} className="w-full shadow-md">
          <CardContent className="p-2">
            <CardDescription className="text-md text-gray-700">
              {suggestion.description}
            </CardDescription>
            <p className="text-md text-gray-500 mt-2">{suggestion.timestamp}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdviserSuggestionLog;

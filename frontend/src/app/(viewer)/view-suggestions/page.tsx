"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AiSuggestionCard } from "@/components/viewer/ai-suggestion-card";
import { AdviserSuggestions } from "@/components/viewer/adviser-suggestions";

const ViewSuggestionsPage = () => {
  const aiSuggestionPrompts = [
    {
      category: "Web App",
      prompt:
        "Generate a capstone project idea for a web application that is innovative and uses modern technologies.",
    },
    {
      category: "Mobile App",
      prompt:
        "Generate a capstone project idea for a mobile application for students, focusing on productivity and collaboration.",
    },
    {
      category: "Desktop App",
      prompt:
        "Generate a capstone project idea for a desktop application for educational purposes, possibly for offline use.",
    },
    {
      category: "IoT",
      prompt:
        "Generate a capstone project idea for an Internet of Things (IoT) system for smart home automation and security.",
    },
    {
      category: "AI/ML",
      prompt:
        "Generate a capstone project idea involving Artificial Intelligence or Machine Learning to solve a real-world problem.",
    },
  ];

  return (
    // Added pt-8 to fix overlap with the navbar
    <div className="flex-1 p-6 md:p-8 pt-8 space-y-8 bg-black text-gray-200">
      {/* Search and Title Section */}
      <div className="mt-28 mb-18 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#E0A800]">Suggestions</h1>
        {/* The search bar here has been removed as requested */}
      </div>

      {/* AI Suggestions Carousel */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-[#E0A800]">
          AI-Powered Suggestions
        </h2>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {aiSuggestionPrompts.map((item, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <AiSuggestionCard
                    prompt={item.prompt}
                    category={item.category}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-white bg-neutral-800 hover:bg-neutral-700 border-gray-700" />
          <CarouselNext className="text-white bg-neutral-800 hover:bg-neutral-700 border-gray-700" />
        </Carousel>
      </div>

      {/* Adviser Suggestions Section - Now appears first visually */}
      <div className="mt-20">
        <h2 className="text-2xl font-semibold mb-4 text-[#E0A800]">
          Adviser Suggestions
        </h2>
        <Card className="bg-neutral-950 border-yellow-500/30">
          <CardContent className="p-4 md:p-6">
            <AdviserSuggestions />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewSuggestionsPage;

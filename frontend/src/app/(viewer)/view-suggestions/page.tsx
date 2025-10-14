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
import { AiChatSuggestion } from "@/components/viewer/ai-chat-suggestion";

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
    <div className="flex-1 p-6 md:p-8 pt-8 space-y-8 bg-black text-gray-200">
      {/* Search and Title Section */}
      <div className="mt-28 mb-18 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#E0A800]">Suggestions</h1>
      </div>

      {/* AI Suggestions and AI Chat Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Suggestions Carousel (Left Side) */}
        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-semibold mb-4 text-[#E0A800]">
            AI-Powered Suggestions
          </h2>
          <div className="flex-1 flex flex-col justify-center p-4 bg-neutral-950 border border-yellow-500/30 rounded-lg">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full max-w-xl mx-auto"
            >
              <CarouselContent>
                {aiSuggestionPrompts.map((item, index) => (
                  <CarouselItem key={index}>
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
        </div>

        {/* AI Chat Suggester (Right Side) */}
        <div className="flex flex-col h-full">
          {/* The AiChatSuggestion component is already designed to be self-contained and will match the height */}
          <AiChatSuggestion />
        </div>
      </div>

      {/* Adviser Suggestions Section */}
      <div className="mt-12">
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

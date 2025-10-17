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
        "Suggest a groundbreaking capstone project for a web application using any modern technology stack that is feasible for students.",
    },
    {
      category: "Mobile App",
      prompt:
        "Propose a unique capstone project idea for a mobile application that targets a niche student audience and is feasible for students.",
    },
    {
      category: "Desktop App",
      prompt:
        "Outline a concept for a desktop application that could be vital for offline educational scenarios and is feasible for students.",
    },
    {
      category: "IoT",
      prompt:
        "Generate a creative capstone project idea for an Internet of Things (IoT) system that enhances daily life and is feasible for students.",
    },
    {
      category: "AI/ML",
      prompt:
        "Describe an innovative capstone project that uses AI or Machine Learning to tackle a complex, real-world challenge and is feasible for students.",
    },
  ];

  return (
    <div className="flex-1 p-6 md:p-8 pt-8 space-y-8 bg-black text-gray-200">
      {/* Title Section */}
      <div className="mt-28 mb-18 flex justify-between items-center">
        <h1 className="text-3xl text-[#E0A800]"
            style={{ fontFamily: "'Black Ops One', sans-serif" }}>Suggestions</h1>
      </div>

      {/* AI-Powered Prompt Suggestions Carousel */}
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

      {/* AI Idea Generator Section */}
      <div className="pt-8">
        <AiChatSuggestion />
      </div>

      {/* Adviser Suggestions Section */}
      <div className="pt-8">
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

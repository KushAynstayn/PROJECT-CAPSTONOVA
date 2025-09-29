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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { AdvancedSearchModal } from "@/components/ui/advanced-search-modal";
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
    <div className="flex-1 p-6 space-y-6 bg-gray-900 text-white">
      {/* Search and Title Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Suggestions</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search projects..."
            className="w-64 bg-gray-800 border-gray-700 placeholder-gray-400"
          />
          <Button variant="outline" size="icon" className="border-gray-700">
            <Search className="h-5 w-5" />
          </Button>
          <AdvancedSearchModal>
            <Button variant="outline" size="icon" className="border-gray-700">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </AdvancedSearchModal>
        </div>
      </div>

      {/* AI Suggestions Carousel */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-purple-300">
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
          <CarouselPrevious className="text-white bg-gray-800 hover:bg-gray-700" />
          <CarouselNext className="text-white bg-gray-800 hover:bg-gray-700" />
        </Carousel>
      </div>

      {/* Adviser Suggestions Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Adviser Suggestions</h2>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <AdviserSuggestions />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewSuggestionsPage;

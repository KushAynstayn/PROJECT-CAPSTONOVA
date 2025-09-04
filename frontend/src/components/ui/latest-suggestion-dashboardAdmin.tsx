"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter, // 1. Import CardFooter
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const LatestSuggestion = () => {
  const suggestion = {
    adviser: "Monkey D. Luffy",
    avatar: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion:
      "Consider integrating a real-time collaboration feature to allow multiple students to edit the proposal simultaneously. This will greatly improve the team's efficiency and communication.",
  };

  return (
    // 2. Added `h-full` to make the card fill its container vertically
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Latest Suggestion</CardTitle>
      </CardHeader>
      {/* 3. Added `flex-1` to make this content area grow and fill available space */}
      <CardContent className="flex-1">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={suggestion.avatar}
              alt={suggestion.adviser}
              className="h-10 w-10"
            />
            <AvatarFallback>ML</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">
              {suggestion.adviser}
            </p>
            <p className="text-sm text-muted-foreground">Adviser</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-700">
          {suggestion.suggestion}
        </p>
      </CardContent>
      {/* 4. Moved the Button into a separate CardFooter for better structure */}
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Suggestions
        </Button>
      </CardFooter>
    </Card>
  );
};
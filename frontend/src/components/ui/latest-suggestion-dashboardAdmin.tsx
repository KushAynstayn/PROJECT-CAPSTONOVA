"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"; // Import the Button component

export const LatestSuggestion = () => {
  const suggestion = {
    adviser: "Monkey D. Luffy",
    avatar: "https://i.ibb.co/L8dYt3Y/Luffy.jpg",
    suggestion:
      "Consider integrating a real-time collaboration feature to allow multiple students to edit the proposal simultaneously. This will greatly improve the team's efficiency and communication.",
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Latest Suggestion</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col justify-between">
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
        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="w-full">
            View All Suggestions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
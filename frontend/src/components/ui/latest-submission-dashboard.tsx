"use client";

// 1. Import CardFooter from the correct shadcn/ui library
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const description = "A bar chart with a label";

export function LatestSubmission() {
  return (
    // 2. Make the Card a flex container to manage its children's layout
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Latest Submission</CardTitle>
      </CardHeader>

      {/* 3. Use flex-1 on CardContent to make it fill the remaining space */}
      <CardContent className="flex-1">
        <div className="flex flex-col space-y-3 text-sm text-muted-foreground">
          <p className="font-medium text-primary break-words">
            Smart Library Management System with QR Code Integration
          </p>
          <div className="flex flex-col space-y-1">
            <span>Submitted by Mark John C. Lucas</span>
            <span>Adviser: Dr. Luke Tan</span>
            <span>Date Submitted: November 20, 2024</span>
          </div>
        </div>
      </CardContent>

      {/* 4. Move the Button into a semantic CardFooter */}
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Projects
        </Button>
      </CardFooter>
    </Card>
  );
}
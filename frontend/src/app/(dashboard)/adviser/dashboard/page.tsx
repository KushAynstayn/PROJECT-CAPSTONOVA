import React from "react"
// We will import the specific card components you need for your dashboard
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// This is the content that will be placed inside your sidebar layout
export default function AdviserDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        {/* You can add a button here if needed */}
      </div>

      {/* Main Grid for Dashboard Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Main Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Input
            type="search"
            placeholder="Search more capstone projects here..."
            className="w-full"
          />

          <Card>
            <CardHeader>
              <CardTitle>Your Suggestion log</CardTitle>
              <Button variant="link" className="absolute top-4 right-4">See all</Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Suggestion content will go here...
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects Under Your Advisory</CardTitle>
               <Button variant="link" className="absolute top-4 right-4">See all</Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A list of projects will go here...
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Advisee</CardTitle>
               <Button variant="link" className="absolute top-4 right-4">See all</Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                List of advisees will go here...
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adviser's Overview Analytics</CardTitle>
               <Button variant="link" className="absolute top-4 right-4">See all</Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold">10</span>
                    <span className="text-muted-foreground">Projects</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold">10</span>
                    <span className="text-muted-foreground">Suggestions</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold">10</span>
                    <span className="text-muted-foreground">Advisees</span>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

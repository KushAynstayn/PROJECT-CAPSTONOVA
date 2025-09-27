"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for technology co-occurrence.
// The matrix shows how many times technologies were used together.
// For example, matrix[0][1] is the count for React + Node.js
const dataByYear: Record<number, { technologies: string[]; matrix: number[][] }> = {
  2024: {
    technologies: ["React", "Node.js", "Python", "AWS", "Docker", "Next.js"],
    matrix: [
      [200, 150, 40, 90, 110, 180], // React
      [150, 180, 70, 80, 100, 140], // Node.js
      [40, 70, 150, 60, 50, 20],   // Python
      [90, 80, 60, 120, 105, 85],  // AWS
      [110, 100, 50, 105, 130, 100], // Docker
      [180, 140, 20, 85, 100, 190], // Next.js
    ],
  },
  2025: {
    technologies: ["React", "Node.js", "Python", "AWS", "Docker", "Next.js"],
    matrix: [
      [220, 170, 50, 110, 130, 200], // React
      [170, 200, 80, 95, 120, 160], // Node.js
      [50, 80, 180, 75, 60, 30],   // Python
      [110, 95, 75, 150, 125, 100],  // AWS
      [130, 120, 60, 125, 160, 120], // Docker
      [200, 160, 30, 100, 120, 210], // Next.js
    ],
  },
};

// A helper function to determine the cell color based on its value
// This creates the "heatmap" effect.
const getColorForValue = (value: number, max: number) => {
  if (value === 0) return "bg-gray-800/50";
  const intensity = Math.sqrt(value / max); // Use sqrt for better visual distribution
  if (intensity < 0.2) return "bg-amber-900/60 text-amber-200";
  if (intensity < 0.4) return "bg-amber-800/70 text-amber-100";
  if (intensity < 0.6) return "bg-amber-700/80 text-yellow-100";
  if (intensity < 0.8) return "bg-amber-600 text-yellow-50";
  return "bg-amber-500 text-black";
};

export function TechStackChart({ year }: { year: number }) {
  const data = dataByYear[year] ?? dataByYear[2025];
  const { technologies, matrix } = data;

  // Find the max value (on the diagonal) for color scaling, ignoring self-comparison
  const maxValue = Math.max(...matrix.flatMap((row, i) => row.filter((_, j) => i !== j)));

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg text-yellow-400">
          Technology Stack Insights
        </CardTitle>
        <CardDescription className="text-gray-400">
          Co-occurrence of popular technologies in {year}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="border-collapse">
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="w-24 border-r border-gray-700"></TableHead>
                {technologies.map((tech) => (
                  <TableHead key={tech} className="text-center text-yellow-400">
                    {tech}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {technologies.map((tech, rowIndex) => (
                <TableRow key={tech} className="border-gray-700">
                  <TableHead className="font-bold text-yellow-400 border-r border-gray-700">
                    {tech}
                  </TableHead>
                  {matrix[rowIndex].map((value, colIndex) => {
                    const isDiagonal = rowIndex === colIndex;
                    const cellColor = isDiagonal
                      ? "bg-gray-700 font-bold" // Style for total usage
                      : getColorForValue(value, maxValue);
                    
                    const tech1 = technologies[rowIndex];
                    const tech2 = technologies[colIndex];
                    const tooltipText = isDiagonal
                      ? `${tech1} was used in ${value} projects.`
                      : `${tech1} and ${tech2} were used together in ${value} projects.`;

                    return (
                      <TableCell
                        key={`${rowIndex}-${colIndex}`}
                        className={`text-center font-mono text-sm transition-colors ${cellColor}`}
                        title={tooltipText}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
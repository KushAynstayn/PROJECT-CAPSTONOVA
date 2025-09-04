"use client";

import React, { useState } from 'react';
import { ModifiedPieChart } from "@/components/ui/chart-pie-donut-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { YearPicker } from "@/components/ui/year-picker"; // 1. Import YearPicker
import { Button } from "@/components/ui/button"; // 2. Import Button

const AdminReportsPage = () => {
    const [activeTab, setActiveTab] = useState('project');

    // --- 3. ADDED: State for the new YearPicker ---
    const [pickerMode, setPickerMode] = useState<'single' | 'range'>('range'); // Default to range
    const currentYear = new Date().getFullYear();
    const [singleYear, setSingleYear] = useState<number | undefined>(currentYear);
    const [startYear, setStartYear] = useState<number | undefined>(2020); // Default start
    const [endYear, setEndYear] = useState<number | undefined>(currentYear); // Default end
    const fromYear = 2020;
    const toYear = currentYear;
    // --- END: State for the new YearPicker ---

    const legendData = [
        { course: "BIT-CT", color: "#cc3333" }, // Red
        { course: "BSIS", color: "#0c284d" },  // Dark Blue
        { course: "BSIT", color: "#fec832" },  // Yellow/Gold
    ];

    // --- 4. ADDED: Handlers for the YearPicker ---
    const handleModeToggle = () => {
        const newMode = pickerMode === "single" ? "range" : "single";
        setPickerMode(newMode);

        if (newMode === "range") {
          // When switching to range, default to a sensible range
          setStartYear(fromYear);
          setEndYear(toYear);
        } else {
          // When switching to single, default to the current year
          setSingleYear(currentYear);
        }
    };

    const handleStartYearChange = (year: number | undefined) => {
        setStartYear(year);
        // If the start year goes past the end year, reset the end year
        if (endYear && year && endYear < year) {
            setEndYear(undefined);
        }
    };
    // --- END: Handlers for the YearPicker ---

    return (
        <div>
            <div className="flex justify-start space-x-8">
                <button
                    onClick={() => setActiveTab('project')}
                    className={`
                        text-lg font-semibold pb-2 transition-colors duration-200
                        ${activeTab === 'project'
                            ? 'text-[#511b10] border-b-2 border-[#511b10]'
                            : 'text-gray-400'
                        }
                    `}
                >
                    Project Reports
                </button>
            </div>

            {/* Content for Project Reports Tab */}
            {activeTab === 'project' && (
                <div className="mt-8">
                    {/* --- 5. REPLACED: Old dropdowns are now the new YearPicker --- */}
                    <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row">
                        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
                            {pickerMode === "single" ? (
                                <YearPicker
                                    year={singleYear}
                                    setYear={setSingleYear}
                                    placeholder="Select year"
                                    fromYear={fromYear}
                                    toYear={toYear}
                                />
                            ) : (
                                <>
                                    <YearPicker
                                        year={startYear}
                                        setYear={handleStartYearChange}
                                        placeholder="Start year"
                                        fromYear={fromYear}
                                        toYear={toYear}
                                    />
                                    <YearPicker
                                        year={endYear}
                                        setYear={setEndYear}
                                        placeholder="End year"
                                        fromYear={startYear || fromYear}
                                        toYear={toYear}
                                        disabled={!startYear}
                                    />
                                </>
                            )}
                            <Button variant="outline" onClick={handleModeToggle}>
                                {pickerMode === "single" ? "Select Range" : "Select Single Year"}
                            </Button>
                        </div>
                    </div>
                    {/* --- END: New YearPicker section --- */}

                    <div className="grid grid-cols-[max-content_min-content] grid-rows-2 gap-8">
                        <div className="p-4 border border-gray-200 bg-white rounded-lg shadow-md row-span-2">
                            <div className="flex flex-col md:flex-row md:items-start gap-8">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Submission Per Course</h2>
                                    <ModifiedPieChart size={400} />
                                </div>
                                <div className="flex flex-col gap-2 md:pt-12">
                                    {legendData.map((item) => (
                                        <div key={item.course} className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-gray-700">{item.course}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Card className="w-60 text-center flex flex-col justify-center h-full">
                            <CardHeader className="pt-6 pb-2">
                                <CardTitle className="text-lg font-semibold text-gray-700">Total Submission</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-6">
                                <p className="text-5xl font-bold text-gray-900">35</p>
                            </CardContent>
                        </Card>
                        <Card className="w-60 text-center flex flex-col justify-center h-full">
                            <CardHeader className="pt-6 pb-2">
                                <CardTitle className="text-lg font-semibold text-gray-700">Total Archived</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-6">
                                <p className="text-5xl font-bold text-gray-900">5</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReportsPage;

"use client";

import React, { useState } from 'react';
import { ModifiedPieChart } from "@/components/ui/chart-pie-donut-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminDistributionChart } from "@/components/ui/chart-pie-label";
import { AdviserDistributionChart } from "@/components/ui/chart-pie-interactive";
import { GuestDistributionChart } from "@/components/ui/chart-bar-interactive";
import { ProponentDistributionChart } from "@/components/ui/chart-pie-stacked";
import { YearPicker } from "@/components/ui/year-picker";
import { Button } from "@/components/ui/button";

const SuperAdminReportsPage = () => {
    const [activeTab, setActiveTab] = useState('project');
    
    // State for the new YearPicker
    const currentYear = new Date().getFullYear();
    const [pickerMode, setPickerMode] = useState<'single' | 'range'>('single');
    const [singleYear, setSingleYear] = useState<number | undefined>(currentYear);
    const [startYear, setStartYear] = useState<number | undefined>();
    const [endYear, setEndYear] = useState<number | undefined>();
    const fromYear = 2020;
    const toYear = currentYear;

    const legendData = [
        { course: "BIT-CT", color: "#cc3333" }, // Red
        { course: "BSIS", color: "#0c284d" },   // Dark Blue
        { course: "BSIT", color: "#fec832" },   // Yellow/Gold
    ];

    // Handlers for the YearPicker
    const handleModeToggle = () => {
        const newMode = pickerMode === 'single' ? 'range' : 'single';
        setPickerMode(newMode);

        if (newMode === 'range') {
            setStartYear(fromYear);
            setEndYear(toYear);
        } else {
            setSingleYear(toYear);
            setStartYear(undefined);
            setEndYear(undefined);
        }
    };
    
    const handleStartYearChange = (year: number | undefined) => {
        setStartYear(year);
        if (endYear && year && endYear < year) {
            setEndYear(undefined);
        }
    };
    
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
                <button 
                    onClick={() => setActiveTab('user')} 
                    className={`
                        text-lg font-semibold pb-2 transition-colors duration-200
                        ${activeTab === 'user' 
                            ? 'text-[#511b10] border-b-2 border-[#511b10]' 
                            : 'text-gray-400'
                        }
                    `}
                >
                    User Account Report
                </button>
            </div>

            {/* Content for Project Reports Tab */}
            {activeTab === 'project' && (
                <div className="mt-8">
                    <div className="inline-flex items-center gap-4 mb-8">
                        <span className="text-gray-700 font-bold">Select Year:</span>
                        {pickerMode === 'single' ? (
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
                            {pickerMode === 'single' ? 'Select Range' : 'Select Single Year'}
                        </Button>
                    </div>
                    
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

            {/* Content for User Account Report Tab */}
            {activeTab === 'user' && (
                <div className="mt-8">
                    <div className="inline-flex items-center gap-4 mb-8">
                        <span className="text-gray-700 font-bold">Select Year:</span>
                        {pickerMode === 'single' ? (
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
                            {pickerMode === 'single' ? 'Select Range' : 'Select Single Year'}
                        </Button>
                    </div>
                    
                    <div className="flex flex-row items-start gap-8">
                        <div className="flex flex-col gap-8">
                            <AdminDistributionChart />
                            <AdviserDistributionChart />
                        </div>
                        <div className="flex flex-col gap-8">
                            <GuestDistributionChart />
                            <ProponentDistributionChart />
                        </div>
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

export default SuperAdminReportsPage;
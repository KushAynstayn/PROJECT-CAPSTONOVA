"use client";

import React, { useState } from 'react';
import { ModifiedPieChart } from "@/components/ui/chart-pie-donut-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminDistributionChart } from "@/components/ui/chart-pie-label";
import { AdviserDistributionChart } from "@/components/ui/chart-pie-interactive";
import { GuestDistributionChart } from "@/components/ui/chart-bar-interactive";
import { ProponentDistributionChart } from "@/components/ui/chart-pie-stacked";

const SuperAdminReportsPage = () => {
    const [activeTab, setActiveTab] = useState('project');
    const [startYear, setStartYear] = useState(2020);
    const [endYear, setEndYear] = useState(new Date().getFullYear());
    
    const legendData = [
        { course: "BIT-CT", color: "#cc3333" }, // Red
        { course: "BSIS", color: "#0c284d" },  // Dark Blue
        { course: "BSIT", color: "#fec832" },  // Yellow/Gold
    ];
    
    const generateYears = () => {
        const years = [];
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= 2020; year--) {
            years.push(year);
        }
        return years;
    };

    const availableYears = generateYears();

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
                    <div className="inline-flex items-center gap-4 border border-gray-300 bg-white p-3 mb-8">
                        <span className="text-gray-700 font-bold">Select Year:</span>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700">From:</span>
                            <div className="relative">
                                <select
                                    value={startYear}
                                    onChange={(e) => setStartYear(parseInt(e.target.value))}
                                    className="border border-gray-400 py-2 pl-4 pr-8 focus:outline-none appearance-none"
                                >
                                    {availableYears.map((year) => (
                                        <option key={`start-${year}`} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <span>To:</span>
                            <div className="relative">
                                <select
                                    value={endYear}
                                    onChange={(e) => setEndYear(parseInt(e.target.value))}
                                    className="border border-gray-400 py-2 pl-4 pr-8 focus:outline-none appearance-none"
                                >
                                    {availableYears.map((year) => (
                                        <option key={`end-${year}`} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>
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
        </div>
    );
};

export default SuperAdminReportsPage;

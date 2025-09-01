// pages/UploadProjectPage.tsx
"use client";

import React, { useState } from "react";
import MultiSelectCombobox from "@/components/ui/multi-select-combobox";
import Combobox from "@/components/ui/combobox";
import { FileUpload } from "@/components/ui/file_upload";
import { SubmitSucessfully } from "@/components/ui/submit-successfully";
import { SubmittedManuscriptView } from "@/data/submitted-manuscript";

// Define the User type to resolve "Cannot find name 'User'" error.
interface User {
  themes: string[];
  platform: string[];
  repository: string;
}

const Label = ({ htmlFor, className, children }: any) => (
  <label htmlFor={htmlFor} className={`font-bold ${className}`}>
    {children}
  </label>
);

const UploadProjectPage = () => {
  const [formData, setFormData] = useState<User>({
    themes: [],
    platform: [],
    repository: "",
  });

  const [submissionCompleted, setSubmissionCompleted] = useState(false); // New state to control visibility

  const handleThemesChange = (values: string[]) => {
    setFormData({ ...formData, themes: values });
  };

  const handlePlatformChange = (values: string[]) => {
    setFormData({ ...formData, platform: values });
  };

  const handleRepositoryChange = (value: string) => {
    setFormData({ ...formData, repository: value });
  };

  const handleSubmissionSuccess = () => {
    setSubmissionCompleted(true); // Set state to show the manuscript view
  };

  // Conditionally render the entire page content based on submission status
  if (submissionCompleted) {
    return <SubmittedManuscriptView />;
  }

  return (
    <div className="pl-50 pr-50">
      {/*--Upload manuscript container--*/}
      <div className="ml-15 mr-15 border-4 border-dashed border-gray p-8 flex flex-col items-center space-y-4 rounded-lg">
        <img src="/images/folder.png" className="h-15 w-15" />
        <h2 className="text-2xl font-bold">Upload Capstone Manuscript File</h2>
        <h1 className="text-1xl font-normal">
          Drag and drop your file here or select a file
        </h1>
        <FileUpload />
      </div>

      {/*  Study Theme Keywords - MultiSelect Combobox */}
      <div className="mt-6">
        <Label className="block mb-2 text-1xl font-bold text-gray-800">
          Study Theme Keywords
        </Label>
        <MultiSelectCombobox
          value={formData.themes}
          onValueChange={handleThemesChange}
          items={[
            { value: "agriculture", label: "Agriculture" },
            { value: "commerce", label: "Commerce" },
            { value: "disaster_management", label: "Disaster Management" },
            { value: "education", label: "Education" },
            { value: "environment", label: "Environment" },
            { value: "governance", label: "Governance" },
            { value: "health_care", label: "Health Care" },
            { value: "home", label: "Home" },
            { value: "livelihood", label: "Livelihood" },
            { value: "media_entertainment", label: "Media and Entertainment" },
            {
              value: "lifestyle_people_on_the_go",
              label: "Lifestyle / People-on-the-Go",
            },
            { value: "power_energy", label: "Power and Energy" },
            { value: "social_sciences", label: "Social Sciences" },
            { value: "telecommunications", label: "Telecommunications" },
            { value: "tourism", label: "Tourism" },
            { value: "transportation", label: "Transportation" },
          ]}
          placeholder="Select study themes"
          className="text-1xl font-semibold rounded-md"
        />
      </div>

      {/*  Platform type - MultiSelect Combobox */}
      <div className="mt-6">
        <Label className="block mb-2 text-1xl font-bold text-gray-800">
          Platform Type
        </Label>
        <MultiSelectCombobox
          value={formData.platform}
          onValueChange={handlePlatformChange}
          items={[
            { value: "web", label: "Website Application" },
            { value: "mobile", label: "Mobile Application" },
            { value: "hybrid", label: "Web and Mobile App" },
            { value: "IoT", label: "Internet of Things" },
            { value: "web1", label: "Software" },
            { value: "mobile2", label: "Hardware" },
            { value: "hybrid3", label: "System" },
            { value: "IoT4", label: "Traditional" },
          ]}
          placeholder="Select platform type"
          className="text-1xl font-semibold rounded-md"
        />
      </div>

      <div className="mt-15">
        {/*--Upload source code container--*/}
        <div className="ml-15 mr-15 border-4 border-dashed border-gray p-8 flex flex-col items-center space-y-4 rounded-lg">
          <img src="/images/folder.png" className="h-15 w-15" />
          <h2 className="text-2xl font-bold">
            Upload Capstone Source Code File
          </h2>
          <h1 className="text-5m font-normal">
            Drag and drop your file here or select a file
          </h1>
          <FileUpload />
        </div>
      </div>

      {/*  Repository URL - Combobox */}
      <div className="mt-6">
        <Label className="block mb-2 text-1xl font-bold text-gray-800">
          Repository URL
        </Label>
        <Combobox
          value={formData.repository}
          onValueChange={handleRepositoryChange}
          items={[
            { value: "r1", label: "Github.com/project-a" },
            { value: "r2", label: "Github.com/project-b" },
            { value: "r3", label: "Github.com/project-c" },
            { value: "r4", label: "Github.com/project-d" },
            { value: "r5", label: "Github.com/project-e" },
            { value: "r6", label: "Github.com/project-f" },
            { value: "r7", label: "Github.com/project-g" },
            { value: "r8", label: "Github.com/project-h" },
            { value: "r9", label: "Github.com/project-i" },
            { value: "r10", label: "Github.com/project-x" },
          ]}
          placeholder="Github.com/project-x"
          className="text-1xl font-semibold rounded-md"
        />
      </div>

      <div className="flex justify-center items-center gap-2 mt-30">
        <img src="/images/warning.png" className="h-8 w-8" />
        <h1 className="text-1xl text-red-500 font-bold">
          Please check before submitting. You won't be able to change this once
          submitted.
        </h1>
      </div>

      <div className="w-full flex justify-end mt-10">
        <SubmitSucessfully onSuccess={handleSubmissionSuccess} />
      </div>
    </div>
  );
};

export default UploadProjectPage;
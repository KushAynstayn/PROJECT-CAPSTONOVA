// (MODIFIED)
// Location: frontend/src/app/(dashboard)/proponent/upload-project/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ManuscriptUploadModal } from "../../../../components/proponent/upload-manuscript-modal";
import { SourceCodeUploadModal } from "../../../../components/proponent/upload-source-code-modal";
import { SubmittedManuscriptView } from "../../../../data/submitted-manuscript";
import { apiCall } from "@/lib/api";

const UploadProjectPage = () => {
  const [isManuscriptModalOpen, setIsManuscriptModalOpen] = useState(false);
  const [isSourceCodeModalOpen, setIsSourceCodeModalOpen] = useState(false);

  // States to track submission status
  const [manuscriptSubmitted, setManuscriptSubmitted] = useState(false);
  const [sourceCodeSubmitted, setSourceCodeSubmitted] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if a manuscript has already been submitted on page load
  useEffect(() => {
    const checkSubmissionStatus = async () => {
      try {
        const hasManuscript = await apiCall("/util/check-manuscript", "POST");
        setManuscriptSubmitted(hasManuscript);
        const hasSourceCode = await apiCall("/util/check-source-code", "POST");
        setSourceCodeSubmitted(hasSourceCode);
      } catch (error) {
        console.error("Failed to check submission status:", error);
        // Optionally, show an error message to the user
      } finally {
        setIsChecking(false);
      }
    };

    checkSubmissionStatus();
  }, []);

  const handleManuscriptSuccess = () => {
    setManuscriptSubmitted(true);
  };

  const handleSourceCodeSuccess = () => {
    setSourceCodeSubmitted(true);
  };

  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Checking submission status...</p>
      </div>
    );
  }

  if (manuscriptSubmitted && sourceCodeSubmitted) {
    return <SubmittedManuscriptView />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800">
          Upload Your Project
        </h1>
        <p className="text-muted-foreground mt-2">
          Please upload both your manuscript and source code to complete your
          submission.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        {/* Upload Manuscript Section */}
        <div className="border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center space-y-4 rounded-lg text-center">
          <img
            src="/images/folder.png"
            alt="Manuscript Folder"
            className="h-20 w-20"
          />
          <h2 className="text-2xl font-bold">Capstone Manuscript</h2>
          <p className="text-muted-foreground">
            Submit your project details, manuscript, and ACM file.
          </p>
          <Button
            onClick={() => setIsManuscriptModalOpen(true)}
            disabled={manuscriptSubmitted}
            className={
              manuscriptSubmitted
                ? "bg-green-600 hover:bg-green-700 cursor-not-allowed"
                : ""
            }
          >
            {manuscriptSubmitted ? "Already Submitted" : "Upload Manuscript"}
          </Button>
        </div>

        {/* Upload Source Code Section */}
        <div className="border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center space-y-4 rounded-lg text-center">
          <img
            src="/images/folder.png"
            alt="Source Code Folder"
            className="h-20 w-20"
          />
          <h2 className="text-2xl font-bold">Source Code</h2>
          <p className="text-muted-foreground">
            Provide a link to your GitHub repository or upload a .tar file.
          </p>
          <Button
            onClick={() => setIsSourceCodeModalOpen(true)}
            disabled={sourceCodeSubmitted || !manuscriptSubmitted}
            className={
              sourceCodeSubmitted
                ? "bg-green-600 hover:bg-green-700 cursor-not-allowed"
                : ""
            }
          >
            {sourceCodeSubmitted ? "Submitted ✓" : "Upload Source Code"}
          </Button>
        </div>
      </div>

      <ManuscriptUploadModal
        isOpen={isManuscriptModalOpen}
        onOpenChange={setIsManuscriptModalOpen}
        onSuccess={handleManuscriptSuccess}
      />
      <SourceCodeUploadModal
        isOpen={isSourceCodeModalOpen}
        onOpenChange={setIsSourceCodeModalOpen}
        onSuccess={handleSourceCodeSuccess}
      />

      <div className="flex justify-center items-center gap-2 mt-20">
        <img src="/images/warning.png" alt="Warning" className="h-8 w-8" />
        <h1 className="text-lg text-red-500 font-bold">
          Please check your files before submitting. You won&apos;t be able to
          change them after submission.
        </h1>
      </div>
    </div>
  );
};

export default UploadProjectPage;

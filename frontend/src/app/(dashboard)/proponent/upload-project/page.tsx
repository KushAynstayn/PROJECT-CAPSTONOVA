// [MODIFIED FILE]
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ManuscriptUploadModal } from "../../../../components/proponent/upload-manuscript-modal";
import { SourceCodeUploadModal } from "../../../../components/proponent/upload-source-code-modal";
import { UploadUserManualModal } from "../../../../components/proponent/UploadUserManualModal";
import { UploadUsageGuideModal } from "../../../../components/proponent/UploadUsageGuideModal";
import SubmittedManuscriptView from "../../../../components/proponent/submitted-manuscript-view";
import { apiCall } from "@/lib/api";
import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  FileText,
  Code,
  BookUser,
  Lightbulb,
  ChevronRight,
} from "lucide-react"; // --- NEW IMPORTS ---
import { cn } from "@/lib/utils"; // --- NEW IMPORT ---

// --- NEW: Step Navigator Component ---
interface StepItemProps {
  title: string;
  icon: React.ReactNode;
  status: "completed" | "active" | "pending" | "locked";
  onClick: () => void;
}

const StepItem: React.FC<StepItemProps> = ({
  title,
  icon,
  status,
  onClick,
}) => {
  const isLocked = status === "locked";
  const isActive = status === "active";
  const isCompleted = status === "completed";

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={cn(
        "flex-1 p-4 flex flex-col items-center justify-center border-b-4 transition-all duration-200",
        isActive
          ? "border-blue-600 bg-blue-50"
          : "border-transparent text-gray-500 hover:bg-gray-100",
        isCompleted ? "border-green-600 text-green-700 bg-green-50" : "",
        isLocked
          ? "border-transparent text-gray-400 bg-gray-50 cursor-not-allowed"
          : "cursor-pointer"
      )}
    >
      <div className="flex items-center gap-2">
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : isLocked ? (
          <Lock className="w-5 h-5" />
        ) : (
          icon
        )}
        <span className="text-sm font-semibold">{title}</span>
      </div>
    </button>
  );
};

const UploadProjectPage = () => {
  // --- ORIGINAL STATE (Unchanged) ---
  const [isManuscriptModalOpen, setIsManuscriptModalOpen] = useState(false);
  const [isSourceCodeModalOpen, setIsSourceCodeModalOpen] = useState(false);
  const [isUserManualModalOpen, setIsUserManualModalOpen] = useState(false);
  const [isUsageGuideModalOpen, setIsUsageGuideModalOpen] = useState(false);

  const [manuscriptSubmitted, setManuscriptSubmitted] = useState(false);
  const [sourceCodeSubmitted, setSourceCodeSubmitted] = useState(false);
  const [userManualSubmitted, setUserManualSubmitted] = useState(false);
  const [usageGuideSubmitted, setUsageGuideSubmitted] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // --- NEW STATE: To control the carousel view ---
  const [currentStep, setCurrentStep] = useState(1);

  // --- ORIGINAL LOGIC (Unchanged) ---
  useEffect(() => {
    const checkSubmissionStatus = async () => {
      try {
        const hasManuscript = await apiCall("/util/check-manuscript", "POST");
        setManuscriptSubmitted(hasManuscript);

        const hasSourceCode = await apiCall("/util/check-source-code", "POST");
        setSourceCodeSubmitted(hasSourceCode);

        const hasUserManual = await apiCall("/util/check-user-manual", "GET");
        setUserManualSubmitted(hasUserManual.exists);

        const hasUsageGuide = await apiCall("/util/check-usage-guide", "GET");
        setUsageGuideSubmitted(hasUsageGuide.exists);
      } catch (error) {
        console.error("Failed to check submission status:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkSubmissionStatus();
  }, []);

  // --- NEW EFFECT: Automatically advance the step ---
  useEffect(() => {
    if (isChecking) return;

    if (!manuscriptSubmitted) {
      setCurrentStep(1);
    } else if (!sourceCodeSubmitted) {
      setCurrentStep(2);
    } else if (!userManualSubmitted) {
      setCurrentStep(3);
    } else if (!usageGuideSubmitted) {
      setCurrentStep(4);
    }
  }, [
    isChecking,
    manuscriptSubmitted,
    sourceCodeSubmitted,
    userManualSubmitted,
    usageGuideSubmitted,
  ]);

  // --- ORIGINAL LOGIC (Unchanged) ---
  const handleManuscriptSuccess = () => {
    setManuscriptSubmitted(true);
  };

  const handleSourceCodeSuccess = () => {
    setSourceCodeSubmitted(true);
  };

  const handleUserManualSuccess = () => {
    setUserManualSubmitted(true);
  };

  const handleUsageGuideSuccess = () => {
    setUsageGuideSubmitted(true);
  };

  // --- ORIGINAL LOGIC (Unchanged) ---
  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Checking submission status...</p>
      </div>
    );
  }

  const allDocumentsSubmitted =
    manuscriptSubmitted &&
    sourceCodeSubmitted &&
    userManualSubmitted &&
    usageGuideSubmitted;

  if (allDocumentsSubmitted) {
    return <SubmittedManuscriptView />;
  }

  // --- NEW: Status logic for step navigator ---
  const getStatus = (
    stepNumber: number,
    isSubmitted: boolean,
    isLocked: boolean
  ) => {
    if (isSubmitted) return "completed";
    if (isLocked) return "locked";
    if (currentStep === stepNumber) return "active";
    return "pending";
  };

  const manuscriptStatus = getStatus(1, manuscriptSubmitted, false);
  const sourceCodeStatus = getStatus(
    2,
    sourceCodeSubmitted,
    !manuscriptSubmitted
  );
  const manualStatus = getStatus(3, userManualSubmitted, !sourceCodeSubmitted);
  const guideStatus = getStatus(4, usageGuideSubmitted, !sourceCodeSubmitted); // Locked until source code is in

  return (
    <div className="container mx-auto max-w-5xl p-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Upload Your Project
        </h1>
        <p className="text-muted-foreground mt-2">
          Please upload all required files to complete your submission.
        </p>
      </div>

      {/* --- MODIFIED: Warning message moved to top --- */}
      <div className="flex justify-center items-center gap-3 p-4 mb-8 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="h-8 w-8 text-red-500 flex-shrink-0" />
        <h1 className="text-base text-red-600 font-semibold">
          Please check your files before submitting. You won&apos;t be able to
          change them after submission.
        </h1>
      </div>

      {/* --- NEW: Step Navigator --- */}
      <div className="flex w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <StepItem
          title="Manuscript"
          icon={<FileText className="w-5 h-5" />}
          status={manuscriptStatus}
          onClick={() => setCurrentStep(1)}
        />
        <StepItem
          title="Source Code"
          icon={<Code className="w-5 h-5" />}
          status={sourceCodeStatus}
          onClick={() => setCurrentStep(2)}
        />
        <StepItem
          title="System Manual"
          icon={<BookUser className="w-5 h-5" />}
          status={manualStatus}
          onClick={() => setCurrentStep(3)}
        />
        <StepItem
          title="User Guide"
          icon={<Lightbulb className="w-5 h-5" />}
          status={guideStatus}
          onClick={() => setCurrentStep(4)}
        />
      </div>

      {/* --- NEW: Carousel Content Area --- */}
      <div className="mt-8">
        {/* Step 1: Manuscript */}
        {currentStep === 1 && (
          <div className="border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center space-y-4 rounded-lg text-center bg-white">
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
              disabled={manuscriptSubmitted} // Original logic
              className={
                manuscriptSubmitted
                  ? "bg-green-600 hover:bg-green-700 cursor-not-allowed"
                  : ""
              }
            >
              {manuscriptSubmitted ? "Already Submitted" : "Upload Manuscript"}
            </Button>
          </div>
        )}

        {/* Step 2: Source Code */}
        {currentStep === 2 && (
          <div className="border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center space-y-4 rounded-lg text-center bg-white">
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
              disabled={sourceCodeSubmitted || !manuscriptSubmitted} // Original logic
              className={
                sourceCodeSubmitted
                  ? "bg-green-600 hover:bg-green-700 cursor-not-allowed"
                  : ""
              }
            >
              {sourceCodeSubmitted ? "Submitted ✓" : "Upload Source Code"}
            </Button>
          </div>
        )}

        {/* Step 3: System Manual */}
        {currentStep === 3 && (
          <div className="border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center space-y-4 rounded-lg text-center bg-white">
            <img
              src="/images/folder.png"
              alt="User Manual Folder"
              className="h-20 w-20"
            />
            <h2 className="text-2xl font-bold">System Manual</h2>
            <p className="text-muted-foreground">
              Submit the system manual for your project.
            </p>
            <Button
              onClick={() => setIsUserManualModalOpen(true)}
              disabled={
                userManualSubmitted || // Original logic
                !manuscriptSubmitted ||
                !sourceCodeSubmitted
              }
              className={
                userManualSubmitted
                  ? "bg-green-600 hover:bg-green-700 cursor-not-allowed"
                  : ""
              }
            >
              {userManualSubmitted ? "Submitted ✓" : "Upload System Manual"}
            </Button>
          </div>
        )}

        {/* Step 4: User Guide */}
        {currentStep === 4 && (
          <div className="border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center space-y-4 rounded-lg text-center bg-white">
            <img
              src="/images/folder.png"
              alt="Usage Guide Folder"
              className="h-20 w-20"
            />
            <h2 className="text-2xl font-bold">User Guide</h2>
            <p className="text-muted-foreground">
              Submit the user guide for your project.
            </p>
            <Button
              onClick={() => setIsUsageGuideModalOpen(true)}
              disabled={
                usageGuideSubmitted || // Original logic
                !manuscriptSubmitted ||
                !sourceCodeSubmitted
              }
              className={
                usageGuideSubmitted
                  ? "bg-green-600 hover:bg-green-700 cursor-not-allowed"
                  : ""
              }
            >
              {usageGuideSubmitted ? "Submitted ✓" : "Upload User Guide"}
            </Button>
          </div>
        )}
      </div>

      {/* --- ORIGINAL MODAL DECLARATIONS (Unchanged) --- */}
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
      <UploadUserManualModal
        isOpen={isUserManualModalOpen}
        onOpenChange={setIsUserManualModalOpen}
        onSuccess={handleUserManualSuccess}
      />
      <UploadUsageGuideModal
        isOpen={isUsageGuideModalOpen}
        onOpenChange={setIsUsageGuideModalOpen}
        onSuccess={handleUsageGuideSuccess}
      />

      {/* --- MODIFIED: Warning message removed from bottom --- */}
    </div>
  );
};

export default UploadProjectPage;

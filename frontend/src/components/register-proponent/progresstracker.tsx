import React from 'react';

// --- ProgressTracker Component ---
// I have moved the ProgressTracker logic into this file to resolve the import error.

interface Step {
  id: number;
  name: string;
}

interface ProgressTrackerProps {
  currentStep: number;
}

const steps: Step[] = [
  { id: 1, name: 'Personal Information' },
  { id: 2, name: 'Project Members' },
  { id: 3, name: 'Capstone Project Details' },
];

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden">
        {steps.map((step, stepIdx) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <li key={step.name} className="relative pb-10">
              {stepIdx !== steps.length - 1 ? (
                <div
                  className={`absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start">
                <div className="relative flex h-9 items-center">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      isCompleted
                        ? 'bg-green-600'
                        : isCurrent
                        ? 'border-2 border-orange-600 bg-white'
                        : 'border-2 border-gray-300 bg-white'
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span
                        className={
                          isCurrent ? 'text-orange-600' : 'text-gray-500'
                        }
                      >
                        {step.id}
                      </span>
                    )}
                  </span>
                </div>
                <div className="ml-4 min-w-0">
                  <span
                    className={`text-sm font-medium ${
                      isCurrent ? 'text-orange-600' : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};


// --- RegistrationSidebar Component ---

interface RegistrationSidebarProps {
  currentStep: number;
}

const RegistrationSidebar: React.FC<RegistrationSidebarProps> = ({ currentStep }) => {
  return (
    <aside className="w-1/4 bg-white/100 p-8 flex flex-col justify-between">
      <div>
        <h1 className="text-3xl text-black font-bold mb-4">Registration Form</h1>
        <p className="text-sm text-gray-400 mb-8">
          This registration form must be completed by the Project Leader of the Capstone Project. It is designed to allow the Project Leader to submit and upload the approved or defended Capstone Project for documentation and record-keeping purposes.
        </p>
        <p className="text-sm text-red-500 mb-8">
          Please check if all fields are correct and properly filled out. You cannot undo this once submitted.
        </p>
        {/* The Progress Tracker is now part of the sidebar */}
        <ProgressTracker currentStep={currentStep} />
      </div>
      <footer className="text-xs text-gray-500">
        Developed by: THE KINGSLEN | 2026 | All Rights Reserved
      </footer>
    </aside>
  );
};

export default RegistrationSidebar;


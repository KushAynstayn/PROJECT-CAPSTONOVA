'use client';

import React from 'react';

// Define the types for the component's props for type safety
interface SuccessModalProps {
  show: boolean;
  onContinue: () => void;
  onCancel: () => void; // Add a new prop for the cancel action
  title: string;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ show, onContinue, onCancel, title, message }) => {
  // If the 'show' prop is false, the component renders nothing
  if (!show) {
    return null;
  }

  return (
    // The modal container, which overlays the entire page
    // MODIFIED: Changed from 'absolute' to 'fixed' for better viewport coverage,
    // and replaced 'bg-black bg-opacity-70' with 'backdrop-blur-sm bg-black/30' for the blur effect.
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      {/* The content of the modal */}
      <div className="bg-white text-gray-800 p-8 rounded-lg shadow-xl text-center max-w-sm">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-center gap-4">
            <button
              onClick={onCancel} // Attach the onCancel handler
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-md transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={onContinue}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-md transition duration-300"
            >
              Continue
            </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;

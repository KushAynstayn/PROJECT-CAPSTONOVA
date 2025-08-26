'use client';

import React from 'react';

// New component for the download modal
const DownloadModal = ({ isOpen, onCancel, onConfirm }: { isOpen: boolean, onCancel: () => void, onConfirm: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-10 w-full max-w-md font-sans">
        <p className="text-center text-lg font-semibold text-gray-800 mb-6">Download to open file</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-md transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#6b0000] hover:bg-[#8a0000] text-white font-semibold px-6 py-2 rounded-md transition-colors duration-200"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;

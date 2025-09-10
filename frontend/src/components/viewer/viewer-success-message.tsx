"use client";

import React from "react";

const SuccessMessage = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="relative z-10 w-96 space-y-6 bg-orange-900 bg-opacity-70 p-8 rounded-xl shadow-lg border border-orange-700 text-center">
      <h3 className="text-xl font-bold text-white mb-4">
        Request Submitted
      </h3>
      <p className="text-gray-200">
        Thank you for requesting, Don't forget to check your notification for the
        approval of your request. We will update you soon.
      </p>
      <button
        onClick={onClose}
        className="w-full mt-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
      >
        OK
      </button>
    </div>
  );
};

export default SuccessMessage;
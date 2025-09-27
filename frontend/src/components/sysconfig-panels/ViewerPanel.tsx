"use client";

import React, { useState } from "react";

// Define the props interface for the ToggleSwitch component
interface ToggleSwitchProps {
  label: string;
  isToggled: boolean;
  onToggle: () => void;
}

// Reusable Toggle component
const ToggleSwitch = ({ label, isToggled, onToggle }: ToggleSwitchProps) => {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-base font-medium text-gray-700">{label}</span>
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={isToggled}
            onChange={onToggle}
          />
          <div
            className={`
              block w-10 h-6 rounded-full transition-colors duration-300
              ${isToggled ? "bg-green-500" : "bg-gray-300"}
            `}
          ></div>
          <div
            className={`
              absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300
              ${
                isToggled
                  ? "transform translate-x-4"
                  : "transform translate-x-0"
              }
            `}
          ></div>
        </div>
      </label>
    </div>
  );
};

// Viewer Panel Component
const ViewerPanel = () => {
  interface ViewerToggles {
    updateProfile: boolean;
    changePassword: boolean;
    registerAccount: boolean;
    viewAbstract: boolean;
    requestFullAccess: boolean;
    viewSuggestions: boolean;
    dataAnalyticsView: boolean;
    getNotifications: boolean;
  }
  const [viewerToggles, setViewerToggles] = useState<ViewerToggles>({
    updateProfile: true,
    changePassword: false,
    registerAccount: true,
    viewAbstract: true,
    requestFullAccess: true,
    viewSuggestions: true,
    dataAnalyticsView: true,
    getNotifications: true,
  });
  const handleToggle = (key: keyof ViewerToggles) => {
    setViewerToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-gray-200 rounded-md p-6 shadow-md w-full">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">
          PROFILE MANAGEMENT
        </h2>
        <ToggleSwitch
          label="Update profile"
          isToggled={viewerToggles.updateProfile}
          onToggle={() => handleToggle("updateProfile")}
        />
        <ToggleSwitch
          label="Change password"
          isToggled={viewerToggles.changePassword}
          onToggle={() => handleToggle("changePassword")}
        />
      </div>
      <div className="bg-white border border-gray-200 rounded-md p-6 shadow-md w-full">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">
          REGISTER MANAGEMENT
        </h2>
        <ToggleSwitch
          label="Register account"
          isToggled={viewerToggles.registerAccount}
          onToggle={() => handleToggle("registerAccount")}
        />
      </div>
      <div className="bg-white border border-gray-200 rounded-md p-6 shadow-md w-full">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">
          PROJECT MANAGEMENT
        </h2>
        <ToggleSwitch
          label="View Abstract"
          isToggled={viewerToggles.viewAbstract}
          onToggle={() => handleToggle("viewAbstract")}
        />
        <ToggleSwitch
          label="Request full Access"
          isToggled={viewerToggles.requestFullAccess}
          onToggle={() => handleToggle("requestFullAccess")}
        />
      </div>
      <div className="bg-white border border-gray-200 rounded-md p-6 shadow-md w-full">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">
          SUGGESTIONS
        </h2>
        <ToggleSwitch
          label="View Suggestions"
          isToggled={viewerToggles.viewSuggestions}
          onToggle={() => handleToggle("viewSuggestions")}
        />
      </div>
      <div className="bg-white border border-gray-200 rounded-md p-6 shadow-md w-full">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">
          DATA ANALYTICS
        </h2>
        <ToggleSwitch
          label="View"
          isToggled={viewerToggles.dataAnalyticsView}
          onToggle={() => handleToggle("dataAnalyticsView")}
        />
      </div>
      <div className="bg-white border border-gray-200 rounded-md p-6 shadow-md w-full">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">
          NOTIFICATION
        </h2>
        <ToggleSwitch
          label="Get Notifications"
          isToggled={viewerToggles.getNotifications}
          onToggle={() => handleToggle("getNotifications")}
        />
      </div>
    </div>
  );
};

export default ViewerPanel;

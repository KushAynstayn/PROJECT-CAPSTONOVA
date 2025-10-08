"use client";

import React from "react";
import { ViewerToggles } from "@/types/system-settings";

interface ToggleSwitchProps {
  label: string;
  isToggled: boolean;
  onToggle: () => void;
}

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
            className={`block w-10 h-6 rounded-full transition-colors duration-300 ${
              isToggled ? "bg-green-500" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
              isToggled ? "transform translate-x-4" : "transform translate-x-0"
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

interface ViewerPanelProps {
  settings: ViewerToggles;
  onToggle: (key: keyof ViewerToggles) => void;
}

const ViewerPanel = ({ settings, onToggle }: ViewerPanelProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">
          PROFILE MANAGEMENT
        </h2>
        <ToggleSwitch
          label="Update profile"
          isToggled={settings.updateProfile}
          onToggle={() => onToggle("updateProfile")}
        />
        <ToggleSwitch
          label="Change password"
          isToggled={settings.changePassword}
          onToggle={() => onToggle("changePassword")}
        />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">
          REGISTER MANAGEMENT
        </h2>
        <ToggleSwitch
          label="Register account"
          isToggled={settings.registerAccount}
          onToggle={() => onToggle("registerAccount")}
        />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">
          PROJECT MANAGEMENT
        </h2>
        <ToggleSwitch
          label="View Abstract"
          isToggled={settings.viewAbstract}
          onToggle={() => onToggle("viewAbstract")}
        />
        <ToggleSwitch
          label="Request full Access"
          isToggled={settings.requestFullAccess}
          onToggle={() => onToggle("requestFullAccess")}
        />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">
          SUGGESTIONS
        </h2>
        <ToggleSwitch
          label="View Suggestions"
          isToggled={settings.viewSuggestions}
          onToggle={() => onToggle("viewSuggestions")}
        />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">
          DATA ANALYTICS
        </h2>
        <ToggleSwitch
          label="View"
          isToggled={settings.dataAnalyticsView}
          onToggle={() => onToggle("dataAnalyticsView")}
        />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">
          NOTIFICATION
        </h2>
        <ToggleSwitch
          label="Get Notifications"
          isToggled={settings.getNotifications}
          onToggle={() => onToggle("getNotifications")}
        />
      </div>
    </div>
  );
};

export default ViewerPanel;

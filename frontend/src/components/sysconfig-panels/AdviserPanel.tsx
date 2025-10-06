"use client";

import React from "react";
import { AdviserToggles } from "@/types/system-settings";

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

interface AdviserPanelProps {
  settings: AdviserToggles;
  onToggle: (key: keyof AdviserToggles) => void;
}

const AdviserPanel = ({ settings, onToggle }: AdviserPanelProps) => {
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
          ADVISEE MANAGEMENT
        </h2>
        <ToggleSwitch
          label="View Advisee"
          isToggled={settings.viewAdvisee}
          onToggle={() => onToggle("viewAdvisee")}
        />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">PROJECTS</h2>
        <ToggleSwitch
          label="View Projects"
          isToggled={settings.viewProjects}
          onToggle={() => onToggle("viewProjects")}
        />
        <ToggleSwitch
          label="Search Projects"
          isToggled={settings.searchProjects}
          onToggle={() => onToggle("searchProjects")}
        />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">
          SUGGESTIONS
        </h2>
        <ToggleSwitch
          label="Create suggestion"
          isToggled={settings.createSuggestion}
          onToggle={() => onToggle("createSuggestion")}
        />
        <ToggleSwitch
          label="View own suggestion"
          isToggled={settings.viewOwnSuggestion}
          onToggle={() => onToggle("viewOwnSuggestion")}
        />
        <ToggleSwitch
          label="View others suggestion"
          isToggled={settings.viewOthersSuggestion}
          onToggle={() => onToggle("viewOthersSuggestion")}
        />
        <ToggleSwitch
          label="View archived suggestions"
          isToggled={settings.viewArchivedSuggestions}
          onToggle={() => onToggle("viewArchivedSuggestions")}
        />
        <ToggleSwitch
          label="Archive own suggestion"
          isToggled={settings.archiveOwnSuggestion}
          onToggle={() => onToggle("archiveOwnSuggestion")}
        />
        <ToggleSwitch
          label="Return archived suggestion"
          isToggled={settings.returnArchivedSuggestion}
          onToggle={() => onToggle("returnArchivedSuggestion")}
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

export default AdviserPanel;

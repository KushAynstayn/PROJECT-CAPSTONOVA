"use client";

import React from "react";
import { AdminToggles } from "@/types/system-settings";

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

interface AdminPanelProps {
  settings: AdminToggles;
  onToggle: (key: keyof AdminToggles) => void;
}

const AdminPanel = ({ settings, onToggle }: AdminPanelProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          ADVISER MANAGEMENT
        </h2>
        <ToggleSwitch
          label="Create adviser account"
          isToggled={settings.createAdviserAccount}
          onToggle={() => onToggle("createAdviserAccount")}
        />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">
          WHITELIST MANAGEMENT
        </h2>
        <ToggleSwitch
          label="Upload whitelist"
          isToggled={settings.uploadWhitelist}
          onToggle={() => onToggle("uploadWhitelist")}
        />
        <ToggleSwitch
          label="View whitelist"
          isToggled={settings.viewWhitelist}
          onToggle={() => onToggle("viewWhitelist")}
        />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">
          SUBMISSIONS MANAGEMENT
        </h2>
        <ToggleSwitch
          label="View submissions"
          isToggled={settings.viewSubmissions}
          onToggle={() => onToggle("viewSubmissions")}
        />
        <ToggleSwitch
          label="Search projects"
          isToggled={settings.searchProjects}
          onToggle={() => onToggle("searchProjects")}
        />
        <ToggleSwitch
          label="Archive projects"
          isToggled={settings.archiveProjects}
          onToggle={() => onToggle("archiveProjects")}
        />
        <ToggleSwitch
          label="Restore projects"
          isToggled={settings.restoreProjects}
          onToggle={() => onToggle("restoreProjects")}
        />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">
          SUGGESTIONS
        </h2>
        <ToggleSwitch
          label="View suggestions"
          isToggled={settings.viewSuggestions}
          onToggle={() => onToggle("viewSuggestions")}
        />
        <ToggleSwitch
          label="View archived"
          isToggled={settings.viewArchived}
          onToggle={() => onToggle("viewArchived")}
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
        <h2 className="font-semibold text-xl mb-4 text-gray-800">REPORTS</h2>
        <ToggleSwitch
          label="View"
          isToggled={settings.reportsView}
          onToggle={() => onToggle("reportsView")}
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

export default AdminPanel;

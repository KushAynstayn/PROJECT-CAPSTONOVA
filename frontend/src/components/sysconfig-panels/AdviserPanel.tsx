"use client";

import React, { useState } from 'react';

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
              ${isToggled ? 'bg-green-500' : 'bg-gray-300'}
            `}
          ></div>
          <div
            className={`
              absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300
              ${isToggled ? 'transform translate-x-4' : 'transform translate-x-0'}
            `}
          ></div>
        </div>
      </label>
    </div>
  );
};

// Adviser Panel Component
const AdviserPanel = () => {
  interface AdviserToggles {
    updateProfile: boolean;
    changePassword: boolean;
    viewAdvisee: boolean;
    viewProjects: boolean;
    searchProjects: boolean;
    createSuggestion: boolean;
    viewOwnSuggestion: boolean;
    viewOthersSuggestion: boolean;
    viewArchivedSuggestions: boolean;
    archiveOwnSuggestion: boolean;
    returnArchivedSuggestion: boolean;
    dataAnalyticsView: boolean;
    getNotifications: boolean;
  }
  const [adviserToggles, setAdviserToggles] = useState<AdviserToggles>({
    updateProfile: true,
    changePassword: false,
    viewAdvisee: true,
    viewProjects: true,
    searchProjects: true,
    createSuggestion: true,
    viewOwnSuggestion: true,
    viewOthersSuggestion: true,
    viewArchivedSuggestions: true,
    archiveOwnSuggestion: true,
    returnArchivedSuggestion: true,
    dataAnalyticsView: true,
    getNotifications: true,
  });
  const handleToggle = (key: keyof AdviserToggles) => {
    setAdviserToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">PROFILE MANAGEMENT</h2>
        <ToggleSwitch label="Update profile" isToggled={adviserToggles.updateProfile} onToggle={() => handleToggle('updateProfile')} />
        <ToggleSwitch label="Change password" isToggled={adviserToggles.changePassword} onToggle={() => handleToggle('changePassword')} />
      </div>
       <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">ADVISEE MANAGEMENT</h2>
        <ToggleSwitch label="View Advisee" isToggled={adviserToggles.viewAdvisee} onToggle={() => handleToggle('viewAdvisee')} />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">PROJECTS</h2>
        <ToggleSwitch label="View Projects" isToggled={adviserToggles.viewProjects} onToggle={() => handleToggle('viewProjects')} />
        <ToggleSwitch label="Search Projects" isToggled={adviserToggles.searchProjects} onToggle={() => handleToggle('searchProjects')} />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">SUGGESTIONS</h2>
        <ToggleSwitch label="Create suggestion" isToggled={adviserToggles.createSuggestion} onToggle={() => handleToggle('createSuggestion')} />
        <ToggleSwitch label="View own suggestion" isToggled={adviserToggles.viewOwnSuggestion} onToggle={() => handleToggle('viewOwnSuggestion')} />
        <ToggleSwitch label="View others suggestion" isToggled={adviserToggles.viewOthersSuggestion} onToggle={() => handleToggle('viewOthersSuggestion')} />
        <ToggleSwitch label="View archived suggestions" isToggled={adviserToggles.viewArchivedSuggestions} onToggle={() => handleToggle('viewArchivedSuggestions')} />
        <ToggleSwitch label="Archive own suggestion" isToggled={adviserToggles.archiveOwnSuggestion} onToggle={() => handleToggle('archiveOwnSuggestion')} />
        <ToggleSwitch label="Return archived suggestion" isToggled={adviserToggles.returnArchivedSuggestion} onToggle={() => handleToggle('returnArchivedSuggestion')} />
      </div>
       <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">DATA ANALYTICS</h2>
        <ToggleSwitch label="View" isToggled={adviserToggles.dataAnalyticsView} onToggle={() => handleToggle('dataAnalyticsView')} />
      </div>
       <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">NOTIFICATION</h2>
        <ToggleSwitch label="Get Notifications" isToggled={adviserToggles.getNotifications} onToggle={() => handleToggle('getNotifications')} />
      </div>
    </div>
  );
};

export default AdviserPanel;
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

// Admin Panel Component
const AdminPanel = () => {
  interface AdminToggles {
    updateProfile: boolean;
    changePassword: boolean;
    createAdviserAccount: boolean;
    uploadWhitelist: boolean;
    viewWhitelist: boolean;
    viewSubmissions: boolean;
    searchProjects: boolean;
    archiveProjects: boolean;
    restoreProjects: boolean;
    viewSuggestions: boolean;
    viewArchived: boolean;
    dataAnalyticsView: boolean;
    reportsView: boolean;
    getNotifications: boolean;
  }
  const [adminToggles, setAdminToggles] = useState<AdminToggles>({
    updateProfile: true,
    changePassword: false,
    createAdviserAccount: true,
    uploadWhitelist: false,
    viewWhitelist: true,
    viewSubmissions: true,
    searchProjects: true,
    archiveProjects: true,
    restoreProjects: true,
    viewSuggestions: true,
    viewArchived: false,
    dataAnalyticsView: true,
    reportsView: true,
    getNotifications: true,
  });
  const handleToggle = (key: keyof AdminToggles) => {
    setAdminToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">PROFILE MANAGEMENT</h2>
        <ToggleSwitch label="Update profile" isToggled={adminToggles.updateProfile} onToggle={() => handleToggle('updateProfile')} />
        <ToggleSwitch label="Change password" isToggled={adminToggles.changePassword} onToggle={() => handleToggle('changePassword')} />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">ADVISER MANAGEMENT</h2>
        <ToggleSwitch label="Create adviser account" isToggled={adminToggles.createAdviserAccount} onToggle={() => handleToggle('createAdviserAccount')} />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">WHITELIST MANAGEMENT</h2>
        <ToggleSwitch label="Upload whitelist" isToggled={adminToggles.uploadWhitelist} onToggle={() => handleToggle('uploadWhitelist')} />
        <ToggleSwitch label="View whitelist" isToggled={adminToggles.viewWhitelist} onToggle={() => handleToggle('viewWhitelist')} />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">SUBMISSIONS MANAGEMENT</h2>
        <ToggleSwitch label="View submissions" isToggled={adminToggles.viewSubmissions} onToggle={() => handleToggle('viewSubmissions')} />
        <ToggleSwitch label="Search projects" isToggled={adminToggles.searchProjects} onToggle={() => handleToggle('searchProjects')} />
        <ToggleSwitch label="Archive projects" isToggled={adminToggles.archiveProjects} onToggle={() => handleToggle('archiveProjects')} />
        <ToggleSwitch label="Restore projects" isToggled={adminToggles.restoreProjects} onToggle={() => handleToggle('restoreProjects')} />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">SUGGESTIONS</h2>
        <ToggleSwitch label="View suggestions" isToggled={adminToggles.viewSuggestions} onToggle={() => handleToggle('viewSuggestions')} />
        <ToggleSwitch label="View archived" isToggled={adminToggles.viewArchived} onToggle={() => handleToggle('viewArchived')} />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">DATA ANALYTICS</h2>
        <ToggleSwitch label="View" isToggled={adminToggles.dataAnalyticsView} onToggle={() => handleToggle('dataAnalyticsView')} />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">REPORTS</h2>
        <ToggleSwitch label="View" isToggled={adminToggles.reportsView} onToggle={() => handleToggle('reportsView')} />
      </div>
      <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">NOTIFICATION</h2>
        <ToggleSwitch label="Get Notifications" isToggled={adminToggles.getNotifications} onToggle={() => handleToggle('getNotifications')} />
      </div>
    </div>
  );
};

export default AdminPanel;
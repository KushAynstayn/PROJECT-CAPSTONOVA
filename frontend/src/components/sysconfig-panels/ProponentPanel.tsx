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

// Proponent Panel Component
const ProponentPanel = () => {
  interface ProponentToggles {
    updateProfile: boolean;
    changePassword: boolean;
    uploadProjects: boolean;
    getNotifications: boolean;
  }
  const [proponentToggles, setProponentToggles] = useState<ProponentToggles>({
    updateProfile: true,
    changePassword: false,
    uploadProjects: true,
    getNotifications: true,
  });
  const handleToggle = (key: keyof ProponentToggles) => {
    setProponentToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-gray-200 rounded-md p-6 shadow-md w-full">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">PROFILE MANAGEMENT</h2>
        <ToggleSwitch label="Update profile" isToggled={proponentToggles.updateProfile} onToggle={() => handleToggle('updateProfile')} />
        <ToggleSwitch label="Change password" isToggled={proponentToggles.changePassword} onToggle={() => handleToggle('changePassword')} />
      </div>
      <div className="bg-white border border-gray-200 rounded-md p-6 shadow-md w-full">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">UPLOAD MANAGEMENT</h2>
        <ToggleSwitch label="Upload Projects" isToggled={proponentToggles.uploadProjects} onToggle={() => handleToggle('uploadProjects')} />
      </div>
      <div className="bg-white border border-gray-200 rounded-md p-6 shadow-md w-full">
        <h2 className="font-semibold text-xl mb-4 text-gray-800">NOTIFICATION</h2>
        <ToggleSwitch label="Get Notifications" isToggled={proponentToggles.getNotifications} onToggle={() => handleToggle('getNotifications')} />
      </div>
    </div>
  );
};

export default ProponentPanel;
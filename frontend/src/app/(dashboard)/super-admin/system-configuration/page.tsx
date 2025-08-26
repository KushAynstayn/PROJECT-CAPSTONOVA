"use client";

import React, { useState } from 'react';
import AdminPanel from '../../../../components/ui/AdminPanel';
import AdviserPanel from '../../../../components/ui/AdviserPanel';
import ProponentPanel from '../../../../components/ui/ProponentPanel';
import GuestPanel from '../../../../components/ui/GuestPanel';

const SystemConfigurationPage = () => {
  const [activeTab, setActiveTab] = useState('Admin');

  const renderContent = () => {
    switch (activeTab) {
      case 'Admin':
        return <AdminPanel />;
      case 'Adviser':
        return <AdviserPanel />;
      case 'Proponent':
        return <ProponentPanel />;
      case 'Guest':
        return <GuestPanel />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-start space-x-8">
        {['Admin', 'Adviser', 'Proponent', 'Guest'].map((tab) => (
          <button
            key={tab}
            className={`
              text-xl font-semibold pb-2 
              ${activeTab === tab 
                ? 'text-[#511b10] border-b-2 border-[#511b10]' 
                : 'text-gray-400'
              }
              transition-colors duration-200
            `}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default SystemConfigurationPage;
"use client";

import React, { useState } from "react";
import AdminPanel from "../../../../components/sysconfig-panels/AdminPanel";
import AdviserPanel from "../../../../components/sysconfig-panels/AdviserPanel";
import ProponentPanel from "../../../../components/sysconfig-panels/ProponentPanel";
import ViewerPanel from "../../../../components/sysconfig-panels/ViewerPanel";

const SystemConfigurationPage = () => {
  const [activeTab, setActiveTab] = useState("Admin");

  const renderContent = () => {
    switch (activeTab) {
      case "Admin":
        return <AdminPanel />;
      case "Adviser":
        return <AdviserPanel />;
      case "Proponent":
        return <ProponentPanel />;
      case "Viewer":
        return <ViewerPanel />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-start space-x-8">
        {["Admin", "Adviser", "Proponent", "Viewer"].map((tab) => (
          <button
            key={tab}
            className={`
              text-xl font-semibold pb-2 
              ${
                activeTab === tab
                  ? "text-blue border-b-2 border-blue"
                  : "text-gray-400"
              }
              transition-colors duration-200
            `}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-8">{renderContent()}</div>
    </div>
  );
};

export default SystemConfigurationPage;

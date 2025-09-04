'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import RegistrationSidebar from '@/components/register-proponent/progresstracker';
import SuccessModal from '@/components/register-proponent/successmodal';

const Step3Page = () => {
  const [formData, setFormData] = useState({
    projectTitle: '',
    groupName: '',
    advisorName: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [progressStep, setProgressStep] = useState(3);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Final Registration Data:', formData);
    setProgressStep(4);
    setShowModal(true);
  };

  const handleBack = () => {
    window.location.href = '/proponent-registration/step-2';
  };

  const handleContinue = () => {
    window.location.href = '/proponent/manage-account';
  };

  const handleCancelModal = () => {
    setProgressStep(3);
    setShowModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      <RegistrationSidebar currentStep={progressStep} />
      
      {/* Main Content with background image */}
      <main className="w-3/4 p-12 overflow-y-auto relative">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg.png" // Change this to your image path
            alt="Background for Capstone Project Details form"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="rounded-lg"
          />
          {/* Semi-transparent overlay to ensure text readability */}
          <div className="absolute inset-0 bg-[#660000] opacity-20"></div>
        </div>

        {/* Content of the main section, positioned on top */}
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold mb-8">Capstone Project Details</h2>
          <form onSubmit={handleSubmit}>
            {/* Form fields remain the same */}
            <div className="mb-6">
              <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-300 mb-2">Capstone Project Title</label>
              <textarea
                id="projectTitle"
                name="projectTitle"
                rows={4}
                value={formData.projectTitle}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-300 mb-2">Group Name</label>
              <input
                type="text"
                id="groupName"
                name="groupName"
                value={formData.groupName}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="mb-12">
              <label htmlFor="advisorName" className="block text-sm font-medium text-gray-300 mb-2">Advisor's Name</label>
              <input
                type="text"
                id="advisorName"
                name="advisorName"
                value={formData.advisorName}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-md transition duration-300"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-md transition duration-300"
              >
                Submit Registration
              </button>
            </div>
          </form>

          {/* The modal component now controls the progress tracker's state via the cancel button */}
          <SuccessModal
            show={showModal}
            onContinue={handleContinue}
            onCancel={handleCancelModal}
            title="You have successfully registered!"
            message="Please wait while the system approves your submission."
          />
        </div>
      </main>
    </div>
  );
};

export default Step3Page;
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import RegistrationSidebar from '@/components/register-proponent/progresstracker';

// Define a type for a single member for better type safety
type Member = {
  firstName: string;
  middleName: string;
  lastName: string;
};

const Step2Page = () => {
  const [members, setMembers] = useState({
    hacker: { firstName: '', middleName: '', lastName: '' },
    hipster1: { firstName: '', middleName: '', lastName: '' },
    hipster2: { firstName: '', middleName: '', lastName: '' },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, memberRole: keyof typeof members, field: keyof Member) => {
    const { value } = e.target;
    setMembers(prev => ({
      ...prev,
      [memberRole]: {
        ...prev[memberRole],
        [field]: value,
      },
    }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Step 2 Data:', members);
    window.location.href = '/proponent-registration/step-3';
  };

  const handleBack = () => {
    window.location.href = '/proponent-registration/step-1';
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      <RegistrationSidebar currentStep={2} />

      {/* Main Content with background image */}
      <main className="w-3/4 p-12 overflow-y-auto relative">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg.png" // Change this to your image path
            alt="Background for Project Members form"
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
          <h2 className="text-2xl font-semibold mb-8">Project Members</h2>
          <form onSubmit={handleNextStep}>

            {/* Hacker Section */}
            <h3 className="text-lg font-medium mb-4">Hacker</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <input
                type="text"
                name="hacker-firstName"
                placeholder="First name"
                value={members.hacker.firstName}
                onChange={(e) => handleInputChange(e, 'hacker', 'firstName')}
                className="p-3 bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="text"
                name="hacker-middleName"
                placeholder="Middle Name ( Optional )"
                value={members.hacker.middleName}
                onChange={(e) => handleInputChange(e, 'hacker', 'middleName')}
                className="p-3 bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                name="hacker-lastName"
                placeholder="Last Name"
                value={members.hacker.lastName}
                onChange={(e) => handleInputChange(e, 'hacker', 'lastName')}
                className="p-3 bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Hipster Section 1 */}
            <h3 className="text-lg font-medium mb-4">Hipster</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <input
                type="text"
                name="hipster1-firstName"
                placeholder="First name"
                value={members.hipster1.firstName}
                onChange={(e) => handleInputChange(e, 'hipster1', 'firstName')}
                className="p-3 bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="text"
                name="hipster1-middleName"
                placeholder="Middle Name ( Optional )"
                value={members.hipster1.middleName}
                onChange={(e) => handleInputChange(e, 'hipster1', 'middleName')}
                className="p-3 bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                name="hipster1-lastName"
                placeholder="Last Name"
                value={members.hipster1.lastName}
                onChange={(e) => handleInputChange(e, 'hipster1', 'lastName')}
                className="p-3 bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Hipster Section 2 */}
            <h3 className="text-lg font-medium mb-4">Hipster</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <input
                type="text"
                name="hipster2-firstName"
                placeholder="First name"
                value={members.hipster2.firstName}
                onChange={(e) => handleInputChange(e, 'hipster2', 'firstName')}
                className="p-3 bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="text"
                name="hipster2-middleName"
                placeholder="Middle Name ( Optional )"
                value={members.hipster2.middleName}
                onChange={(e) => handleInputChange(e, 'hipster2', 'middleName')}
                className="p-3 bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                name="hipster2-lastName"
                placeholder="Last Name"
                value={members.hipster2.lastName}
                onChange={(e) => handleInputChange(e, 'hipster2', 'lastName')}
                className="p-3 bg-gray-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="flex justify-between mt-12">
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
                Next Step
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Step2Page;
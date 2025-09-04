'use client'; 

import React, { useState } from 'react';
import Image from 'next/image'; // Import the Image component
import RegistrationSidebar from '@/components/register-proponent/progresstracker';

const Step1Page = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    ctuEmail: '',
    ctuIdNumber: '',
    department: '',
    program: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Step 1 Data:', formData);
    window.location.href = '/proponent-registration/step-2';
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      
      {/* The entire sidebar is now replaced with a single, clean component call */}
      <RegistrationSidebar currentStep={1} />

      {/* Main Content with background image */}
      <main className="w-3/4 p-12 overflow-y-auto relative">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg.png" // Change this to your image path
            alt="Background for Personal Information form"
            layout="fill"
            objectFit="cover"
            quality={100}
             // Optional: add rounded corners to the image
          />
          {/* Semi-transparent overlay to ensure text readability */}
          <div className="absolute inset-0 bg-[#660000] opacity-20"></div>
        </div>

        {/* Content of the main section, positioned on top */}
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold mb-12">Personal Information</h2>
          <form onSubmit={handleNextStep}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <input type="text" name="firstName" placeholder="First name" onChange={handleInputChange} className="p-3 bg-gray-700 rounded-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              <input type="text" name="middleName" placeholder="Middle Name ( Optional )" onChange={handleInputChange} className="p-3 bg-gray-700 rounded-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <input type="text" name="lastName" placeholder="Last Name" onChange={handleInputChange} className="p-3 bg-gray-700 rounded-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <input type="email" name="ctuEmail" placeholder="CTU Email" onChange={handleInputChange} className="p-3 bg-gray-700 rounded-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              <input type="text" name="ctuIdNumber" placeholder="CTU ID Number" onChange={handleInputChange} className="p-3 bg-gray-700 rounded-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              <input type="text" name="department" placeholder="Department" onChange={handleInputChange} className="p-3 bg-gray-700 rounded-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
               <input type="text" name="program" placeholder="Program ( Day or Night )" onChange={handleInputChange} className="p-3 bg-gray-700 rounded-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500" required />
               <input type="password" name="password" placeholder="Password" onChange={handleInputChange} className="p-3 bg-gray-700 rounded-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500" required />
               <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleInputChange} className="p-3 bg-gray-700 rounded-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500" required />
            </div>
            <div className="flex justify-end">
               <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-md transition duration-300">
                 Next Step
               </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Step1Page;
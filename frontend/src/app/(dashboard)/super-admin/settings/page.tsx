"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; 
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; 
import EditProfile from '../../../../components/settings/editprofile'; // Import the new component

// Initial data for the user. We'll use this to initialize state.
const initialUserData = {
  firstName: 'Angel',
  middleName: '',
  lastName: 'Locsin',
  userType: 'Super Admin',
  idNumber: '2021-18018',
  email: 's.yap@student.edu',
  contactNumber: '+63 917 123 4567',
  department: 'CCICT',
  // Password fields are initialized as empty
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const SuperAdminSettingsPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialUserData);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleEditClick = () => {
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleCancel = () => {
    setFormData(initialUserData); // Revert any changes
    setIsEditing(false);
  };

  const handleSaveChanges = () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    console.log("Saving data:", formData);
    // After saving, reset password fields for security and switch back to view mode
    setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: ''}));
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  return (
    <div className="p-4 sm:pt-8 sm:px-8 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden relative">
        
        <div className="relative w-full h-40">
          <Image
            src="/images/ctubldg.png"
            alt="Cebu Technological University Main Campus Building"
            className="w-full h-full object-cover"
            fill
            priority
          />
        </div>

        <div ref={menuRef} className="absolute top-[168px] right-4 z-10"> 
          <div onClick={() => setIsMenuOpen(!isMenuOpen)} className="cursor-pointer">
            <Image
              src="/images/dots_icon.png"
              alt="More options"
              width={24}
              height={24}
            />
          </div>
          {isMenuOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <button onClick={handleEditClick} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Edit Profile
                </button>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Logout
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 md:p-12">
          {isEditing ? (
            <EditProfile 
              formData={formData}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onSave={handleSaveChanges}
              onCancel={handleCancel}
            />
          ) : (
            <ViewProfile userData={formData} />
          )}
        </div>
      </div>
    </div>
  );
};

// --- Sub-component for Viewing Profile (can stay here) ---
const ViewProfile = ({ userData }: { userData: typeof initialUserData }) => {
  const fullName = [userData.firstName, userData.middleName, userData.lastName].filter(Boolean).join(' ');

  return (
    <>
      <h1 className="text-center text-3xl font-serif tracking-wider text-gray-800 mb-1">
        {fullName}
      </h1>
      <p className="text-center text-lg text-gray-500">
        {userData.userType}
      </p>
      <div className="border-t my-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div>
          <Label className="text-sm font-medium text-gray-600">ID Number</Label>
          <Input value={userData.idNumber} readOnly className="w-full mt-2 border-gray-300 rounded-md bg-gray-50 cursor-default focus:ring-0 focus:ring-offset-0 focus:outline-none hover:border-gray-300" />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">CTU Email</Label>
          <Input value={userData.email} readOnly className="w-full mt-2 border-gray-300 rounded-md bg-gray-50 cursor-default focus:ring-0 focus:ring-offset-0 focus:outline-none hover:border-gray-300" />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Contact Number</Label>
          <Input value={userData.contactNumber} readOnly className="w-full mt-2 border-gray-300 rounded-md bg-gray-50 cursor-default focus:ring-0 focus:ring-offset-0 focus:outline-none hover:border-gray-300" />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Department</Label>
          <Input value={userData.department} readOnly className="w-full mt-2 border-gray-300 rounded-md bg-gray-50 cursor-default focus:ring-0 focus:ring-offset-0 focus:outline-none hover:border-gray-300" />
        </div>
      </div>
    </>
  );
}

export default SuperAdminSettingsPage;
'use client'; 

import React, { useState } from 'react';

// Style object for the glow effect
const glowStyle = {
    borderColor: 'rgba(251, 191, 36, 0.7)',
    boxShadow: '0 0 10px rgba(251, 191, 36, 0.5), inset 0 0 5px rgba(251, 191, 36, 0.3)',
};

// Base styles for the fields
const fieldBaseStyles = "mt-1 block w-full rounded-md border-2 bg-black bg-opacity-50 text-gray-100 p-2.5 " +
                        "focus:ring-0 focus:border-yellow-300 transition-all duration-300";

const editableStyles = "cursor-pointer";
const disabledStyles = "cursor-not-allowed";

const selectBaseStyles = `${fieldBaseStyles} appearance-none`;

// --- Initial User Data ---
const initialUserData = {
    firstName: 'Juan',
    lastName: 'Pabling',
    idNumber: '1330699',
    ctuEmail: 'viewer@gmail.com',
    department: 'CCICT',
    degreeProgram: 'BSIS',
    programSchedule: 'Day Program',
};

const ViewAccount = () => {
  // --- State Management ---
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialUserData);
  const [passwordData, setPasswordData] = useState({ password: '', confirmPassword: '' });

  const firstLetter = formData.firstName.charAt(0).toUpperCase();

  // --- Dropdown Options Data ---
  const departmentOptions = ['CCICT', 'COED', 'COT', 'COE', 'CAS'];
  const degreeProgramOptions: { [key: string]: string[] } = {
    'CCICT': ['BSIS', 'BSIT', 'BIT-CT'], 'COED': ['BSED-English', 'BSED-Math'], 'COT': ['BS in Automotive'], 'COE': ['BS in Civil Eng'], 'CAS': ['BS in Psychology'],
  };
  const scheduleOptions = ['Day Program', 'Night Program'];
  const currentDegreeOptions = degreeProgramOptions[formData.department] || [];

  // --- Event Handlers ---
  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setFormData(initialUserData); 
    setPasswordData({ password: '', confirmPassword: ''}); 
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    console.log("Saving data:", { ...formData, ...passwordData });
    setIsEditing(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };


  return (
    <div className="max-w-7xl mx-auto px-4 my-10 font-sans text-gray-100">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Account Information</h1>
        <p className="mt-1 text-gray-400">View and edit your account details below.</p>
      </div>
      
      {/* User Profile Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-700 text-3xl font-bold text-yellow-400 border-2" style={glowStyle}>
            {firstLetter}
          </div>
          <div>
            {/* This name is now linked to the form state */}
            <h1 className="text-2xl font-bold text-yellow-400">{`${formData.firstName} ${formData.lastName}`}</h1>
            {/* UPDATED: This email is now linked to the form state */}
            <p className="text-gray-300">{formData.ctuEmail}</p>
          </div>
        </div>
        
        {/* Conditional Buttons */}
        <div className="mt-4 sm:mt-0 flex gap-4">
          {isEditing ? (
            <>
              <button onClick={handleCancelClick} className="bg-transparent border border-gray-500 text-gray-300 font-semibold py-2 px-6 rounded-md hover:bg-gray-700 hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={handleSaveClick} className="bg-yellow-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-yellow-700 transition-colors" style={glowStyle}>
                Save Changes
              </button>
            </>
          ) : (
            <button onClick={handleEditClick} className="bg-yellow-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-yellow-700 transition-colors" style={glowStyle}>
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8">
        
        {/* Text Inputs */}
        <div>
          <label className="block text-sm font-medium text-yellow-400">First name</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} disabled={!isEditing} className={`${fieldBaseStyles} ${isEditing ? editableStyles : disabledStyles}`} style={glowStyle} />
        </div>
        <div>
          <label className="block text-sm font-medium text-yellow-400">Last name</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} disabled={!isEditing} className={`${fieldBaseStyles} ${isEditing ? editableStyles : disabledStyles}`} style={glowStyle} />
        </div>
        <div>
          <label className="block text-sm font-medium text-yellow-400">ID Number</label>
          <input type="text" name="idNumber" value={formData.idNumber} onChange={handleFormChange} disabled={!isEditing} className={`${fieldBaseStyles} ${isEditing ? editableStyles : disabledStyles}`} style={glowStyle} />
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-yellow-400">CTU Email</label>
          <input type="email" name="ctuEmail" value={formData.ctuEmail} onChange={handleFormChange} disabled={!isEditing} className={`${fieldBaseStyles} ${isEditing ? editableStyles : disabledStyles}`} style={glowStyle} />
        </div>

        {/* Dropdown Selects */}
        <div className="relative">
          <label className="block text-sm font-medium text-yellow-400">Department</label>
          <select name="department" value={formData.department} onChange={handleFormChange} disabled={!isEditing} className={`${selectBaseStyles} ${isEditing ? editableStyles : disabledStyles}`} style={glowStyle}>
            {departmentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-yellow-400">Degree Program</label>
          <select name="degreeProgram" value={formData.degreeProgram} onChange={handleFormChange} disabled={!isEditing} className={`${selectBaseStyles} ${isEditing ? editableStyles : disabledStyles}`} style={glowStyle}>
            {currentDegreeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-yellow-400">Program Schedule</label>
          <select name="programSchedule" value={formData.programSchedule} onChange={handleFormChange} disabled={!isEditing} className={`${selectBaseStyles} ${isEditing ? editableStyles : disabledStyles}`} style={glowStyle}>
            {scheduleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        
        {/* Conditional Password Section */}
        {isEditing && (
          <>
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <div>
                  <label className="block text-sm font-medium text-yellow-400">Password</label>
                  <input type={showPassword ? "text" : "password"} name="password" value={passwordData.password} onChange={handlePasswordChange} className={`${fieldBaseStyles} ${editableStyles}`} style={glowStyle} />
                  <p className="mt-2 text-xs text-gray-400">
                      Use 8 or more characters with a mix of letters, numbers & symbols
                  </p>
              </div>
              <div>
                  <label className="block text-sm font-medium text-yellow-400">Confirm password</label>
                  <input type={showPassword ? "text" : "password"} name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className={`${fieldBaseStyles} ${editableStyles}`} style={glowStyle} />
              </div>
            </div>

            <div className="md:col-span-3 -mt-4">
              <div className="flex items-center">
                <input
                  id="show-password"
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="h-4 w-4 rounded border-2 bg-black bg-opacity-50 text-yellow-400 focus:ring-offset-gray-800 focus:ring-yellow-300 checked:bg-yellow-400 transition-colors"
                  style={glowStyle}
                />
                <label htmlFor="show-password" className="ml-2 block text-sm text-gray-100">Show password</label>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewAccount;
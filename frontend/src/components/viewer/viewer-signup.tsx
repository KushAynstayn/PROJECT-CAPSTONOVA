'use client';

import React from "react";

const ViewerSignUpPage = ({
  onClose,
  onSwitchToLogin,
  onSignupSuccess, // Added this prop
}: {
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSignupSuccess: () => void; // Added to the prop type
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle form submission here.
    // For now, we'll just call the success callback to show the message.
    onSignupSuccess();
  };
  return (
    <div className="relative z-10 w-[700px] space-y-6 bg-orange-900 bg-opacity-70 p-8 rounded-xl shadow-lg border border-orange-700">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div>
        <div className="flex justify-center mb-4">
          <img
            src="/images/capstonova_logo.png"
            alt="Project Capstonova Logo"
            className="h-10 w-10"
          />
          <h2 className="ml-2 mt-2 text-xl font-bold text-white uppercase">
            Project Capstonova
          </h2>
        </div>
        <h3 className="text-center text-xl font-bold text-white mb-2">
          Create an account
        </h3>
        <p className="text-center text-sm text-gray-200">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-orange-200 hover:text-orange-100 font-medium"
          >
            Log In
          </button>
        </p>
      </div>

      <form className="mt-8 space-y-4" action="#" method="POST" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-1">
            <input
              type="text"
              placeholder="First name"
              className="appearance-none relative block w-full px-3 py-2 border-2 border-transparent bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
          <div className="col-span-1 md:col-span-1">
            <input
              type="text"
              placeholder="Last name"
              className="appearance-none relative block w-full px-3 py-2 border-2 border-transparent bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
          <div className="col-span-1 md:col-span-1">
            <input
              type="text"
              placeholder="ID Number"
              className="appearance-none relative block w-full px-3 py-2 border-2 border-transparent bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <input
            type="email"
            placeholder="CTU Email"
            className="appearance-none relative block w-full px-3 py-2 border-2 border-transparent bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-1">
            <input
              type="text"
              placeholder="Department"
              className="appearance-none relative block w-full px-3 py-2 border-2 border-transparent bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
          <div className="col-span-1 md:col-span-1">
            <input
              type="text"
              placeholder="Course"
              className="appearance-none relative block w-full px-3 py-2 border-2 border-transparent bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
          <div className="col-span-1 md:col-span-1">
            <input
              type="text"
              placeholder="Program"
              className="appearance-none relative block w-full px-3 py-2 border-2 border-transparent bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <input
              type="password"
              placeholder="Password"
              className="appearance-none relative block w-full px-3 py-2 border-2 border-transparent bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
          <div className="col-span-1">
            <input
              type="password"
              placeholder="Confirm password"
              className="appearance-none relative block w-full px-3 py-2 border-2 border-transparent bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
        </div>
        <p className="text-gray-200 text-xs">
          Use 8 or more characters with a mix of letters, numbers & symbols
        </p>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-password"
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="show-password" className="ml-2 text-sm text-gray-200">
            Show password
          </label>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Create an account
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewerSignUpPage;

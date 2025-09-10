'use client';

import React from "react";

const ViewerLoginPage = ({
  onClose,
  onSwitchToSignUp,
  onLoginSuccess, // Added this prop
}: {
  onClose: () => void;
  onSwitchToSignUp: () => void;
  onLoginSuccess: () => void; // Added to the prop type
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle authentication here.
    // For now, we'll just call the success callback to show the message.
    onLoginSuccess();
  };
  return (
    <div className="relative z-10 max-w-md w-full space-y-6 bg-orange-900 bg-opacity-70 p-8 rounded-xl shadow-lg border border-orange-700">
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
        <div className="flex justify-center">
          <img
            src="/images/capstonova_logo.png"
            alt="Project Capstonova Logo"
            className="h-10 w-10"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          PROJECT CAPSTONOVA
        </h2>
        <p className="mt-2 text-center text-2xl text-gray-200 font-bold">
          LOGIN
        </p>
      </div>

      <form className="mt-8 space-y-4" action="#" method="POST" onSubmit={handleSubmit}>
        <input type="hidden" name="remember" defaultValue="true" />
        <div className="space-y-4">
          {/* CTU Email Input Field */}
          <div>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              className="appearance-none relative block w-full px-3 py-2 border-2 border-transparent bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="CTU Email"
            />
          </div>

          {/* Password Input Field */}
          <div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none relative block w-full px-3 py-2 border-2 border-transparent bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-200"
            >
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-orange-200 hover:text-orange-100"
            >
              Forgot Password?
            </a>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            LOGIN
          </button>
        </div>
      </form>
      <div className="text-sm text-center">
        <p className="text-gray-200">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToSignUp}
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Sign Up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default ViewerLoginPage;

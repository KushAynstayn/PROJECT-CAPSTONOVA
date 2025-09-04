import Image from "next/image";
import Link from "next/link";
import React from 'react';

export default function LandingPage() {
  return (
    // This main div is the container for the background image and the content
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Background Image using Next.js Image component */}
      <Image
        src="/images/landing1.jpg" // IMPORTANT: Replace with your actual image path
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="z-0"
        quality={100} 
      />

      {/* Semi-transparent overlay to ensure text is readable */}
      <div className="absolute inset-0 bg-black/48 z-10" />

      {/* Content is stacked on top of the background and overlay */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-4">

        {/* Logo/Icon */}
        <div>
          <Image
            src="/images/logo_capstonova.png"
            alt="Project Capstonova Logo"
            width={400}
            height={400}
            className="-mt-45"
          />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col items-center text-center -mt-20">
          {/* Project Title */}
          <h1 className="text-6xl font-extrabold tracking-wide font-geist-sans bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text mb-4">
            PROJECT CAPSTONOVA
          </h1>

          {/* Tagline */}
          <p className="text-xl text-gray-300 font-geist-mono mb-10 italic">
            "Innovate. Archive. Inspire. Your research is a legacy in the making."
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-6 mt-10">
            <Link href="/proponent-login" passHref>
              <button className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-700 text-white rounded-lg shadow-lg hover:from-orange-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 font-semibold text-lg">
                LOGIN
              </button>
            </Link>
            <Link href="/proponent-registration/step-1" passHref>
              <button className="px-8 py-2.5 border-2 border-orange-500 text-orange-400 rounded-lg shadow-lg hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 font-semibold text-lg">
                <span>REGISTER HERE</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


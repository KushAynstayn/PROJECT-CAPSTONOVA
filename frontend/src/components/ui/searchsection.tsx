"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdvancedSearchModal } from "@/components/ui/advanced-search-modal";

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // This function now builds a query string for the 'q' parameter
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    if (!trimmedSearchTerm) return;

    // Use URLSearchParams to correctly format the query
    const params = new URLSearchParams();
    params.append("q", trimmedSearchTerm);

    // Navigate to the projects page with the query parameter
    router.push(`/projects?${params.toString()}`);
  };

  return (
    <section className="relative w-full h-[50vh] md:h-[130vh] text-center -mt-20">
      {/* Background Image Container (Layer 1 - Bottom) */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/caps-bg.jpg')" }}
      ></div>

      {/* Semi-transparent Overlay (Layer 2 - Middle) */}
      <div className="absolute inset-0 w-full h-full bg-black/37 z-10"></div>

      {/* Combined Content Layer with Images (Layer 3) */}
      <div className="relative z-20 flex flex-col items-center justify-center -mt-20">
        <Image
          src="/images/project.png"
          alt="Project"
          width={200}
          height={80}
          className="object-contain mt-40"
          priority
        />
        <Image
          src="/images/capstonova-home.png"
          alt="Capstonova Logo"
          width={550}
          height={100}
          className="object-contain -mt-80"
          priority
        />

        <form onSubmit={handleSearch} className="-mt-55 w-full max-w-3xl px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter title or abstract phrase to search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-6 pr-16 text-lg text-gray-900 bg-white placeholder:text-gray-500 border-2 border-yellow-700 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-700 hover:text-yellow-800"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
          <div className="mt-4 flex justify-center">
            <AdvancedSearchModal>
              <button
                type="button" // Add type="button" to prevent form submission
                className="text-gray-300 hover:text-white transition-colors duration-300 ease-in-out"
              >
                Advanced Search
              </button>
            </AdvancedSearchModal>
          </div>
        </form>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-30 bg-gradient-to-t from-black to-transparent z-30"></div>
    </section>
  );
};

export default HeroSection;

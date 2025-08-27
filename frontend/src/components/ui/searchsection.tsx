// src/components/HeroSection.tsx
import Image from 'next/image';
import { Button } from '@/components/ui/button'; // --- 1. IMPORT THE BUTTON COMPONENT ---

const HeroSection = () => {
  return (
    <section className="relative w-full h-[50vh] md:h-[130vh] text-center">
      {/* Background Image Container (Layer 1 - Bottom) */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('images/caps-bg.jpg')" }}
      ></div>

      {/* Semi-transparent Overlay (Layer 2 - Middle) */}
      <div className="absolute inset-0 w-full h-full bg-black/37 z-10"></div>

      {/* Combined Content Layer with Images (Layer 3) */}
      <div className="relative z-20 flex flex-col items-center justify-center -mt-5">
        <Image
          src="/images/project.png"
          alt="Project"
          width={200}
          height={80}
          className="object-contain"
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
        
        <div className="-mt-55 w-full max-w-3xl px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Here"
              className="w-full py-2 pl-6 pr-12 text-white bg-gradient-to-r from-yellow-600/80 to-amber-700/80 placeholder:text-gray-200 border-2 border-yellow-700 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-5">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-gray-200" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            {/* --- 2. USE THE SHADCN BUTTON COMPONENT --- */}
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-2" // Added margin-right for spacing
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              Advanced Search
            </Button>
          </div>
        </div>
      </div>

      <div 
        className="absolute bottom-0 left-0 w-full h-30 bg-gradient-to-t from-black to-transparent z-30"
      ></div>
    </section>
  );
};

export default HeroSection;
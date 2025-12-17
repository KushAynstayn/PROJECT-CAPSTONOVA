import React from 'react';
import Image from 'next/image';
import { AdvancedSearchModal } from "@/components/ui/advanced-search-modal";
// ... other imports

// SVG Icon Components (no changes here)
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-facebook">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);
const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-instagram">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);
const YouTubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-youtube">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 11.75a29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
);
const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-github">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);


const Footer = () => {
  return (
    // --- MODIFICATION START ---
    // 1. Removed inline style and added overflow-hidden. The footer must be relative.
    <footer className="relative text-white overflow-hidden">
      {/* 2. Added video background */}
      <video
        autoPlay
        loop
        muted
        playsInline // Important for mobile browsers
        className="absolute w-full h-full inset-0 object-cover"
      >
        {/* Make sure this path is correct and the video is in your /public folder */}
        <source src="/videos/space.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* The dark overlay remains the same to ensure text is readable over the video */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-none z-10"></div>
      
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-15"></div>


      <div className="relative container mx-auto px-6 py-10 flex flex-col items-center text-center z-20">
        {/* 1. Logo and Tagline */}
        <div className="mb-14">
          <Image 
            src="/images/logo_capstonova.png" 
            alt="Project Capstonova Logo" 
            width={180}
            height={50}
            className="object-contain mx-auto"
          />
          <p className="text-gray-300 mb-4 max-w-xl italic font-bold">
            "From Inquiry to Insight: Charting the Course of Academic Innovation."
          </p>
        </div>

        {/* 2. Navigation Links */}
        <nav className="mb-8">
          <ul className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
            <li><a href="/" className="text-gray-300 animated-button uppercase text-sm tracking-wider">Home</a></li>
            <li><a href="/library" className="text-gray-300 animated-button uppercase text-sm tracking-wider">Library</a></li>
            <li><a href="/view-suggestions" className="text-gray-300 animated-button uppercase text-sm tracking-wider">Suggestions</a></li>
            <li><a href="/view-trends" className="text-gray-300 animated-button uppercase text-sm tracking-wider">Data Analytics</a></li>
            <li>
              <AdvancedSearchModal>
                <button
                  type="button"
                  // Use the exact same classes as your other links for consistent styling
                  className="text-gray-300 animated-button uppercase text-sm tracking-wider"
                >
                  Advanced Search
                </button>
              </AdvancedSearchModal>
            </li>
            <li><a href="/about" className="text-gray-300 animated-button uppercase text-sm tracking-wider">About</a></li>
            <li><a href="/acm-templates" className="text-gray-300 animated-button uppercase text-sm tracking-wider">ACM Templates</a></li>
          </ul>
        </nav>

        {/* 3. Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors"><FacebookIcon /></a>
          <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors"><InstagramIcon /></a>
          <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors"><YouTubeIcon /></a>
          <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors"><GitHubIcon /></a>
        </div>

        {/* 4. Copyright and Legal Links */}
        <div className="w-full pt-8 border-t border-white/20 text-gray-400 text-sm">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-x-4 gap-y-2">
            <span>&copy; {new Date().getFullYear()} Project Capstonova. All Rights Reserved.</span>
            <div className="flex gap-x-4">
                <a href="/terms-of-service" className="animated-button">Terms of Service</a>
                <a href="/privacy-policy" className="animated-button">Privacy Policy</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
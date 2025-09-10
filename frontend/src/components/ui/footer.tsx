import React from 'react';

// SVG Icon Components for social media links
const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-linkedin">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-github">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-twitter">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
    </svg>
);


const Footer = () => {
  return (
    // --- Glassmorphism Effect Applied Here ---
    // bg-black/30: Semi-transparent black background
    // backdrop-blur-lg: Applies the blur effect to elements behind it
    // border-t border-white/20: A subtle top border to complement the glass effect
    <footer className="bg-black/30 backdrop-blur-lg border-t border-white/20 mt-20 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Logo and Tagline (spans 2 columns on larger screens) */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-yellow-400">Project Capstonova</h2>
            <p className="text-gray-300 mt-2 max-w-sm">
              "From Inquiry to Insight: Charting the Course of Academic Innovation."
            </p>
          </div>

          {/* Column 2: The Platform */}
          <div>
            <h3 className="text-lg font-semibold text-white uppercase tracking-wider">The Platform</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Browse Archive</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Data & Analytics</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Submit Project</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Advanced Search</a></li>
            </ul>
          </div>

          {/* Column 3: Resources & Support */}
          <div>
            <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Submission Guidelines</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">For Universities</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Column 4: About */}
          <div>
            <h3 className="text-lg font-semibold text-white uppercase tracking-wider">About</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* --- Bottom Section: Copyright and Socials --- */}
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Project Capstonova. All Rights Reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors"><TwitterIcon /></a>
            <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors"><LinkedInIcon /></a>
            <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors"><GitHubIcon /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

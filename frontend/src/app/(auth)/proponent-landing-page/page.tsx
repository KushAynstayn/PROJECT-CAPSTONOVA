import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden p-4">
      {/* Background Gradient / Effects */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-red-800 to-transparent rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[500px] h-[50px] bg-gradient-to-t from-purple-700 to-transparent rounded-full filter blur-3xl opacity-50"></div>
      </div>

      {/* Logo/Icon - Now an image */}
        <div>
          <Image
            src="/images/logo_capstonova.png" // The path to your image
            alt="Project Capstonova Logo"
            width={400} // Set your desired width
            height={400}
            className="-mt-45" // Set your desired height
             // Use Tailwind to control size if needed
          />
        </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center text-center -mt-20">
        

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
          <Link href="/register" passHref>
            <button className="px-8 py-2.5 border-2 border-orange-500 text-orange-400 rounded-lg shadow-lg hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 font-semibold text-lg">
              <span>REGISTER HERE</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
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

      <div className="absolute bottom-0 w-full h-10 bg-gradient-to-t from-gray-900 to-transparent opacity-50 z-0"></div>
    </div>
  );
}
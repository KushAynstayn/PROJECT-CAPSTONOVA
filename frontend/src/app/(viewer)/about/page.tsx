import React from "react";

const ViewAbout = () => {
  return (
    <div className="w-full">
      {/* Robot follow cursor Spline scene */}
      <div className="h-screen w-full">
        <iframe
          src="https://my.spline.design/robotfollowcursorforlandingpage-LfOjXWwWH9oxYXxDc7lKWtgm/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="block"
        ></iframe>
      </div>

      {/* About Us section */}
      <div className="py-12 text-center bg-white">
        <h1 className="text-3xl font-bold text-gray-800">About Us</h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-600">
          Welcome to Project CapstoNova, an innovative and secure web-based
          platform designed to revolutionize how capstone projects are managed,
          stored, and retrieved at Cebu Technological University (CTU) – College
          of Computer, Information and Communications Technology (CCICT).
        </p>
      </div>

      {/* Our Mission section */}
      <div className="py-12 text-center bg-black text-white">
        <h1 className="text-3xl font-bold">Our Mission</h1>
        <p className="mt-4 max-w-3xl mx-auto text-gray-200">
          At CapstoNova, we aim to streamline the management of capstone
          projects by providing a centralized digital repository that is both
          secure and user-friendly. We eliminate the inefficiencies of
          traditional paper-based systems and manual tracking by offering a
          smart, automated solution that ensures academic integrity, promotes
          originality, and enhances collaboration between students, faculty, and
          advisers.
        </p>
      </div>

      {/* What We Do section with background image */}
      <div
        className="relative py-16 text-center text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/images/aboutus-bg.jpg')" }}
      >
        {/* Full dark overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content stays above overlay */}
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">What We Do</h1>
          <p className="mb-4">
            Project CapstoNova is designed to address key challenges faced by
            both students and faculty, such as project title duplication, slow
            approval processes, and inefficient project tracking. With
            CapstoNova, users can:
          </p>
          <ul className="text-left list-disc list-inside space-y-2">
            <li>
              <strong>Search & Verify Capstone Titles:</strong> Quickly verify
              if a project title has already been proposed, reducing the risk of
              duplication.
            </li>
            <li>
              <strong>Intelligent Classification:</strong> Automatically
              categorize projects into categories like Web, Mobile, Hybrid, or
              IoT, helping users to manage and track projects efficiently.
            </li>
            <li>
              <strong>Data Analytics:</strong> Gain valuable insights with
              interactive dashboards that display trends, project distributions,
              and predictive analysis.
            </li>
            <li>
              <strong>Secure & Accessible:</strong> Store projects safely with
              encryption, ensuring that files are secure yet easily accessible
              for approved users.
            </li>
            <li>
              <strong>Collaborate Effectively:</strong> Enable seamless
              collaboration between students and faculty with integrated
              feedback and suggestion tools, enhancing the overall quality of
              capstone projects.
            </li>
          </ul>
        </div>
      </div>

      {/* Why Project CapstoNova section */}
      <div className="py-16 text-center text-white bg-gradient-to-b from-[#0d001a] to-[#000010]">
        <h1 className="text-3xl font-bold mb-6">Why Project CapstoNova?</h1>
        <p className="max-w-3xl mx-auto">
          Project CapstoNova is a complete solution for managing and archiving
          capstone projects. With powerful algorithms and secure local storage,
          it simplifies title verification, classification, and tracking.
          Designed for students, faculty, and administrators, it streamlines the
          entire process.
        </p>
      </div>

      {/* Fostering Innovation section - white bg */}
      <div className="py-16 text-center bg-white text-gray-800">
        <h1 className="text-3xl font-bold mb-4">
          Fostering Innovation. Simplifying Management. Shaping Future Leaders.
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600">
          Join us in transforming capstone project management at CTU and beyond.
        </p>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Meet the Team
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
          <div className="bg-white shadow-lg rounded-2xl p-4 text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <img
              src="/images/nino.jpg"
              alt="Arado, Niño John"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-800">
              Arado, Niño John
            </h2>
            <p className="text-sm text-gray-500">Hustler</p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-4 text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <img
              src="/images/harddy.jpg"
              alt="Canales, Kingston Harddy"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-800">
              Canales, Kingston Harddy
            </h2>
            <p className="text-sm text-gray-500">Hacker</p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-4 text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <img
              src="/images/leah.jpg"
              alt="Genson, Leah Faye"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-800">
              Genson, Leah Faye
            </h2>
            <p className="text-sm text-gray-500">Hipster</p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-4 text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <img
              src="/images/shekinah.jpg"
              alt="Jubahib, Shekinah Mae"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-800">
              Jubahib, Shekinah Mae
            </h2>
            <p className="text-sm text-gray-500">Hipster</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAbout;

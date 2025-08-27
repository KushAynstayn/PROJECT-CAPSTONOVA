// src/components/Footer.tsx

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 mt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold text-white">Team Members</h3>
            <ul className="text-gray-400">
              <li>John Doe - Project Manager</li>
              <li>Jane Smith - Lead Developer</li>
              <li>Alice Johnson - UI/UX Designer</li>
            </ul>
          </div>
          <div className="flex space-x-4">
            {/* TODO: Replace with actual social media icons */}
            <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
            <a href="#" className="text-gray-400 hover:text-white">GitHub</a>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-8 pt-6 border-t border-gray-800">
          <p>&copy; 2025 Project Capstonova. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
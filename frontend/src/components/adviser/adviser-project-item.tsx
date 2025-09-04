import { User } from "lucide-react";

interface ProjectItemProps {
  leaderName: string;
  course: string;
  projectTitle: string;
  onClick: () => void; // ✨ 1. Add an onClick prop
}

const ProjectItem = ({ leaderName, course, projectTitle, onClick }: ProjectItemProps) => {
  return (
    // ✨ 2. Add interactive classes and the onClick handler
    <div
      onClick={onClick}
      className="flex items-stretch mb-2 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl"
    >
      {/* Left side: Leader Info */}
      <div className="flex items-center gap-4 p-4 w-1/3">
        <div className="p-2 bg-gray-200 rounded-full">
          <User className="h-6 w-6 text-gray-600" />
        </div>
        <div>
          <p className="font-bold text-gray-800">{leaderName}</p>
          <p className="text-sm text-gray-500">{course}</p>
        </div>
      </div>

      {/* Right side: Project Title */}
      <div className="flex items-center p-4 w-2/3 bg-[#8B0000] text-white">
        <p className="font-semibold">{projectTitle}</p>
      </div>
    </div>
  );
};

export default ProjectItem;
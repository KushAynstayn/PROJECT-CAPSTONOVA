import { Users } from "lucide-react";

// Interface now expects the whole project object
interface Project {
  id: number;
  title: string;
  students: string[];
}

interface ProjectItemProps {
  project: Project;
  onClick: () => void;
}

const ProjectItem = ({ project, onClick }: ProjectItemProps) => {
  return (
    <div
      onClick={onClick}
      className="flex items-stretch mb-2 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-[1.01] hover:shadow-xl border"
    >
      {/* Left side: Proponents Info */}
      <div className="flex items-center gap-4 p-4 w-1/3">
        <div className="p-2 bg-gray-100 rounded-full">
          <Users className="h-6 w-6 text-gray-600" />
        </div>
        {/* This container now allows text to wrap properly */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800">Proponents</p>
          <p className="text-sm text-gray-500 break-words">
            {project.students.join(", ")}
          </p>
        </div>
      </div>

      {/* Right side: Project Title */}
      <div className="flex items-center p-4 w-2/3 bg-[#8B0000] text-white">
        <p className="font-semibold">{project.title}</p>
      </div>
    </div>
  );
};

export default ProjectItem;

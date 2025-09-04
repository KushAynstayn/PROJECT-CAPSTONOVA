"use client";

import React, { useState } from "react";
import ProjectItem from "@/components/adviser/adviser-project-item";
import { AdviserViewProject } from "@/components/adviser/adviser-project-view";
import mockProjects, { Project } from "@/data/adviser-projects";

const ProjectsPage = () => {
  //  State to track the currently selected project
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  //  Handler to set the selected project when an item is clicked
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  //  Handler to clear the selection and go back to the list
  const handleCloseDocument = () => {
    setSelectedProject(null);
  };

   return (
    <main className="p-4 md:p-8">
      {/* Conditional Rendering: Show document or list based on state */}
      {selectedProject ? (
        // If a project is selected, show the document view
        <AdviserViewProject
          project={selectedProject}
          onClose={handleCloseDocument}
        />
      ) : (
        // Otherwise, show the project list
        <div>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Projects</h1>
          <div>
            {mockProjects.map((project) => (
              <ProjectItem
                key={project.id}
                leaderName={project.leaderName}
                course={project.course}
                projectTitle={project.projectTitle}
                onClick={() => handleProjectClick(project)} // Pass the click handler
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );;
};

export default ProjectsPage;
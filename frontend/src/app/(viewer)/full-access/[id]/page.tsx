"use client";

import React, { useRef } from "react";

// Mock document chapters (you can replace with real content)
const documentChapters = [
  {
    id: "chapter1",
    title: "CHAPTER 1 INTRODUCTION",
    sections: [
      { id: "rationale", title: "Rationale of the Study", content: "In today's rapidly evolving educational environment..." },
      { id: "objectives", title: "Objectives of the Study", content: "The objectives of this research are to..." },
      { id: "scope", title: "Scope and Delimitation", content: "This study focuses on..." },
      { id: "terms", title: "Definition of Terms", content: "For clarity, the following terms are defined..." },
    ],
  },
  {
    id: "chapter2",
    title: "CHAPTER 2 REVIEW OF RELATED LITERATURE AND STUDIES",
    sections: [
      { id: "relatedLit", title: "Related Literature", content: "Many scholars have discussed..." },
      { id: "relatedStudies", title: "Related Studies", content: "Previous studies have shown..." },
    ],
  },
  {
    id: "chapter3",
    title: "CHAPTER 3 RESEARCH METHODOLOGY",
    sections: [
      { id: "methodology", title: "Software Engineering Methodology", content: "The methodology used in this study..." },
      { id: "planning", title: "Planning Phase", content: "During the planning phase..." },
      { id: "canvas", title: "Business Model Canvas Program", content: "The Business Model Canvas consists of..." },
    ],
  },
];

const FullAccessPage = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScrollTo = (id: string) => {
    const section = document.getElementById(id);
    if (section && contentRef.current) {
      contentRef.current.scrollTo({
        top: section.offsetTop - 20,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="px-8 mt-18 min-h-screen text-black flex flex-col">
        <main className="flex-1 overflow-y-auto p-6 max-w-10xl mt-4">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Left Section - Document Viewer */}
            <div
              ref={contentRef}
              className="flex-1 w-full bg-white p-8 rounded-lg shadow-lg max-h-[700px] overflow-y-auto fading-scrollbar leading-relaxed"
            >
              {documentChapters.map((chapter) => (
                <div key={chapter.id} className="mb-10">
                  <h2
                    id={chapter.id}
                    className="text-xl font-bold text-center mb-6 uppercase"
                  >
                    {chapter.title}
                  </h2>
                  {chapter.sections.map((section) => (
                    <div key={section.id} id={section.id} className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">
                        {section.title}
                      </h3>
                      <p className="text-justify text-gray-700">
                        {section.content}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Right Section - Table of Contents */}
            <aside className="w-full lg:w-80 bg-stone-200 p-6 rounded-lg shadow-lg max-h-[700px] overflow-y-auto fading-scrollbar">
              <h3 className="text-lg font-bold text-gray-800 mb-4 mt-2">
                Full Document
              </h3>
              <ul className="space-y-3">
                {documentChapters.map((chapter) => (
                  <li key={chapter.id}>
                    <p className="font-semibold text-gray-900">
                      {chapter.title}
                    </p>
                    <ul className="ml-4 mt-1 space-y-1 text-sm text-blue-700">
                      {chapter.sections.map((section) => (
                        <li key={section.id}>
                          <button
                            onClick={() => handleScrollTo(section.id)}
                            className="hover:underline text-left"
                          >
                            {section.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
};

export default FullAccessPage;

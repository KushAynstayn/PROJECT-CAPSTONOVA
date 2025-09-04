// components/SubmittedManuscriptView.tsx
import React from "react";

const SubmittedManuscriptView: React.FC = () => {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold justify-left">
          File Uploaded (Manuscript)
        </h1>
        <h1 className="text-1xl font-normal justify-left">
          Your source code has been successfully uploaded in the repository.
        </h1>
      </div>
      <div className="overflow-y-auto mt- 10 bg-white p-8 md:p-12 lg:p-16 rounded-lg shadow-lg max-w-4xl mx-auto my-10">
        {/* Title Page */}
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold mb-4">
            ENHANCING CAPSTONE ARCHIVING AND OPTIMIZING DATA INTELLIGENCE WITH
            PROJECT CAPSTONOVA
          </h1>
          <p className="text-lg mb-8">
            A Capstone Project Presented to the Faculty of College of Computer,
            Information and Communications Technology Cebu Technological
            University-Main Campus
          </p>
          <div className="mt-20">
            <p className="text-lg">
              In Partial Fulfillment of Requirements for the degree Bachelor of
              Science in Information Systems
            </p>
            <div className="mt-16">
              <p className="text-xl font-semibold">By</p>
              <p className="text-md mt-4">
                Ando, Kido John
                <br />
                Casion, Kingston Haddly
                <br />
                Gumon, Loreb Faye
                <br />
                Jabalde, Shekinah Mae
              </p>
            </div>
            <div className="mt-20">
              <p className="text-lg font-semibold">Angelbert P. Maghanoy</p>
              <p className="text-sm mt-1">Adviser</p>
            </div>
          </div>
        </div>

        {/* Abstract */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-300 pb-2">
            Abstract
          </h2>
          <p className="text-gray-700 leading-relaxed">
            This project, Capstonova, introduces a novel system for enhancing
            capstone archiving and optimizing data intelligence. By leveraging
            advanced data structuring and retrieval techniques, the system
            addresses the common challenges faced by academic institutions in
            managing and accessing student research. The platform's intuitive
            interface allows for seamless file uploads and efficient
            keyword-based searching, providing a centralized and easily
            navigable repository. The findings demonstrate a significant
            improvement in data accessibility and management, positioning the
            system as a valuable tool for future research and academic
            collaboration.
          </p>
        </section>

        {/* Table of Contents */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-300 pb-2">
            Table of Contents
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li className="mb-1">
              <a href="#introduction" className="hover:text-blue-600">
                Introduction . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . 1
              </a>
            </li>
            <li className="mb-1">
              <a href="#literature-review" className="hover:text-blue-600">
                Literature Review . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . 2
              </a>
            </li>
            <li className="mb-1">
              <a href="#methodology" className="hover:text-blue-600">
                Methodology . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . 3
              </a>
            </li>
            <li className="mb-1">
              <a href="#results" className="hover:text-blue-600">
                Results and Findings . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . 4
              </a>
            </li>
            <li className="mb-1">
              <a href="#conclusion" className="hover:text-blue-600">
                Discussion and Conclusion . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . 5
              </a>
            </li>
            <li className="mb-1">
              <a href="#references" className="hover:text-blue-600">
                References . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . 5
              </a>
            </li>
          </ul>
        </section>

        {/* Main Content Sections */}
        <section id="introduction" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            {/* Placeholder for Introduction text */}
            The digitalization of academic records presents a significant
            opportunity for universities to enhance accessibility and data
            management. Traditional archiving methods, often involving physical
            storage or decentralized digital files, pose challenges in terms of
            retrieval, security, and scalability. This project addresses these
            issues by developing a centralized, web-based platform tailored for
            capstone manuscript archiving. The system aims to streamline the
            submission process, enable robust search functionalities, and
            provide a foundation for data-driven insights into student research
            trends. This introduction outlines the problem statement, project
            objectives, and the scope of the developed system, highlighting its
            potential to transform academic archiving practices.
          </p>
        </section>

        <section id="literature-review" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Literature Review</h2>
          <p className="text-gray-700 leading-relaxed">
            {/* Placeholder for Literature Review text */}
            Numerous studies have explored the transition from physical to
            digital academic archives, noting improvements in space efficiency
            and access. Research by Smith (2018) on institutional repositories
            highlights the importance of metadata for effective search and
            discovery. Additionally, the adoption of cloud-based solutions has
            been shown to reduce infrastructure costs and improve data security,
            as discussed by Jones (2020). This literature review synthesizes
            existing research on digital archiving, database management, and
            user interface design to inform the development of Project
            Capstonova. It also examines current archiving practices within
            academic institutions to identify gaps that the proposed system can
            fill.
          </p>
        </section>

        <section id="methodology" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Methodology</h2>
          <p className="text-gray-700 leading-relaxed">
            {/* Placeholder for Methodology text */}
            The system was developed using a agile methodology, with an emphasis
            on iterative design and continuous feedback. The frontend was built
            with React and Next.js for a fast and responsive user experience.
            Tailwind CSS was used for styling to ensure a modern and consistent
            design. The backend leverages a Node.js server with a MongoDB
            database for scalable and flexible data storage. A file upload
            service was implemented to handle manuscript and source code files
            securely, storing them in the public directory for prototyping and
            future cloud integration. Usability testing was conducted with a
            small group of students and faculty to gather feedback and refine
            the system's features.
          </p>
        </section>

        <section id="results" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Results and Findings</h2>
          <p className="text-gray-700 leading-relaxed">
            {/* Placeholder for Results and Findings text */}
            The implemented system successfully archives capstone manuscripts
            and related source code files. Initial tests showed a 95% success
            rate for file uploads and a significant reduction in file retrieval
            time compared to manual search methods. Users reported a high level
            of satisfaction with the system's intuitive interface and efficient
            search functionality. The data intelligence features, including
            keyword frequency analysis and thematic categorization, provided
            valuable insights that were previously unavailable. These results
            indicate that the system meets its primary objectives of enhancing
            archiving and optimizing data intelligence.
          </p>
        </section>

        <section id="conclusion" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Discussion and Conclusion</h2>
          <p className="text-gray-700 leading-relaxed">
            {/* Placeholder for Discussion and Conclusion text */}
            The Capstonova project successfully demonstrates a viable solution
            for modernizing academic archiving. The system's centralized design
            and robust search capabilities significantly improve data
            accessibility and management. While the current prototype focuses on
            core functionalities, future work could include advanced user
            authentication, integration with academic databases, and enhanced
            data analytics to support more sophisticated research trends. In
            conclusion, the system provides a strong foundation for a scalable
            and intelligent academic repository, promising to benefit students,
            faculty, and administrators.
          </p>
        </section>

        <section id="references" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">References</h2>
          <ul className="list-none text-gray-700">
            <li className="mb-2">
              Smith, J. (2018). The Role of Institutional Repositories in
              Digital Archiving. Journal of Academic Libraries, 25(3), 112-125.
            </li>
            <li className="mb-2">
              Jones, A. (2020). Cloud-Based Archiving Solutions for Educational
              Institutions. International Journal of Educational Technology,
              42(1), 55-68.
            </li>
          </ul>
        </section>
      </div>
    </>
  );
};

export { SubmittedManuscriptView };

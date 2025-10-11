"use client";

import React, { useRef } from "react";
import { motion, Variants } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { ScrambleTitle } from "@/components/ui/scramble-title";
import FeatureCarousel from "@/components/ui/features-carousel-3d";

// --- Data for team members ---
const teamMembers = [
  {
    name: "Arado, Niño John",
    role: "Hustler",
    imgSrc: "/images/nino.jpg",
    socials: {
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
    },
  },
  {
    name: "Canales, Kingston Harddy",
    role: "Hacker",
    imgSrc: "/images/harddy.jpg",
    socials: {
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
    },
  },
  {
    name: "Genson, Leah Faye",
    role: "Hipster",
    imgSrc: "/images/leah.jpg",
    socials: {
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
    },
  },
  {
    name: "Jubahib, Shekinah Mae",
    role: "Hipster",
    imgSrc: "/images/shekinah.jpg",
    socials: {
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
    },
  },
];

// --- Features for carousel ---
const features = [
  {
    id: "1",
    title: "Search & View Capstone Projects",
    description:
      "Quickly verify if a project title has already been proposed, reducing the risk of duplication.",
    videoSrc: "/videos/search.mp4",
  },
  {
    id: "2",
    title: "Centralized & Secure Local Archiving",
    description:
      "Create a secure, centralized local archive for all capstone project files.",
    videoSrc: "/videos/secure.mp4",
  },
  {
    id: "3",
    title: "Data Analytics",
    description:
      "Gain valuable insights with interactive dashboards that display trends, project distributions, and predictive analysis.",
    videoSrc: "/videos/trends.mp4",
  },
  {
    id: "4",
    title: "Secure & Accessible",
    description:
      "Store projects safely with encryption, ensuring that files are secure yet easily accessible for approved users.",
    videoSrc: "/videos/access.mp4",
  },
  {
    id: "5",
    title: "Role-Based Access Control (RBAC)",
    description:
      "Provide secure, role-based access with specific permissions for each user type.",
    videoSrc: "/videos/rbac.mp4",
  },
];


// --- Animation Wrappers ---
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedSection = ({ children, className = "" }: AnimatedSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

interface AnimatedTextWordByWordProps {
  text: string;
  className?: string;
}

const AnimatedTextWordByWord = ({
  text,
  className = "",
}: AnimatedTextWordByWordProps) => {
  const words = text.split(" ");
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.04 },
    },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
  };

  return (
    <motion.p
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.6 }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          ref={(el) => {
            wordRefs.current[index] = el;
          }}
          variants={childVariants}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
};

// --- MAIN COMPONENT ---
export default function ViewAbout() {
  return (
    <div className="w-full bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen w-full">
        <iframe
          src="https://my.spline.design/finalcapstonova-NtHDdxo20TxAXksU9fhORpnE/"
          frameBorder="0"
          width="100%"
          height="700px"
          className="block"
        ></iframe>
      </div>

      {/* About Section */}
      <div className="min-h-screen w-full flex flex-col items-center justify-center text-center p-4">
        <ScrambleTitle text="About Us" />
        <AnimatedTextWordByWord
          className="mt-6 max-w-3xl text-xl text-gray-300 leading-relaxed"
          text="Welcome to Project CapstoNova, an innovative and secure web-based platform designed to revolutionize how capstone projects are managed, stored, and retrieved at Cebu Technological University (CTU) – College of Computer, Information and Communications Technology (CCICT)."
        />
      </div>

      {/* Our Mission */} 
      <div className="py-12 text-center bg-black text-white"> 
        <AnimatedSection> 
          <ScrambleTitle text="Our Mission" /> 
          <AnimatedTextWordByWord className="mt-4 max-w-3xl text-xl mx-auto text-gray-200" text="At CapstoNova, we aim to streamline the management of capstone projects by providing a centralized digital repository that is both secure and user-friendly. We eliminate the inefficiencies of traditional paper-based systems and manual tracking by offering a smart, automated solution that ensures academic integrity, promotes originality, 
          and enhances collaboration between students, faculty, and advisers." /> </AnimatedSection> 
      </div>

      {/* What We Do Section */}
      <section className="py-24 bg-black text-white text-center">
        <AnimatedSection>
          <ScrambleTitle text="What We Do" />
          <AnimatedTextWordByWord
          className="mt-6 max-w-3xl text-xl text-gray-300 leading-relaxed mx-auto"
          text="Project CapstoNova is designed to address key challenges faced by both students and faculty. 
            We provide a suite of powerful tools to streamline the entire capstone process."/>
        </AnimatedSection>

        {/* Carousel */}
        <FeatureCarousel features={features} />
      </section>

      {/* Team Section */}
      <section className="py-24 bg-black text-gray-800">
        <AnimatedSection>
          <ScrambleTitle text="Meet the Team" />
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              className="bg-white shadow-lg rounded-2xl p-6 text-center relative overflow-hidden"
              whileHover="hover"
              initial="rest"
              variants={{
                rest: { scale: 1, y: 0 },
                hover: { scale: 1.05, y: -10 },
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <img
                src={member.imgSrc}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-4 border-white shadow-md"
              />
              <h2 className="text-lg font-semibold">{member.name}</h2>
              <p className="text-sm text-gray-500">{member.role}</p>

              <motion.div
                className="absolute bottom-4 left-0 right-0 flex justify-center gap-4"
                variants={{
                  rest: { opacity: 0, y: 10 },
                  hover: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.2, ease: "easeIn" }}
              >
                <a
                  href={member.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black"
                >
                  <FaGithub size={24} />
                </a>
                <a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-700"
                >
                  <FaLinkedin size={24} />
                </a>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}


"use client";

import React, { useRef } from "react";
import { motion, Variants } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { ScrambleTitle } from "@/components/ui/scramble-title";
import FeatureCarousel from "@/components/ui/features-carousel-3d";
import TeamSection from "@/components/ui/team-section";




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
      <section className="text-center py-24 bg-black text-gray-800">
        <AnimatedSection> 
          <ScrambleTitle text="Meet the Creators" /> 
          <AnimatedTextWordByWord className="mt-4 max-w-3xl text-xl mx-auto text-gray-200" text="Behind every line of code and every design decision is a team that thrives on collaboration. We are a group of passionate students who supported, challenged, and inspired one another throughout this journey. This project is a testament to our shared dedication and teamwork." /> </AnimatedSection> 
        <TeamSection />

      </section>

      {/* Our Adviser */} 
      <div className="py-12 text-center bg-black text-white mb-20"> 
        <AnimatedSection> 
          <ScrambleTitle text="A Special Thanks to Our Mentor" /> 
          <AnimatedTextWordByWord className="mt-4 max-w-3xl text-xl mx-auto text-gray-200" text="This project would not have been possible without the mentorship of Professor Angelbert Maghanoy. We are incredibly grateful for his unwavering support, insightful feedback, and constant encouragement that guided us every step of the way." /> </AnimatedSection> 
      </div>
    </div>
  );
}


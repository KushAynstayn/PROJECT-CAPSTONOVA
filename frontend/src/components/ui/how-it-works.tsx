// src/components/HowItWorks.tsx
"use client";

import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ScrambleTitle } from "./scramble-title";
import { memo } from "react";

const steps = [
  {
    title: "Search & Discover",
    description: "Find projects using keywords, departments, or technologies.",
    video: "/videos/search.mp4",
  },
  {
    title: "Analyze Trends",
    description: "Explore data-driven insights on popular topics and tools.",
    video: "/videos/trends.mp4",
  },
  {
    title: "Get Inspired",
    description: "Draw ideas and inspiration for your own capstone project.",
    video: "/videos/inspired.mp4",
  },
];

// Step component
const HowItWorksStep = memo(({ step, index }: { step: typeof steps[0]; index: number }) => {
  const { ref, inView } = useInView({
    threshold: 0.3, // ✅ triggers when ~30% is visible
    triggerOnce: false, // ✅ always animate on scroll
  });

  const videoVariants: Variants = {
    hidden: { x: index % 2 === 0 ? -80 : 80, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.15, ease: "easeOut" } },
  };

  return (
    <div
      ref={ref}
      className={`flex flex-col lg:flex-row items-center ${
        index % 2 !== 0 ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Video animation */}
      <motion.div
        className="lg:w-1/2 h-72 overflow-hidden shadow-md flex items-center justify-center will-change-transform"
        variants={videoVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <video
          src={step.video}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Text animation */}
      <motion.div
        className="lg:w-1/2 flex flex-col items-center justify-center text-center px-6"
        variants={textVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <h3 className="text-2xl font-semibold mb-4 text-white">{step.title}</h3>
        <p className="text-gray-400">{step.description}</p>
      </motion.div>
    </div>
  );
});

const HowItWorks = () => {
  return (
    <section className="bg-black mt-20 mb-28 mx-auto py-16">
      <ScrambleTitle text="How It Works" />
      <div className="flex flex-col mt-16">
        {steps.map((step, index) => (
          <HowItWorksStep key={index} step={step} index={index} />
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;

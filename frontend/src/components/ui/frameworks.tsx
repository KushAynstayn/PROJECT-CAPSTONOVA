// src/components/CapstoneTrends.tsx
"use client"

import { motion } from "framer-motion";
import { ChartBarMultiple } from "@/components/ui/chart-bar-multiple"; // Assuming this is the correct path

// Animation variants for the container (director) and its items (actors)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FrameworksArea = () => {
  return (
    // The animation container that orchestrates the animation
    <motion.section
      className="bg-black mx-auto px-6 py-10 my-2 rounded-lg"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      // Re-animates every time it's scrolled into view
      viewport={{ amount: 0.3 }}
    >
      {/* The animated item */}
      <motion.div variants={itemVariants} className="w-full">
        <ChartBarMultiple />
      </motion.div>
    </motion.section>
  );
};

export default FrameworksArea;
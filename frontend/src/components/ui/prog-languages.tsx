// src/components/CapstoneTrends.tsx
"use client"

import { motion } from "framer-motion";
import { ChartLineMultiple } from "@/components/ui/chart-line-multiple";
import { ScrambleTitle } from "@/components/ui/scramble-title";

// Variants for the container and the chart
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AnalyticsSpotlight = () => {
  return (
    <motion.section
      className="bg-black mx-auto px-6 py-10 rounded-lg"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
    >
      {/* The ScrambleTitle now handles its own animation and doesn't need a motion wrapper */}
      <ScrambleTitle text="Statistics at a Glance" />
      
      {/* The chart can still be part of the stagger animation */}
      <motion.div variants={itemVariants} className="w-full">
        <ChartLineMultiple />
      </motion.div>
    </motion.section>
  );
};

export default AnalyticsSpotlight;
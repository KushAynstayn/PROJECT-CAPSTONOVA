"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Download, CheckCircle, XCircle, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";

// Animation variants for smooth entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function ACMTemplatesPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
      {/* Background Gradient Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-yellow-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-yellow-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
        
        {/* PAGE HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-100 to-yellow-500 mb-4">
            ACM Manuscript Standards
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Official templates and formatting guidelines for Capstonova proponents. 
            Ensure your documentation meets the panel's compliance standards.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          {/* SECTION 1: DOWNLOADABLE TEMPLATES */}
          <section>
            <div className="flex items-center gap-3 mb-8 mt-30">
              <FileText className="text-yellow-500 w-8 h-8" />
              <h2 className="text-2xl font-semibold">Downloadable Templates</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Word Template Card */}
              <motion.div 
                variants={itemVariants}
                className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-yellow-500/50 transition-all duration-300"
              >
                <div className="absolute top-4 right-4 bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  .DOCX
                </div>
                <h3 className="text-2xl font-bold mb-2">Microsoft Word</h3>
                <p className="text-gray-400 mb-6">
                  Standard ACM format with pre-configured styles for headings, captions, and columns. Best for most students.
                </p>
                {/* NOTE: Replace href with your actual file path in the public folder */}
                <a 
                  href="/assets/ACM-Template.docx" 
                  download 
                  className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Word Template
                </a>
              </motion.div>

              {/* LaTeX Template Card */}
              <motion.div 
                variants={itemVariants}
                className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-yellow-500/50 transition-all duration-300"
              >
                <div className="absolute top-4 right-4 bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  LaTeX
                </div>
                <h3 className="text-2xl font-bold mb-2">LaTeX / Overleaf</h3>
                <p className="text-gray-400 mb-6">
                  For advanced formatting. Includes the `.cls` class file and bibliography management. Recommended for complex math.
                </p>
                {/* NOTE: Replace href with your actual file path */}
                <a 
                  href="/assets/ACM-LaTeX.zip" 
                  download 
                  className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download LaTeX Package
                </a>
              </motion.div>
            </div>
          </section>

          {/* SECTION 2: DO'S AND DON'TS GRID */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="text-yellow-500 w-8 h-8" />
              <h2 className="text-2xl font-semibold">Quick Formatting Guide</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* The Good */}
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-green-400">Citations</h4>
                    <p className="text-sm text-gray-300">Use numeric citations in brackets (e.g., [1]) sorted by order of appearance, not alphabetically.</p>
                  </div>
                </div>
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-green-400">Figures & Tables</h4>
                    <p className="text-sm text-gray-300">Captions for Tables go ABOVE the table. Captions for Figures go BELOW the figure.</p>
                  </div>
                </div>
              </motion.div>

              {/* The Bad */}
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-400">Margins</h4>
                    <p className="text-sm text-gray-300">Do not adjust the template margins to fit more text. The double-column layout is strict.</p>
                  </div>
                </div>
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-400">Abstract</h4>
                    <p className="text-sm text-gray-300">Do not cite references inside the Abstract. It must stand alone as a summary.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* SECTION 3: HELP NOTICE */}
          <motion.div 
            variants={itemVariants}
            className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex flex-col md:flex-row items-center gap-4 text-center md:text-left mb-30"
          >
            <AlertCircle className="w-10 h-10 text-yellow-500" />
            <div>
              <h3 className="text-lg font-bold text-white">Need help with the format?</h3>
              <p className="text-sm text-gray-400">
                Check the "Library" module for past approved capstone manuscripts to see real-world examples.
              </p>
            </div>
            <div className="md:ml-auto">
              <Link href="/library">
                <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors">
                  Go to Library
                </button>
              </Link>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Feature {
  id: string;
  title: string;
  description: string;
  videoSrc: string;
}

interface FeatureCarouselProps {
  features: Feature[];
}

export default function FeatureCarousel({ features }: FeatureCarouselProps) {
  // spin is allowed to grow (or decrease) without modulo so rotation is continuous
  const [spin, setSpin] = useState<number>(0);
  const count = features.length;

  // for fade-in on every scroll (re-triggers)
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(carouselRef, { amount: 0.4, once: false });

  // angle per item (keeps your layout math generic; for 5 items this is 72deg)
  const angleStep = 360 / Math.max(1, count);

  // Auto rotate when the carousel is in view. Uses spin++ (no modulo)
  useEffect(() => {
    if (!isInView) return;
    const id = setInterval(() => {
      setSpin((s) => s + 1);
    }, 3500); // ms per step, adjust if you want faster/slower
    return () => clearInterval(id);
  }, [isInView]);

  // Infinite arrow navigation (no jump; spin increments/decrements continuously)
  const next = () => setSpin((s) => s + 1);
  const prev = () => setSpin((s) => s - 1);

  // compute rotation from unbounded spin
  const rotation = spin * -angleStep;

  // compute active index for opacity/scale using modulo (keeps visual highlight correct)
  const activeIndex = ((spin % count) + count) % count;

  return (
    <motion.div
      ref={carouselRef}
      className="relative w-full h-[500px] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* 3D Ring Container - layout unchanged */}
      <div className="relative w-[400px] h-[300px]"
        style={{
          perspective: "2000px",
          perspectiveOrigin: "50% 50%",
          transformStyle: "preserve-3d",
        }}>
        <div
          className="absolute inset-0 transition-transform duration-700 ease-in-out"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
            transform: `rotateY(${rotation}deg)`,
          }}
        >
          {features.map((feature, i) => {
            const angle = i * angleStep;
            const isActive = i === activeIndex;
            return (
              <div
                key={feature.id}
                className="absolute w-[450px] h-[280px] bg-[#111] border border-amber-600/50 shadow-2xl text-center flex flex-col justify-end overflow-hidden"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(400px)`,
                  transformStyle: "preserve-3d",
                  opacity: isActive ? 1 : 0.6,
                  // keep scale transition but do not change any sizes
                  transition: "opacity 0.6s ease, transform 0.6s ease",
                }}
              >
                {/* Video background - unchanged */}
                <video
                  src={feature.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />

                {/* Text Overlay - unchanged */}
                <div className="relative z-10 p-6">
                  <h3 className="text-2xl font-bold text-amber-500 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SVG Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-10 top-1/2 -translate-y-1/2 bg-amber-600 text-black p-3 rounded-full hover:bg-amber-500 transition"
        aria-label="Previous"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        onClick={next}
        className="absolute right-10 top-1/2 -translate-y-1/2 bg-amber-600 text-black p-3 rounded-full hover:bg-amber-500 transition"
        aria-label="Next"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </motion.div>
  );
}

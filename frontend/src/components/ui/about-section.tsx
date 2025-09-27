"use client";

import { Suspense, useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  cubicBezier,
} from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// --- Data for the Manifesto Statements ---
const manifestoStatements = [
  { text: "Knowledge should never be lost to time.", highlight: "Knowledge" },
  { text: "Every project is a stepping stone for the next.", highlight: "project" },
  { text: "We built a universe to connect them all.", highlight: "universe" },
  { text: "This is Project Capstonova.", highlight: "Project Capstonova." },
];

// --- Background Dust Particles ---
function DustParticles() {
  const ref = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 1500; // ✅ lowered slightly (2000 → 1500) to ease GPU load
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      // ✅ lighter rotation speed
      ref.current.rotation.y -= delta / 20;
      ref.current.rotation.x -= delta / 25;
    }
  });

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.015}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

// --- Manifesto Statement ---
const ManifestoStatement = ({ text, highlight, progress, range }: {
  text: string; highlight: string; progress: any; range: [number, number];
}) => {
  const opacity = useTransform(progress, [range[0], range[0] + 0.1, range[1] - 0.1, range[1]], [0, 1, 1, 0]);
  const y = useTransform(progress, [range[0], range[0] + 0.1, range[1] - 0.1, range[1]], [30, 0, 0, -30]);

  const parts = useMemo(
    () => text.split(new RegExp(`(${highlight})`, "gi")),
    [text, highlight]
  ); // ✅ memoize split so it’s not recalculated every frame

  return (
    <motion.h2
      style={{ opacity, y, willChange: "opacity, transform" }} // ✅ GPU hint
      className="text-4xl md:text-6xl font-bold text-center text-white absolute inset-0 h-full flex items-center justify-center px-8"
    >
      <span className="text-center">
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span
              key={i}
              className="bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-600 bg-clip-text text-transparent"
            >
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    </motion.h2>
  );
};

// --- Shooting Star ---
const ShootingStar = ({ progress }: { progress: any }) => {
  const startScroll = 0.75;
  const endScroll = 1.0;

  const x = useTransform(progress, [startScroll, endScroll], [150, 1300]);
  const opacity = useTransform(progress, [startScroll, startScroll + 0.02, endScroll - 0.02, endScroll], [0, 1, 1, 0]);
  const width = useTransform(progress, [startScroll, startScroll + 0.05, endScroll - 0.05, endScroll], [0, 150, 150, 0], {
    ease: cubicBezier(0.42, 0, 0.58, 1),
  });
  const scaleY = useTransform(progress, [startScroll, startScroll + 0.05, endScroll - 0.05, endScroll], [0, 1, 1, 0], {
    ease: cubicBezier(0.42, 0, 0.58, 1),
  });

  return (
    <motion.div
      style={{ x, opacity, width, scaleY, willChange: "transform, opacity" }} // ✅ GPU hint
      className="absolute bottom-[40vh] h-[4px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full origin-left"
    >
      <motion.div
        style={{ opacity: useTransform(opacity, [0, 0.5, 1], [0, 0.8, 1]) }}
        className="absolute right-0 -translate-y-1/2 w-4 h-4 rounded-full bg-yellow-300 blur-sm"
      />
    </motion.div>
  );
};

// --- Section ---
const AboutSection = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40, // ✅ slightly less damping for smoother scrolling
    mass: 1,
  });

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden">
        <Canvas className="absolute inset-0 -z-10" camera={{ position: [0, 0, 5] }}>
          <Suspense fallback={null}>
            <DustParticles />
          </Suspense>
        </Canvas>

        {manifestoStatements.map((s, i) => (
          <ManifestoStatement
            key={i}
            text={s.text}
            highlight={s.highlight}
            progress={smoothProgress}
            range={[i * 0.25, i * 0.25 + 0.25]}
          />
        ))}

        <ShootingStar progress={smoothProgress} />
      </div>
    </section>
  );
};

export default AboutSection;

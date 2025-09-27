"use client";

import { useInView } from "react-intersection-observer";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

const techNodes = [
  "React",
  "Machine Learning",
  "Enterprise Systems",
  "IoT",
  "Transaction Systems",
  "API",
  "Inventory Systems",
  "Mobile Applications",
  "Web Applications",
  "Cybersecurity",
  "AI Tools",
  "Data Analytics",
  "E-Learning Platforms",
  "Healthcare Systems",
  "Smart Devices",
];

// ---------------- Dust Particles ----------------
function DustParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = 500;
  const radius = 30;

  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * radius;
      arr[i * 3 + 1] = (Math.random() - 0.5) * radius;
      arr[i * 3 + 2] = (Math.random() - 0.5) * radius;
    }
    return arr;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0008;
      pointsRef.current.rotation.x += 0.0003;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        {/* args added to satisfy types */}
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="white" transparent opacity={0.6} />
    </points>
  );
}

// ---------- Helper: make a Float32Array for a line from center to pos ----------
function linePositionsArray(pos: [number, number, number]) {
  const arr = new Float32Array(6);
  arr[0] = 0;
  arr[1] = 0;
  arr[2] = 0;
  arr[3] = pos[0];
  arr[4] = pos[1];
  arr[5] = pos[2];
  return arr;
}

// ---------------- Node (with labels) ----------------
function Node({
  position,
  label,
}: {
  position: [number, number, number];
  label: string;
}) {
  const [hovered, setHovered] = useState(false);

  const positionsArray = useMemo(() => linePositionsArray(position), [position]);

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positionsArray}
            count={positionsArray.length / 3}
            itemSize={3}
            args={[positionsArray, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          attach="material"
          color={hovered ? "gold" : "white"}
          linewidth={2}
          transparent
          opacity={hovered ? 1 : 0.1}
        />
      </line>

      <group
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <Text
          fontSize={0.36}
          color={hovered ? "gold" : "white"}
          anchorX="center"
          anchorY="middle"
          scale={hovered ? 1.15 : 1}
        >
          {label}
        </Text>
      </group>
    </group>
  );
}

// ---------------- Star Node (just stars) ----------------
function StarNode({
  position,
}: {
  position: [number, number, number];
}) {
  const [hovered, setHovered] = useState(false);

  const positionsArray = useMemo(() => linePositionsArray(position), [position]);

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positionsArray}
            count={positionsArray.length / 3}
            itemSize={3}
            args={[positionsArray, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          attach="material"
          color={hovered ? "gold" : "white"}
          linewidth={1}
          transparent
          opacity={hovered ? 1 : 0.1}
        />
      </line>

      <mesh
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color={hovered ? "gold" : "white"} />
      </mesh>
    </group>
  );
}

// ---------------- Galaxy ----------------
function Galaxy() {
  const groupRef = useRef<THREE.Group>(null);

  const labelPositions = useMemo(() => {
    return techNodes.map(() => [
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
    ]) as [number, number, number][];
  }, []);

  const starPositions = useMemo(() => {
    return Array.from({ length: 25 }, () => [
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 14,
    ]) as [number, number, number][];
  }, []);

  const globeLines = useMemo(() => {
    return Array.from({ length: 120 }, () => {
      const end = new THREE.Vector3().setFromSphericalCoords(
        8,
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2
      );
      // return position array for the end
      return [end.x, end.y, end.z] as [number, number, number];
    });
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002; // horizontal spin
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Logo */}
      <Html position={[0, 0, 0]} center>
        <div className="w-20 h-20 md:w-18 md:h-18 rounded-full border-2 border-yellow-400 shadow-[0_0_35px_rgba(255,215,0,1)] flex items-center justify-center bg-black">
          <img
            src="/images/logo_capstonova.png"
            alt="Capstone Repository Logo"
            className="w-16 h-16 rounded-full"
          />
        </div>
      </Html>

      {/* Labeled Nodes */}
      {labelPositions.map((pos, i) => (
        <Node key={i} position={pos} label={techNodes[i]} />
      ))}

      {/* Extra White Star Nodes */}
      {starPositions.map((pos, i) => (
        <StarNode key={`star-${i}`} position={pos} />
      ))}

      {/* Faded Globe Lines (all from center) */}
      {globeLines.map((endPos, i) => {
        const arr = new Float32Array([
          0,
          0,
          0,
          endPos[0],
          endPos[1],
          endPos[2],
        ]);
        return (
          <line key={`globe-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                array={arr}
                count={arr.length / 3}
                itemSize={3}
                args={[arr, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              attach="material"
              color="white"
              transparent
              opacity={0.1}
              linewidth={1}
            />
          </line>
        );
      })}
    </group>
  );
}

// ---------------- Starry Trail (UI) ----------------
function SparkleTrail() {
  return (
    <div className="absolute inset-x-0 top-20 flex justify-center pointer-events-none mt-4">
      <div className="flex gap-2">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-yellow-300"
            animate={{
              opacity: [0, 1, 0],
              y: [0, -12, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              delay: i * 0.12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------- Main Section ----------------
export default function GalaxySection() {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  return (
    <div
      ref={ref}
      className="h-[150vh] w-full bg-black relative mt-26 overflow-hidden"
    >
      {/* Keep Canvas mounted, but fade it in/out */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="h-full w-full"
      >
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} />

          <DustParticles />
          <Galaxy />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </motion.div>

      {/* Title with fade-in + slide-up */}
      <motion.div
        style={{ fontFamily: "'Black Ops One', sans-serif" }}
        className="absolute top-10 w-full text-center text-3xl font-extrabold pointer-events-none"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <span className="text-4xl bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,215,0,1)]">
          Unlocking the Archives: A Universe of Knowledge
        </span>
      </motion.div>

      {/* Starry Sparkle Trail also fades smoothly */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <SparkleTrail />
      </motion.div>
    </div>
  );
}
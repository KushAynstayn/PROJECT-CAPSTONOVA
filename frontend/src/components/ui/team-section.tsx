"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import { FaFacebook, FaGithub } from "react-icons/fa";


const teamMembers = [
  {
    name: "Arado, Niño John",
    role: "Hustler",
    imgSrc: "/images/arads.png",
    logo: "/images/hust.png", // 🔹 first logo here
    socials: {
      facebook: "https://www.facebook.com/ksh.aynstayn21",
      github: "https://github.com/KushAynstayn",
    },
  },
  {
    name: "Canales, Kingston Harddy",
    role: "Hacker",
    imgSrc: "/images/hards.png",
    logo: "/images/hack.png", // 🔹 second logo here
    socials: {
      facebook: "https://www.facebook.com/harddy.canales",
      github: "https://github.com/harddy0",
    },
  },
  {
    name: "Genson, Leah Faye",
    role: "Hipster",
    imgSrc: "/images/faye.png",
    logo: "/images/hips.png", // 🔹 third logo here
    socials: {
      facebook: "https://www.facebook.com/leahfaye.genson",
      github: "https://github.com/LeahFaye123",
    },
  },
  {
    name: "Jubahib, Shekinah Mae",
    role: "Hipster",
    imgSrc: "/images/she.png",
    logo: "/images/hips.png", // 🔹 reuse or add new logo
    socials: {
      facebook: "https://www.facebook.com/shekinahmaejubahib",
      github: "https://github.com/shekinahme",
    },
  },
];

const fadeVariants: Variants = {
  hiddenLeft: { opacity: 0, x: -80 },
  hiddenRight: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Animation variants for the team member image (scaling in on scroll)
const imageScaleVariants: Variants = {
    // These states match the parent's for synchronized animation
    hiddenLeft: { opacity: 0, scale: 0.5 },
    hiddenRight: { opacity: 0, scale: 0.5 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
    },
};

const TeamMember = ({ member, index }: { member: any; index: number }) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) controls.start("visible");
          else controls.start(index % 2 === 0 ? "hiddenRight" : "hiddenLeft");
        });
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [controls, index]);

  const fromRight = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={fromRight ? "hiddenRight" : "hiddenLeft"}
      animate={controls}
      variants={fadeVariants}
      className={`relative flex flex-col md:flex-row items-center justify-center py-10 ${
        fromRight ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Main container */}
      <div className="relative flex items-center justify-center w-full max-w-6xl px-8 md:px-6">
        {/* Stretching text box with unique corner logo */}
        <div className="relative border border-amber-400 bg-black/50 w-full h-50 z-0 mx-2">
          {member.logo && (
            <img
              src={member.logo}
              alt="Corner Logo"
              className={`absolute w-50 h-50 opacity-90 ${
                fromRight ? "left-2 bottom-2 top-2" : "right-2 bottom-2 top-2"
              }`}
            />
          )}
        </div>

        {/* Member image only (no gold frame) */}
        <div
          className={`absolute ${
            fromRight ? "right-12" : "left-12"
          } z-10`}
        >
          <motion.img
            src={member.imgSrc}
            alt={member.name}
            variants={imageScaleVariants}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-56 h-60 md:w-60 md:h-64 object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Text and social icons */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-center text-center z-[5]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <h2 className="text-2xl md:text-5xl font-bold text-white mx-2">
            {member.name}
          </h2>
          <p className="text-yellow-400 font-medium mt-4">{member.role}</p>

          {/* Icons appear only when hovering the text */}
          <div
            className={`flex justify-center gap-6 mt-8 transition-all duration-500 ${
              hovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            }`}
          >
            <a
              href={member.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:scale-110 transition-transform"
            >
              <FaFacebook size={26} />
            </a>
            <a
              href={member.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 hover:scale-110 transition-transform"
            >
              <FaGithub size={26} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function TeamSection() {
  return (
    <section className="relative py-28 overflow-hidden bg-black text-white">
      {/* Larger transparent logo */}
      <div className="absolute inset-0 flex justify-center items-center opacity-10 pointer-events-none">
        <img
          src="/images/logo_capstonova.png"
          alt="Logo watermark"
          className="w-[100%] max-w-7xl object-contain"
        />
      </div>

      <div className="relative z-10 flex flex-col gap-8 px-2 mx-4">
        {teamMembers.map((member, index) => (
          <TeamMember key={index} member={member} index={index} />
        ))}
      </div>
    </section>
  );
}

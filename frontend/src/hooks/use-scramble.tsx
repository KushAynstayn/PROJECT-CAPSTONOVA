"use client";

import { useEffect, useState, useRef, useMemo } from "react";

export const useScramble = (text: string, isInView: boolean, speed = 70) => {
  const [displayText, setDisplayText] = useState("");
  const chars = "!<>-_\\/[]{}—=+*^?#____";
  const rafId = useRef<number | null>(null);
  const frameRef = useRef(0);

  // ✅ Memoize delays so they aren’t recalculated every render
  const delays = useMemo(() => text.split("").map((_, i) => i * 3), [text]);

  useEffect(() => {
    if (!isInView) {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      return;
    }

    const totalFrames = 30; // how many frames each letter scrambles
    frameRef.current = 0;

    const animate = () => {
      let newText = "";
      const frame = frameRef.current;

      for (let i = 0; i < text.length; i++) {
        const start = delays[i];
        const end = start + totalFrames;

        if (frame < start) {
          newText += " ";
        } else if (frame >= end) {
          newText += text[i];
        } else {
          newText += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setDisplayText(newText);
      frameRef.current++;

      if (frame < totalFrames + delays[text.length - 1]) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text); // final result
      }
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isInView, text, delays, speed]);

  return displayText;
};

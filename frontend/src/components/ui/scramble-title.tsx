"use client"

import { useInView } from "react-intersection-observer";
import { useScramble } from '@/hooks/use-scramble';

interface ScrambleTitleProps {
  text: string;
}

export const ScrambleTitle = ({ text }: ScrambleTitleProps) => {
  // 1. Use the useInView hook *inside* this component
  const { ref, inView } = useInView({
    threshold: 0.3,
    // Note: triggerOnce is removed so it re-animates every time
  });

  // 2. Pass the 'inView' status to the scramble hook
  const displayText = useScramble(text, inView, 80);

  return (
    // 3. Attach the ref to the h2 element
    <h2 ref={ref}
    style={{ fontFamily: "'Black Ops One', sans-serif" }} 
      // --- Classes for the gold gradient effect have been added here ---
      className="text-5xl text-center mb-28 uppercase 
                 bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-600 
                 bg-clip-text text-transparent">
      {displayText}
    </h2>
  );
};
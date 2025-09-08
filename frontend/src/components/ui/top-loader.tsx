"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * A top loading bar that indicates page navigation.
 * It listens for route changes and displays a progress bar.
 */
export function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // This ref is used to store the previous path.
  // We compare it with the current path to detect a navigation event.
  const previousPath = useRef(pathname + searchParams.toString());

  useEffect(() => {
    const currentPath = pathname + searchParams.toString();

    // Only start the loader if the path has actually changed.
    if (previousPath.current !== currentPath) {
      // 1. Start loading when path changes.
      setIsVisible(true);
      setProgress(0); // Reset progress to the beginning.

      // 2. Simulate a loading progress animation.
      // This gives the user immediate feedback.
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          // Increment progress to give a feeling of movement.
          return prev + 20;
        });
      }, 100); // Update every 100ms.

      // 3. Finish the loading animation after a delay.
      // This simulates the time it takes for the page to "load".
      const finishTimeout = setTimeout(() => {
        setProgress(100); // Animate to full width.
        // 4. After the bar is full, wait for the fade-out animation to complete, then hide it.
        setTimeout(() => {
          setIsVisible(false);
          // 5. Reset progress for the next navigation.
          setTimeout(() => setProgress(0), 500);
        }, 500);
      }, 800); // Simulate an 800ms page load.

      // Update the ref to the new path.
      previousPath.current = currentPath;

      // Cleanup timers if the component unmounts or path changes again.
      return () => {
        clearInterval(progressInterval);
        clearTimeout(finishTimeout);
      };
    }
  }, [pathname, searchParams]);

  return (
    <div
      className="top-loader"
      style={{
        width: `${progress}%`,
        opacity: isVisible ? 1 : 0,
      }}
    />
  );
}

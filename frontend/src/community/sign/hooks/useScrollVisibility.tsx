import { RefObject, useEffect, useState } from "react";

/**
 * Custom hook to handle scroll visibility
 * Only shows scrollbar when user is actively scrolling and hides it when not in use
 * @param scrollContainerRef Reference to the scrollable container element
 * @returns isScrolling state to determine scrollbar visibility
 */

const useScrollVisibility = (scrollContainerRef: RefObject<HTMLElement>) => {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const handleScrollStart = () => {
      setIsScrolling(true);
    };

    const handleScrollEnd = () => {
      setIsScrolling(false);
    };

    // For browsers that don't support scrollend
    const handleScrollStartFallback = () => {
      setIsScrolling(true);
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScrollStart);
      scrollContainer.addEventListener("scrollend", handleScrollEnd);

      // Check if browser supports scrollend event
      const hasScrollendSupport = "onscrollend" in window;

      if (!hasScrollendSupport) {
        scrollContainer.addEventListener("scroll", handleScrollStartFallback);
        document.addEventListener("mousemove", handleScrollEnd);
        document.addEventListener("touchstart", handleScrollEnd);
      }

      // Clean up function to remove event listeners
      return () => {
        scrollContainer.removeEventListener("scroll", handleScrollStart);
        scrollContainer.removeEventListener("scrollend", handleScrollEnd);

        if (!hasScrollendSupport) {
          scrollContainer.removeEventListener(
            "scroll",
            handleScrollStartFallback
          );
          document.removeEventListener("mousemove", handleScrollEnd);
          document.removeEventListener("touchstart", handleScrollEnd);
        }
      };
    }
  }, [scrollContainerRef]);

  return isScrolling;
};

export default useScrollVisibility;

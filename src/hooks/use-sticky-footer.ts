import { useState, useEffect, useRef } from 'react';

interface UseStickyFooterOptions {
  offset?: number; // Offset from bottom to trigger "home" position
}

export function useStickyFooter({ offset = 100 }: UseStickyFooterOptions = {}) {
  const [isSticky, setIsSticky] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);
  const originalPositionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current || !originalPositionRef.current) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Calculate if we're near the bottom
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
      const nearBottom = distanceFromBottom <= offset;

      // Get the original footer position
      const originalFooterRect = originalPositionRef.current.getBoundingClientRect();
      const originalFooterTop = originalFooterRect.top + scrollTop;

      // Check if the original footer position is visible
      const footerInView = scrollTop + windowHeight >= originalFooterTop;

      if (nearBottom || footerInView) {
        // When near bottom or footer is in view, slide to home position
        setIsSticky(false);
        setIsAtBottom(true);
      } else {
        // Otherwise, keep it sticky
        setIsSticky(true);
        setIsAtBottom(false);
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [offset]);

  return {
    isSticky,
    isAtBottom,
    footerRef,
    originalPositionRef,
  };
}

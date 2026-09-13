import { useState, useEffect, useRef } from 'react';

/**
 * Reusable IntersectionObserver hook for smooth, scroll-triggered visual reveals.
 *
 * @param {Object} options - Observer configuration
 * @param {number} options.threshold - Viewport intersection threshold (default: 0.2)
 * @param {string} options.rootMargin - Margin around the root (default: '0px 0px -50px 0px')
 * @param {boolean} options.triggerOnce - Whether animation should trigger only once (default: true)
 * @returns {[React.RefObject, boolean]} - Ref to attach to element and visibility boolean
 */
export const useInView = ({
  threshold = 0.2,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true,
} = {}) => {
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(node);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [elementRef, isInView];
};

export default useInView;

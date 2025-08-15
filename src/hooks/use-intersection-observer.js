import { useEffect, useRef, useState } from "react";

/**
 * A robust, reusable hook for the Intersection Observer API.
 * @param {object} options - The observer options (root, rootMargin, threshold).
 * @returns {{
 * ref: React.MutableRefObject,
 * isIntersecting: boolean,
 * entry: IntersectionObserverEntry | undefined
 * }} - An object containing the ref to attach, a boolean for intersection status, and the full observer entry.
 */
export const useIntersectionObserver = (options) => {
  // State to store the observer entry.
  const [entry, setEntry] = useState();

  // A ref to hold the DOM element we want to observe.
  const ref = useRef(null);

  // Memoize the options to prevent the effect from re-running on every render
  // if the options object is defined inline.
  const frozenOptions = JSON.stringify(options);

  useEffect(() => {
    const node = ref?.current; // The element to observe

    // Ensure the node exists and the observer is supported.
    const hasIOSupport = !!window.IntersectionObserver;
    if (!hasIOSupport || !node) return;

    const observerOptions = JSON.parse(frozenOptions);

    // Create the observer with a callback that updates our state.
    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry);
    }, observerOptions);

    // Start observing the element.
    observer.observe(node);

    // --- Best Practice: Cleanup ---
    // This cleanup function is called when the component unmounts or
    // when the dependencies (the node or options) change.
    return () => {
      observer.disconnect();
    };
  }, [ref, frozenOptions]);

  return {
    ref,
    isIntersecting: entry?.isIntersecting,
    entry,
  };
};

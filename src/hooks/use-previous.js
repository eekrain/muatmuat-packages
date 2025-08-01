import { useEffect, useRef } from "react";

/**
 * A custom hook that stores the previous value of a variable.
 * @template T
 * @param {T} value The current value.
 * @returns {T | undefined} The value from the previous render.
 */
export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

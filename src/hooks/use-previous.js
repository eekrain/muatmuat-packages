import { useEffect, useRef } from "react";

// Custom hook to track previous value
const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

export default usePrevious;

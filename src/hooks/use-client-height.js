import { useLayoutEffect, useRef, useState } from "react";

export const useClientHeight = ({ ref, onHeightChange, deps = [] }) => {
  const [height, setHeight] = useState(0);
  const timerRef = useRef(null);

  useLayoutEffect(() => {
    const getHeight = () => {
      if (ref.current && height === 0) {
        const h = ref.current.clientHeight;
        setHeight(h);
        onHeightChange?.(h);
      }
    };

    timerRef.current = setTimeout(getHeight, 50);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, height, ...deps]);

  return height;
};

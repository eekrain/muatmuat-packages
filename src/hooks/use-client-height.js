import { useEffect, useRef, useState } from "react";

export const useClientHeight = ({
  ref,
  deps = [],
  onlyChangeFirstTime = true,
}) => {
  const [height, setHeight] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const getHeight = () => {
      if (ref.current) {
        setHeight((prev) =>
          onlyChangeFirstTime && prev !== 0 ? prev : ref.current.clientHeight
        );
      }
    };

    timerRef.current = setTimeout(getHeight, 100);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...deps]);

  return height;
};

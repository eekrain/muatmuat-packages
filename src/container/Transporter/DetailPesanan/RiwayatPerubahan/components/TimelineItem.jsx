import { useEffect, useRef, useState } from "react";

// function timeline outer
function TimelineItem({ isLast, children }) {
  const itemRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!isLast && itemRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        setHeight(itemRef.current.offsetHeight);
      });
      resizeObserver.observe(itemRef.current);

      return () => resizeObserver.disconnect();
    }
  }, [isLast]);

  return (
    <div ref={itemRef} className="relative flex items-start gap-3">
      {!isLast && (
        <div
          className="absolute left-[7px] top-4 border-l-2 border-dashed border-neutral-400"
          style={{ height: height + 5 }}
        />
      )}

      {children}
    </div>
  );
}

export default TimelineItem;

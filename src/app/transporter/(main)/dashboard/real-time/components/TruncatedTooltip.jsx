"use client";

import { useEffect, useRef, useState } from "react";

import { InfoTooltip } from "@/components/Form/InfoTooltip";
import { cn } from "@/lib/utils";

const TruncatedTooltip = ({ text, lineClamp = 2, className = "" }) => {
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      const element = textRef.current;
      if (element) {
        if (element.scrollHeight > element.clientHeight) {
          setIsTruncated(true);
        } else {
          setIsTruncated(false);
        }
      }
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);

    return () => {
      window.removeEventListener("resize", checkTruncation);
    };
  }, [text]);

  const textElement = (
    <p ref={textRef} className={cn(`line-clamp-${lineClamp}`, className)}>
      {text}
    </p>
  );
  if (isTruncated) {
    return (
      <InfoTooltip
        trigger={textElement}
        side="top"
        align="start"
        className="w-[336px]"
        sideOffset={2}
      >
        {text}
      </InfoTooltip>
    );
  }
  return textElement;
};

export default TruncatedTooltip;

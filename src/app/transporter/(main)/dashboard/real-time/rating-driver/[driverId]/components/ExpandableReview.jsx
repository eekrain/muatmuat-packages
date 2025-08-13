"use client";

import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

const ExpandableReview = ({ text, limit = 40 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showToggle = text.length > limit;

  return (
    <div>
      <p
        className={`ml-1 text-xs font-medium text-neutral-900 ${!isExpanded && showToggle ? "line-clamp-1" : ""}`}
      >
        {text}
      </p>
      {showToggle && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-1 mt-1 flex items-center gap-1 text-xs font-medium text-primary-700 hover:underline"
        >
          {isExpanded ? "Sembunyikan" : "Lihat Selengkapnya"}
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      )}
    </div>
  );
};

export default ExpandableReview;

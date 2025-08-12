// app/(shipper)/dashboard/real-time/rating-driver/[driverId]/components/ExpandableReview.jsx
"use client";

import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

// app/(shipper)/dashboard/real-time/rating-driver/[driverId]/components/ExpandableReview.jsx

const ExpandableReview = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showToggle = text.length > 40;

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

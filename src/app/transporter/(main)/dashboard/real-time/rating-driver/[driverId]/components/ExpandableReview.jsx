"use client";

import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import { expandReview } from "@/services/Transporter/alerts/expandReview";

const ExpandableReview = ({ text, limit = 40, reviewId = null }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentText, setCurrentText] = useState(text);
  const showToggle = text.length > limit;

  const handleToggle = async () => {
    if (reviewId) {
      // Use API integration when reviewId is provided
      setIsLoading(true);
      try {
        const result = await expandReview(reviewId, !isExpanded);
        setIsExpanded(!isExpanded);
        setCurrentText(!isExpanded ? result.fullText : result.shortText);
      } catch (error) {
        // Fallback to local toggle if API fails
        setIsExpanded(!isExpanded);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Local toggle when no reviewId provided (backward compatibility)
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      <p
        className={`ml-1 text-xs font-medium text-neutral-900 ${!isExpanded && showToggle ? "line-clamp-1" : ""}`}
      >
        {reviewId ? currentText : text}
      </p>
      {showToggle && (
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className="ml-1 mt-1 flex items-center gap-1 text-xs font-medium text-primary-700 hover:text-primary-800 disabled:opacity-50"
        >
          {isLoading
            ? "Loading..."
            : isExpanded
              ? "Sembunyikan"
              : "Lihat Selengkapnya"}
          {!isLoading &&
            (isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
        </button>
      )}
    </div>
  );
};

export default ExpandableReview;

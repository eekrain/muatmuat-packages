// src/app/transporter/(main)/dashboard/real-time/components/SkeletonLoading.jsx
import React from "react";

const SkeletonCard = ({ className = "" }) => (
  <div className={`h-24 rounded-lg bg-neutral-200 ${className}`} />
);

const SkeletonSection = ({ children }) => (
  <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
    <div className="h-6 w-1/3 animate-pulse rounded-md bg-neutral-200" />
    <div className="h-4 w-1/2 animate-pulse rounded-md bg-neutral-200" />
    <div className="mt-2">{children}</div>
  </div>
);

const SkeletonLoading = () => {
  return (
    <div className="space-y-4 pb-6">
      <div className="h-8 w-1/4 animate-pulse rounded-md bg-neutral-200" />
      <SkeletonSection>
        <div className="grid animate-pulse grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </SkeletonSection>

      <SkeletonSection>
        <div className="grid animate-pulse grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-full min-h-40 rounded-lg bg-neutral-200" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-neutral-200" />
            ))}
          </div>
        </div>
      </SkeletonSection>

      <div className="space-y-4 rounded-lg border border-transparent bg-[#FFECB4] p-4">
        <div className="h-6 w-1/3 animate-pulse rounded-md bg-[#ffdf7e]" />
        <div className="h-4 w-1/2 animate-pulse rounded-md bg-[#ffdf7e]" />
        <div className="mt-2 grid animate-pulse grid-cols-4 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-neutral-100" />
          ))}
        </div>
      </div>

      <SkeletonSection>
        <div className="grid animate-pulse grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-neutral-100" />
          ))}
        </div>
      </SkeletonSection>
    </div>
  );
};

export default SkeletonLoading;

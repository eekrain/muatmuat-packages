// app/cs/(main)/dashboard/real-time/components/SkeletonLoading.jsx
import React from "react";

import { cn } from "@/lib/utils";

const SkeletonCard = ({ className = "" }) => (
  <div className={cn("h-[67px] rounded-lg bg-neutral-200", className)} />
);

const SkeletonSectionHeader = () => (
  <>
    <div className="h-3 w-1/3 animate-pulse rounded-md bg-neutral-200" />
    <div className="mt-1 h-2 w-1/2 animate-pulse rounded-md bg-neutral-200" />
  </>
);

const SkeletonLoading = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-4 p-6">
      <div className="h-8 w-1/4 animate-pulse rounded-md bg-neutral-200" />
      <div className="max-h-[256px] space-y-4 rounded-xl bg-white p-6 shadow-[0px_4px_11px_0px_#41414140]">
        <SkeletonSectionHeader />
        <div className="grid animate-pulse grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
      <div className="flex max-h-[256px] flex-col gap-4 lg:flex-row">
        <div className="flex-1 space-y-4 rounded-xl bg-[#FFECB4] p-6 shadow-[0px_4px_11px_0px_#41414140]">
          <div className="h-3 w-1/3 animate-pulse rounded-md bg-yellow-300" />
          <div className="h-2 w-1/2 animate-pulse rounded-md bg-yellow-300" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-[67px] animate-pulse rounded-lg bg-white"
              />
            ))}
          </div>
        </div>
        <div className="h-fit w-full shrink-0 rounded-xl bg-white p-6 shadow-[0px_4px_11px_0px_#41414140] lg:w-[308px]">
          <div className="flex justify-between">
            <div className="h-10 w-10 animate-pulse rounded-md bg-neutral-200" />
            <div className="mt-2 h-2 w-16 animate-pulse rounded-md bg-neutral-200" />
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div>
              <div className="h-2 w-32 animate-pulse rounded-md bg-neutral-200" />
              <div className="mt-2 h-2 w-14 animate-pulse rounded-md bg-neutral-200" />
            </div>
            <div className="mt-2 h-6 w-20 animate-pulse rounded-md bg-neutral-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoading;

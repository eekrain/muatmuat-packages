"use client";

import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed left-0 top-0 z-[95] flex h-full w-full items-center justify-center bg-transparent backdrop-blur-md">
      <Image
        src={`${process.env.NEXT_PUBLIC_ASSET_REVERSE}/img/loading-animation.webp`}
        width={100}
        height={100}
        alt="loading"
        unoptimized
      />
    </div>
  );
}

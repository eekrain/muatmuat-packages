"use client";

import { useLoadingStore } from "@/store/loadingStore";

export default function LoadingInteractive() {
  const isGlobalLoading = useLoadingStore((state) => state.isGlobalLoading);

  if (!isGlobalLoading) return null;

  return (
    <div className="fixed left-0 top-0 z-[9999] flex h-screen w-screen items-center justify-center bg-black/10 backdrop-blur-md">
      <img
        src={"/img/loading-animation.webp"}
        width={100}
        height={100}
        alt="loading"
      />
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

const PageTitle = ({
  className,
  href = null,
  children,
  withBack = true,
  onClick = null,
}) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <div className={cn("mb-4 flex items-center gap-3", className)}>
      {withBack && (
        <img
          src="/icons/arrow-left24.svg"
          width={24}
          height={24}
          className="cursor-pointer"
          alt="Back"
          onClick={handleBackClick}
        />
      )}
      <h1 className="capsize text-xl font-bold">{children}</h1>
    </div>
  );
};

export default PageTitle;

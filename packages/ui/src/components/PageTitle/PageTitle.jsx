"use client";

import { useRouter } from "next/navigation";

import IconComponent from "@/components/IconComponent/IconComponent";

import { cn } from "@/lib/utils";

const PageTitle = ({
  className,
  href = null,
  children,
  withBack = true,
  onClick = null,
  appearance = {
    iconClassName: "",
  },
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
    <div
      className={cn(
        "mb-4 flex items-center gap-3 text-xl font-bold",
        className
      )}
    >
      {withBack && (
        <button className={appearance.iconClassName} onClick={handleBackClick}>
          <IconComponent
            src="/icons/arrow-left24.svg"
            size="medium"
            className={cn("text-primary-700", appearance.iconClassName)}
          />
        </button>
      )}
      <h1>{children}</h1>
    </div>
  );
};

export default PageTitle;

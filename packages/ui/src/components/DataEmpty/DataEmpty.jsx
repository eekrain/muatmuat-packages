import Image from "next/image";

import { cn } from "@/lib/utils";

const DataEmpty = ({
  title = "add your title",
  subtitle = "add your subtitle",
  src = "/img/daftarprodukicon.png",
  isResponsive = true, // New prop with a default value of true
  className,
  titleClassname,
  subtitleClassname,
  imageClassname,
  childrenClassname,
  children,
}) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center bg-white px-4 py-[60px]",
        // Conditionally apply responsive styles based on the isResponsive prop
        {
          "min-[500px]:mb-4 min-[500px]:rounded-xl min-[500px]:p-6 min-[500px]:shadow-[0px_4px_11px_0px_rgba(65,65,65,0.25)]":
            isResponsive,
        },
        className
      )}
    >
      <Image
        src={src}
        width={95}
        height={95}
        alt="Empty cart"
        className={cn(imageClassname)}
      />
      <div
        className={cn("mt-2 font-semibold text-neutral-600", titleClassname)}
      >
        {title}
      </div>
      <div
        className={cn(
          "mb-3 max-w-[322px] text-center text-xs font-medium text-neutral-600",
          subtitleClassname
        )}
      >
        {subtitle}
      </div>
      <div className={cn("flex items-center gap-3", childrenClassname)}>
        {children}
      </div>
    </div>
  );
};

export default DataEmpty;

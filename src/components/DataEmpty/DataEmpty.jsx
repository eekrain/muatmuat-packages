import Image from "next/image";

import { cn } from "@/lib/utils";

const DataEmpty = ({
  title = "add your title",
  subtitle = "add your subtitle",
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center bg-white px-4 py-[60px]",
        "min-[500px]:mb-4 min-[500px]:rounded-xl min-[500px]:p-6 min-[500px]:shadow-[0px_4px_11px_0px_rgba(65,65,65,0.25)]",
        className
      )}
    >
      <Image
        src="/img/daftarprodukicon.png"
        width={95}
        height={95}
        alt="Empty cart"
      />
      <div className="mt-2 font-semibold text-neutral-600">{title}</div>
      <div className="mb-3 max-w-[322px] text-center text-xs font-medium text-neutral-600">
        {subtitle}
      </div>
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
};

export default DataEmpty;

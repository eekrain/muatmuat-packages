import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

const PageTitle = ({ className, href = null, children, withBack = true }) => {
  const router = useRouter();

  return (
    <div className={cn("mb-4 flex items-center gap-3", className)}>
      {withBack && (
        <img
          src="/icons/arrow-left24.svg"
          width={24}
          height={24}
          className="cursor-pointer"
          alt="Back"
          onClick={() => {
            if (href) {
              router.push(href);
            } else {
              router.back();
            }
          }}
        />
      )}
      <h1 className="capsize text-xl font-bold">{children}</h1>
    </div>
  );
};

export default PageTitle;

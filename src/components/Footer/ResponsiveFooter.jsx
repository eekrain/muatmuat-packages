import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const ResponsiveFooter = forwardRef(({ className, children }, ref) => {
  return (
    <footer
      ref={ref}
      id="responsive-footer"
      className={cn(
        "fixed bottom-0 left-0 w-screen rounded-t-[10px] bg-neutral-50 px-4 py-3 shadow-responsive-footer",
        className
      )}
    >
      {children}
    </footer>
  );
});

ResponsiveFooter.displayName = "ResponsiveFooter";

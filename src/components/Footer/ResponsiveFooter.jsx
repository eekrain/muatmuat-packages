import { cn } from "@/lib/cn";

export const ResponsiveFooter = ({ className, children }) => {
  return (
    <footer
      id="responsive-footer"
      className={cn(
        "fixed bottom-0 left-0 w-screen rounded-t-[10px] bg-neutral-50 px-4 py-3",
        className
      )}
    >
      {children}
    </footer>
  );
};

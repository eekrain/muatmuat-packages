import { cn } from "@/lib/utils";

export const ButtonMini = ({ className, children, onClick }) => {
  return (
    <button
      type="button"
      className={cn(
        "block w-fit text-xs font-semibold text-primary-700 md:font-medium",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

import { cn } from "@/lib/utils";

export const ButtonTab = ({ active = false, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-7 rounded-full border border-transparent bg-neutral-200 px-3 text-xxs font-semibold text-neutral-900 transition-colors duration-200",
        active && "border-primary-700 bg-white text-primary-700"
      )}
    >
      {children}
    </button>
  );
};

import { cn } from "@/lib/utils";

const BadgeOrderType = ({ type, className }) => {
  const isInstan = type === "Instan";
  return (
    <span
      className={cn(
        "w-fit rounded-[6px] px-2 py-1 text-xs font-semibold",
        isInstan
          ? "bg-success-50 text-success-400"
          : "bg-primary-50 text-primary-700",
        className
      )}
    >
      {type}
    </span>
  );
};

export default BadgeOrderType;

import { cn } from "@/lib/utils";

const OrderSummarySection = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex flex-col border-b border-b-neutral-400 pb-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export default OrderSummarySection;

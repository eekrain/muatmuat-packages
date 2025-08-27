import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

const BadgeOrderType = ({ type, className, ...props }) => {
  const { t } = useTranslation();
  const isInstant = type === "INSTANT";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-semibold",
        isInstant
          ? "bg-success-50 text-success-400"
          : "bg-primary-50 text-primary-700",
        className
      )}
      style={{
        minWidth: "70px",
        height: "24px",
        borderRadius: "6px",
        gap: "4px",
      }}
      {...props}
    >
      {isInstant
        ? t("BadgeOrderType.instant", {}, "Instan")
        : t("BadgeOrderType.scheduled", {}, "Terjadwal")}
    </span>
  );
};

export default BadgeOrderType;

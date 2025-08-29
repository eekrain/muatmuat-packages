import React from "react";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";

import { cn } from "@/lib/utils";

const DashboardSection = ({
  title,
  subtitle = "Lorem ipsum dolor sit amet",
  children,
  className = "",
}) => {
  return (
    <Card
      className={cn(
        "rounded-xl border-none bg-white !p-0 !shadow-[0px_4px_11px_0px_#41414140]",
        className
      )}
    >
      <CardHeader className={"!border-b-0 !pb-1"}>
        <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
        <p className="mt-1 text-xs font-medium text-neutral-600">{subtitle}</p>
      </CardHeader>
      <CardContent className={"!px-6 !py-5"}>{children}</CardContent>
    </Card>
  );
};

export default DashboardSection;

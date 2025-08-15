"use client";

import Link from "next/link";
import React from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";

const TransporterRatingCard = ({ ratingData }) => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full !w-[408px] flex-col items-center justify-center rounded-xl bg-white p-5 text-center shadow-md">
      <div className="flex w-full items-start justify-between gap-1">
        <IconComponent src="/icons/star.svg" width={40} height={40} />
        <Link
          href="/dashboard/real-time/rating-transporter"
          className="text-xs font-medium text-primary-700 hover:text-primary-800"
        >
          {t("csDashboard.ratingCardLink", {}, "Lihat Detail")}
        </Link>
      </div>
      <div className="mt-6 flex w-full items-center justify-between gap-1">
        <p className="mt-2 text-start text-sm font-medium text-neutral-600">
          {t(
            "csDashboard.ratingCardTitle",
            {},
            "Rating Transporter Keseluruhan"
          )}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <IconComponent
            src="/icons/star_icon.svg"
            className="text-secondary-500"
            width={16}
            height={16}
          />
          <p className="text-2xl font-bold">
            {ratingData?.averageRating || "0"}
            <span className="text-lg font-semibold text-neutral-600">/5</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransporterRatingCard;

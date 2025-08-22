"use client";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import LoadingStatic from "@/components/Loading/LoadingStatic";

const LeaderboardCombo = ({ data, isLoading }) => {
  // Renders a loading state
  if (isLoading) {
    return (
      <div className="flex h-[392px] w-[296px] items-center justify-center rounded-lg bg-white">
        <LoadingStatic />
      </div>
    );
  }

  // Renders the empty state card if there's no data or the array is empty
  if (!data || data.length === 0) {
    return (
      <Card className="h-[118.60714721679688px] w-[1232px] !border-none">
        <div className="flex flex-row items-center gap-x-2 border-none !px-6 !py-5">
          <p className="text-lg font-bold text-neutral-900">
            Top 10 Jenis Armada & Top 3 Carrier
          </p>
          <InfoTooltip>
            10 jenis armada dan 3 jenis carrier yang paling banyak dipesan oleh
            Shipper
          </InfoTooltip>
        </div>
        <div className="flex h-[60px] items-center justify-center pb-5">
          <p className="text-base font-semibold text-neutral-600">
            Belum ada data
          </p>
        </div>
      </Card>
    );
  }

  // Renders the full leaderboard card when data is available
  return (
    <Card className="h-[840px] w-[1232px] !border-none">
      <CardHeader className="flex flex-row items-center gap-x-2 border-none !px-6 !py-6">
        <p className="text-lg font-bold text-neutral-900">
          Top 10 Jenis Armada & Top 3 Carrier
        </p>
        <InfoTooltip>
          10 jenis armada dan 3 jenis carrier yang paling banyak dipesan oleh
          Shipper
        </InfoTooltip>
      </CardHeader>
      <CardContent className="flex justify-center !px-6 !py-0">
        <p>test</p>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCombo;

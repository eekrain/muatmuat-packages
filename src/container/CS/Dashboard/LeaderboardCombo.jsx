"use client";

import { useGetTop10FleetTop3Carrier } from "@/services/CS/dashboard/analytics/getTop10FleetTop3Carrier";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import TableLeaderboard from "@/components/Table/TableLeaderboard";

const LeaderboardCombo = () => {
  // 1. Fetch data using the SWR hook
  const { data, isLoading } = useGetTop10FleetTop3Carrier();

  // 2. Renders a loading state
  if (isLoading) {
    return (
      <div className="flex h-[392px] w-full items-center justify-center rounded-lg bg-white lg:h-[840px] lg:w-[1232px]">
        <LoadingStatic />
      </div>
    );
  }

  // 3. Renders the empty state card if the API indicates no data
  if (!data || !data.hasData || data.items.length === 0) {
    return (
      <Card className="min-h-[680px] min-w-[1232px] !border-none">
        <CardHeader className="flex flex-row items-center gap-x-2 border-none !px-6 !py-5">
          <p className="text-lg font-bold text-neutral-900">
            Top 10 Jenis Armada & Top 3 Carrier
          </p>
          <InfoTooltip>
            10 jenis armada dan 3 jenis carrier yang paling banyak dipesan oleh
            Shipper
          </InfoTooltip>
        </CardHeader>
        <div className="flex h-[60px] items-center justify-center pb-5">
          <p className="text-base font-semibold text-neutral-600">
            Belum ada data
          </p>
        </div>
      </Card>
    );
  }

  // 4. Renders the full leaderboard when data is available
  return (
    <Card className="h-full w-full !border-none">
      <CardHeader className="flex flex-row items-center gap-x-2 border-none !px-6 !py-0 !pb-6 !pt-5">
        <p className="text-lg font-bold text-neutral-900">
          Top 10 Jenis Armada & Top 3 Carrier
        </p>
        <InfoTooltip>
          10 jenis armada dan 3 jenis carrier yang paling banyak dipesan oleh
          Shipper
        </InfoTooltip>
      </CardHeader>
      <CardContent className="flex justify-center !px-6 !pb-5 !pt-0">
        {/* Pass the fetched items to the table component */}
        <TableLeaderboard data={data.items} />
      </CardContent>
    </Card>
  );
};

export default LeaderboardCombo;

"use client";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import CardLeaderboard from "@/components/Card/CardLeaderboard";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import LoadingStatic from "@/components/Loading/LoadingStatic";

const LeaderboardTop10 = ({
  title,
  tooltipText,
  variant,
  category,
  data,
  isLoading,
}) => {
  // Renders a loading state
  if (isLoading) {
    return (
      <div className="flex h-[392px] w-[296px] items-center justify-center rounded-lg bg-white">
        <LoadingStatic />
      </div>
    );
  }

  // Renders the empty state card if there's no data or the array is empty
  // Note: The parent component now passes `data.items`, so we check `data` directly.
  if (!data || data.length === 0) {
    return (
      <Card className="h-[126px] w-[400px] !border-none">
        <div className="flex flex-row items-center gap-x-2 border-none !px-6 !py-5">
          <p className="text-lg font-bold text-neutral-900">Top 10 {title}</p>
          <InfoTooltip>{tooltipText}</InfoTooltip>
        </div>
        <div className="flex h-[60px] items-center justify-center pb-5">
          <p className="text-base font-semibold text-neutral-600">
            Belum ada data
          </p>
        </div>
      </Card>
    );
  }

  // Renders the list of items for the leaderboard
  const renderContent = () => {
    switch (category) {
      case "transporters":
        return data.map((item) => (
          <CardLeaderboard
            className="h-[62px] w-full gap-1"
            infoClassname="gap-y-3"
            ratingClassname="hidden"
            key={item.rank}
            variant="default" // Assuming 'default' is the correct variant for transporters
            subVariant="detailedShipment"
            rank={item.rank}
            avatarSrc={item.logo} // Use 'logo' from mock data
            title={item.transporterName} // Use 'transporterName'
            shipmentCount={item.completedOrders} // Use 'completedOrders'
            profit={item.profit} // Use 'profit'
            rating={item.rating}
          />
        ));
      case "loading-areas":
        return data.map((item) => (
          <CardLeaderboard
            key={item.rank}
            variant="alternate" // Assuming 'alternate' variant
            rank={item.rank}
            badgeClassname="left-5 top-5"
            className="h-[62px] w-full gap-x-3"
            infoClassname="gap-y-0"
            subInfoClassname="gap-y-0"
            iconSrc="/icons/marker-lokasi-muat.svg"
            title={`${item.city}`}
            type="Provinsi"
            value={`${item.province}`}
            additionalType="Jumlah Pesanan"
            additionalValue={item.usageCount}
          />
        ));
      case "unloading-areas":
        return data.map((item) => (
          <CardLeaderboard
            key={item.rank}
            variant="alternate" // Assuming 'alternate' variant
            rank={item.rank}
            badgeClassname="left-5 top-5"
            infoClassname="gap-y-0"
            subInfoClassname="gap-y-0"
            className="h-[62px] w-full gap-x-3"
            iconSrc="/icons/marker-lokasi-bongkar.svg"
            title={`${item.city}`}
            type="Provinsi"
            additionalType="Jumlah Pesanan"
            additionalValue={item.usageCount}
            value={`${item.province}`}
          />
        ));
      default:
        return <DataEmpty message="Kategori tidak valid." />;
    }
  };

  // Renders the full leaderboard card when data is available
  return (
    <Card className="h-[840px] w-[400px] !border-none">
      <CardHeader className="flex flex-row items-center gap-x-2 border-none !px-6 !py-6">
        <p className="text-lg font-bold text-neutral-900">Top 10 {title}</p>
        <InfoTooltip>{tooltipText}</InfoTooltip>
      </CardHeader>
      <CardContent className="flex justify-center !px-6 !py-0">
        <div className="flex h-auto w-full flex-col justify-start gap-y-4">
          {renderContent()}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardTop10;

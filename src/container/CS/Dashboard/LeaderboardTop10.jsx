"use client";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import CardLeaderboard from "@/components/Card/CardLeaderboard";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import LoadingStatic from "@/components/Loading/LoadingStatic";

const Leaderboard = ({
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
    // Directly map over the data array
    switch (category) {
      case "transporters":
        return data.map((item) => (
          <CardLeaderboard
            key={item.rank}
            variant={variant}
            rank={item.rank}
            avatarSrc={item.profileImage}
            title={item.driverName}
            shipmentCount={item.completedDeliveries}
            rating={item.rating}
          />
        ));
      case "loading-areas":
        return data.map((item) => (
          <CardLeaderboard
            key={item.rank}
            variant={variant}
            rank={item.rank}
            badgeClassname="left-6 top-5"
            className="gap-x-3"
            infoClassname="gap-y-1"
            iconSrc="/icons/marker-lokasi-muat.svg"
            title={`${item.city}`}
            type="Provinsi"
            value={`${item.province}`}
          />
        ));
      case "unloading-areas":
        return data.map((item) => (
          <CardLeaderboard
            key={item.rank}
            variant={variant}
            rank={item.rank}
            badgeClassname="left-6 top-5"
            infoClassname="gap-y-1"
            className="gap-x-3"
            iconSrc="/icons/marker-lokasi-bongkar.svg"
            title={`${item.city}`}
            type="Provinsi"
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

export default Leaderboard;

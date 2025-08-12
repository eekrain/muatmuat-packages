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
  const renderContent = () => {
    if (isLoading) {
      return <LoadingStatic />;
    }

    if (!data || data.length === 0) {
      return <p>Data tidak ada</p>;
    }

    switch (category) {
      case "drivers":
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
      case "truck-types":
        return data.map((item) => (
          <CardLeaderboard
            key={item.rank}
            variant={variant}
            rank={item.rank}
            iconSrc="/icons/dashboard/truck.svg"
            className="gap-x-3"
            badgeClassname="left-7"
            title={item.truckTypeName}
            type={`Carrier`}
            value={item.carrierTypeName}
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

  return (
    <Card className="h-[392px] w-[296px] !border-none">
      <CardHeader className="flex flex-row items-center gap-x-2 border-none !px-6 !py-6">
        <p className="text-lg font-bold text-neutral-900">Top 5 {title}</p>
        <InfoTooltip>{tooltipText}</InfoTooltip>
      </CardHeader>
      <CardContent className="flex justify-center !px-6 !py-0">
        <div className="flex h-full w-full flex-col justify-center gap-y-4">
          {renderContent()}
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;

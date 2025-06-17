"use client";

import { useEffect } from "react";

import Card from "@/components/Card/Card";
// import SWRHandler from "@/services/useSWRHook";
import { useSewaArmadaStore } from "@/store/forms/sewaArmadaStore";
import { useLoadingAction } from "@/store/loadingStore";

import { BannerCarousel } from "../../../components/BannerCarousel/BannerCarousel";
import { FirstTimer } from "./FirstTimer/FirstTimer";
import {
  AsuransiBarang,
  BadanUsahaPemesan,
  FotoMuatan,
  InformasiMuatan,
  JenisArmada,
  JenisMuatan,
  LayananTambahan,
  LokasiBongkar,
  LokasiMuat,
  NoDeliveryOrder,
  ServiceTypeSelect,
  TipeMuatan,
  WaktuMuat,
} from "./Form";
import DeskripsiMuatan from "./Form/DeskripsiMuatan";
import { SummaryPanel } from "./SummaryPanel/SummaryPanel";
import { WelcomeCard } from "./WelcomeCard/WelcomeCard";

const banners = [
  {
    id: 1,
    imageUrl: "/img/truck-banner.png",
    altText: "Promo Muatrans",
    linkUrl: "/promo/1",
  },
  {
    id: 2,
    imageUrl: "/img/truck-banner2.png",
    altText: "Layanan Pengiriman",
    linkUrl: "/services",
  },
  {
    id: 3,
    imageUrl: "/img/truck-banner3.png",
    altText: "Download Aplikasi",
    linkUrl: "/download",
  },
];

export default function SewaArmadaWeb() {
  const orderType = useSewaArmadaStore((state) => state.orderType);

  const { setIsGlobalLoading } = useLoadingAction();
  useEffect(() => {
    setIsGlobalLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 px-10">
      {/* Carousel Banner */}
      <BannerCarousel banners={banners} />

      {/* Main Content */}
      {orderType === "" ? (
        <FirstTimer />
      ) : (
        <>
          {/* Welcome Section */}
          <WelcomeCard />

          <div className="flex w-full max-w-[1200px] gap-4">
            {/* Form Container */}
            <Card className="flex flex-1 flex-col gap-6 border-none p-8 shadow-md">
              {/* Service Type Selection */}
              <ServiceTypeSelect />

              {/* Form Fields */}
              <div className="flex flex-col gap-6">
                <WaktuMuat />
                <LokasiMuat />
                <LokasiBongkar />
                <TipeMuatan />
                <JenisMuatan />
                <InformasiMuatan />
                <FotoMuatan />
                <DeskripsiMuatan />
                <JenisArmada />
                <AsuransiBarang />
                <LayananTambahan />
                <NoDeliveryOrder />
                <BadanUsahaPemesan />
              </div>
            </Card>

            {/* Summary Panel */}
            <SummaryPanel />
          </div>
        </>
      )}
    </main>
  );
}

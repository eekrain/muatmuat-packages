"use client";

import { useEffect, useMemo } from "react";

import { BannerCarousel } from "@/components/BannerCarousel/BannerCarousel";
import Card from "@/components/Card/Card";
import NeedConfirmationWarning from "@/components/NeedConfirmationWarning/NeedConfirmationWarning";
import { FirstTimer } from "@/container/SewaArmada/Web/FirstTimer/FirstTimer";
import { ModalLogin } from "@/container/SewaArmada/Web/FirstTimer/ModalLogin";
import {
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
} from "@/container/SewaArmada/Web/Form";
import DeskripsiMuatan from "@/container/SewaArmada/Web/Form/DeskripsiMuatan";
import SertifikasiHalal from "@/container/SewaArmada/Web/Form/SertifikasiHalal";
import { SummaryPanel } from "@/container/SewaArmada/Web/SummaryPanel/SummaryPanel";
import { WelcomeCard } from "@/container/SewaArmada/Web/WelcomeCard/WelcomeCard";
import { useSWRHook } from "@/hooks/use-swr";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";
import { useLoadingAction } from "@/store/loadingStore";

export default function SewaArmadaWeb({
  requiringConfirmationCount,
  settingsTime,
  cargoTypes,
  cargoCategories,
  paymentMethods,
}) {
  const orderType = useSewaArmadaStore((state) => state.orderType);

  const { setIsGlobalLoading } = useLoadingAction();
  useEffect(() => {
    setIsGlobalLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: dataBanner } = useSWRHook("v1/orders/banner-ads");
  const banners = useMemo(() => {
    const data = dataBanner?.Data?.banners;
    if (!data) return [];
    return data?.map((item) => ({
      id: item.id,
      imageUrl: item.imageUrl,
      altText: "Banner Muatrans",
      linkUrl: item.link,
    }));
  }, [dataBanner]);

  const { validateForm } = useSewaArmadaActions();
  const testSubmit = () => {
    const isValidForm = validateForm();
    console.log("🚀 ~ file: SewaArmadaWeb.jsx:61 ~ isValidForm:", isValidForm);
  };

  return (
    <>
      <main className="mx-auto flex min-h-full max-w-[1280px] flex-col items-center gap-6 px-10 py-8">
        {/* Carousel Banner */}
        <BannerCarousel banners={banners} />

        {requiringConfirmationCount &&
        requiringConfirmationCount.hasConfirmationRequired > 0 ? (
          <NeedConfirmationWarning
            className="mt-0 w-full"
            breakdown={requiringConfirmationCount.breakdown}
          />
        ) : null}

        {/* Main Content */}
        {orderType === "" ? (
          <FirstTimer />
        ) : (
          <>
            {/* Welcome Section */}
            <WelcomeCard />

            <div className="flex w-full gap-4">
              {/* Form Container */}
              <Card className="flex flex-1 flex-col gap-6 border-none p-8 shadow-md">
                {/* Service Type Selection */}
                <ServiceTypeSelect />

                {/* Form Fields */}
                <div className="flex flex-col gap-6">
                  <WaktuMuat />
                  <LokasiMuat />
                  <LokasiBongkar />
                  <TipeMuatan cargoTypes={cargoTypes} />
                  <JenisMuatan cargoCategories={cargoCategories} />
                  <SertifikasiHalal />
                  <InformasiMuatan />
                  <FotoMuatan />
                  <DeskripsiMuatan />
                  <JenisArmada />
                  {/* Asuransi dihide dulu */}
                  {/* <AsuransiBarang /> */}
                  <LayananTambahan />
                  <NoDeliveryOrder />
                  <BadanUsahaPemesan />
                </div>
              </Card>

              {/* Summary Panel */}
              <SummaryPanel
                settingsTime={settingsTime}
                paymentMethods={paymentMethods}
              />
            </div>
          </>
        )}
      </main>

      <ModalLogin />

      <button onClick={testSubmit}>Test Submit</button>
    </>
  );
}

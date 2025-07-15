"use client";

import { useEffect, useMemo } from "react";

import { BannerCarousel } from "@/components/BannerCarousel/BannerCarousel";
import Card from "@/components/Card/Card";
import NeedConfirmationWarning from "@/components/NeedConfirmationWarning/NeedConfirmationWarning";
import { FirstTimer } from "@/container/SewaArmada/Web/FirstTimer/FirstTimer";
import LoginModal from "@/container/SewaArmada/Web/FirstTimer/LoginModal";
import WaitingSettlementModal from "@/container/SewaArmada/Web/FirstTimer/WaitingSettlementModal";
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
import SelectArmadaModal from "@/container/SewaArmada/Web/Form/JenisArmada/SelectArmadaModal";
import SertifikasiHalal from "@/container/SewaArmada/Web/Form/SertifikasiHalal";
import { SummaryPanel } from "@/container/SewaArmada/Web/SummaryPanel/SummaryPanel";
import { WelcomeCard } from "@/container/SewaArmada/Web/WelcomeCard/WelcomeCard";
import { useSWRHook } from "@/hooks/use-swr";
import { isDev } from "@/lib/constants/is-dev";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";
import { useLoadingAction } from "@/store/loadingStore";

export default function SewaArmadaWeb({
  settlementAlertInfo,
  settingsTime,
  cargoTypes,
  cargoCategories,
  carriers,
  trucks,
  additionalServicesOptions,
  shippingDetails,
  shippingOption,
  calculatedPrice,
  paymentMethods,
  onFetchTrucks,
}) {
  const orderType = useSewaArmadaStore((state) => state.orderType);

  const { data: dataBanner, isLoading } = useSWRHook("v1/orders/banner-ads");
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

  const { setIsGlobalLoading } = useLoadingAction();
  useEffect(() => {
    if (!isLoading) {
      setIsGlobalLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

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

        {settlementAlertInfo.length > 0 ? (
          <NeedConfirmationWarning
            className="mt-0 w-full"
            settlementAlertInfo={settlementAlertInfo}
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
                  <InformasiMuatan onFetchTrucks={onFetchTrucks} />
                  <FotoMuatan />
                  <DeskripsiMuatan />
                  <JenisArmada
                    carriers={carriers}
                    trucks={trucks}
                    onFetchTrucks={onFetchTrucks}
                  />
                  {/* Asuransi dihide dulu */}
                  {/* <AsuransiBarang /> */}
                  <LayananTambahan
                    additionalServicesOptions={additionalServicesOptions}
                    shippingDetails={shippingDetails}
                    shippingOption={shippingOption}
                  />
                  <NoDeliveryOrder />
                  <BadanUsahaPemesan />
                </div>
              </Card>

              {/* Summary Panel */}
              <SummaryPanel
                settingsTime={settingsTime}
                paymentMethods={paymentMethods}
                calculatedPrice={calculatedPrice}
              />
            </div>
          </>
        )}
      </main>

      <LoginModal />
      <WaitingSettlementModal />
      <SelectArmadaModal carrierData={carriers} truckData={trucks} />

      {isDev && <button onClick={testSubmit}>Test Submit</button>}
    </>
  );
}

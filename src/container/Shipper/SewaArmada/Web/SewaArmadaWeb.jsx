"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";

import { AlertMultiline } from "@/components/Alert/AlertMultiline";
import { BannerCarousel } from "@/components/BannerCarousel/BannerCarousel";
import Card from "@/components/Card/Card";
import { FirstTimer } from "@/container/Shipper/SewaArmada/Web/FirstTimer/FirstTimer";
import LoginModal from "@/container/Shipper/SewaArmada/Web/FirstTimer/LoginModal";
import WaitingSettlementModal from "@/container/Shipper/SewaArmada/Web/FirstTimer/WaitingSettlementModal";
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
} from "@/container/Shipper/SewaArmada/Web/Form";
import DeskripsiMuatan from "@/container/Shipper/SewaArmada/Web/Form/DeskripsiMuatan";
import SelectArmadaModal from "@/container/Shipper/SewaArmada/Web/Form/JenisArmada/SelectArmadaModal";
import SertifikasiHalal from "@/container/Shipper/SewaArmada/Web/Form/SertifikasiHalal";
import { CreateOrderSummaryPanel } from "@/container/Shipper/SewaArmada/Web/SummaryPanel/CreateOrderSummaryPanel";
import { WelcomeCard } from "@/container/Shipper/SewaArmada/Web/WelcomeCard/WelcomeCard";
import { useAuth } from "@/hooks/use-auth";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useSWRHook } from "@/hooks/use-swr";
import { useTranslation } from "@/hooks/use-translation";
import { isDev } from "@/lib/constants/is-dev";
import { useGetUserPreferences } from "@/services/Shipper/sewaarmada/userPreferences";
import { useLoadingAction } from "@/store/Shared/loadingStore";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";
import { useWaitingSettlementModalAction } from "@/store/Shipper/forms/waitingSettlementModalStore";

import UpdateOrderSummaryPanel from "./SummaryPanel/UpdateOrderSummaryPanel";

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
  orderStatus,
  onFetchTrucks,
}) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const orderType = useSewaArmadaStore((state) => state.orderType);
  const { setIsOpen } = useWaitingSettlementModalAction();

  const { data: dataBanner, isLoading } = useSWRHook("v1/orders/banner-ads");
  const { data: userPreferences, isLoading: isLoadingUserPreferences } =
    useGetUserPreferences();

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

  const alertItems = useShallowMemo(() => {
    if (!settlementAlertInfo) return [];

    const listPesananUrl = [
      "/daftarpesanan/pesananmenunggupembayaran",
      "/daftarpesanan/pesananmenunggupelunasan",
      "/daftarpesanan/butuhkonfirmasianda",
    ];

    return settlementAlertInfo
      .map((item, key) => {
        if (!item.orderId || item.orderId.length === 0) {
          return null;
        }
        if (key === 1) {
          return {
            label: item.alertText,
            button: (
              <button
                className="text-xs font-medium text-primary-700"
                onClick={() => setIsOpen(true)}
              >
                Lihat Pesanan
              </button>
            ),
          };
        }
        return {
          label: item.alertText,
          link: {
            label: "Lihat Pesanan",
            link:
              item.orderId.length === 1
                ? `/daftarpesanan/detailpesanan/${item.orderId[0]}`
                : listPesananUrl[key],
          },
        };
      })
      .filter(Boolean);
  }, [settlementAlertInfo]);

  const { setIsGlobalLoading } = useLoadingAction();
  useEffect(() => {
    if ((!isLoading, isLoadingUserPreferences)) {
      setIsGlobalLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isLoadingUserPreferences]);

  const { validateForm } = useSewaArmadaActions();
  const testSubmit = () => {
    const isValidForm = validateForm();
    console.log("🚀 ~ file: SewaArmadaWeb.jsx:61 ~ isValidForm:", isValidForm);
  };

  const { isLoggedIn } = useAuth();
  const shouldShowFirstTimer = isLoggedIn
    ? userPreferences?.Data?.shouldShowPopup === true
    : orderType === "";

  return (
    <>
      <main className="mx-auto flex min-h-full max-w-[1280px] flex-col items-center gap-6 px-10 py-8">
        {/* Carousel Banner */}
        <BannerCarousel banners={banners} />

        <AlertMultiline items={alertItems} className="mt-0 w-full" />

        {/* Main Content */}
        {orderType === "" ? (
          <FirstTimer />
        ) : (
          <>
            {/* Welcome Section */}
            <WelcomeCard />

            <div className="relative flex w-full gap-4">
              {/* Form Container */}
              <Card className="flex flex-1 flex-col gap-6 border-none p-8 shadow-md">
                {/* Service Type Selection */}
                <ServiceTypeSelect />

                {/* Form Fields */}
                <div className="flex flex-col gap-6">
                  <WaktuMuat orderStatus={orderStatus} />
                  <LokasiMuat
                    orderStatus={orderStatus}
                    settingsTime={settingsTime}
                  />
                  <LokasiBongkar
                    orderStatus={orderStatus}
                    settingsTime={settingsTime}
                  />
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
              {isEditPage ? (
                <UpdateOrderSummaryPanel
                  settingsTime={settingsTime}
                  paymentMethods={paymentMethods}
                  calculatedPrice={calculatedPrice}
                />
              ) : (
                <CreateOrderSummaryPanel
                  settingsTime={settingsTime}
                  paymentMethods={paymentMethods}
                  calculatedPrice={calculatedPrice}
                />
              )}
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

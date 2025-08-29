"use client";

import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";

import { Alert } from "@/components/Alert/Alert";
import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/BottomSheet/BottomSheetUp";
import Button from "@/components/Button/Button";
import { ButtonMini } from "@/components/Button/ButtonMini";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";

import OrderSummarySection from "@/container/Shipper/SewaArmada/Responsive/InformasiPesanan/OrderSummarySection";

import { useTranslation } from "@/hooks/use-translation";

import { formatDate } from "@/lib/utils/dateFormat";

import { useSewaArmadaStore } from "@/store/Shipper/forms/sewaArmadaStore";

const OrderConfirmationBottomSheet = ({
  isOpen,
  setOpen,
  onValidateInformasiPesanan,
  onCreateOrder,
  selectedCarrier = null,
  selectedTruck = null,
}) => {
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const { t } = useTranslation();
  const { formValues } = useSewaArmadaStore();
  const {
    loadTimeStart,
    loadTimeEnd,
    showRangeOption,
    lokasiMuat,
    lokasiBongkar,
    informasiMuatan,
    cargoPhotos,
    cargoDescription,
    carrierId,
    truckTypeId,
    truckCount,
    distance,
    distanceUnit,
    businessEntity,
    paymentMethodId,
    // deliveryOrder,
  } = formValues;

  const [isLocationBottomsheetOpen, setIsLocationBottomsheetOpen] =
    useState(false);
  const [
    isInformasiMuatanBottomsheetOpen,
    setIsInformasiMuatanBottomsheetOpen,
  ] = useState(false);
  const [locationType, setLocationType] = useState("");

  console.log("MENCARI DATA TRUK :", selectedCarrier, selectedTruck);

  // Get truck display information
  const getTruckDisplayInfo = () => {
    if (selectedCarrier && selectedTruck) {
      return {
        name: `${selectedTruck.name}`,
        carrierName: selectedCarrier.name,
        image:
          selectedTruck.image ||
          selectedCarrier.image ||
          "/img/recommended1.png",
        fullName: `${selectedCarrier.name} - ${selectedTruck.name}`,
      };
    }

    // Fallback to default values if no truck selected
    return {
      name: "Box - Colt Diesel Engkel",
      carrierName: "Default Carrier",
      image: "/img/recommended1.png",
      fullName: "Box - Colt Diesel Engkel",
    };
  };

  const truckInfo = getTruckDisplayInfo();

  return (
    <>
      <BottomSheet open={isOpen} onOpenChange={setOpen}>
        <Button
          variant="muatparts-primary"
          className="h-10 w-full"
          onClick={onValidateInformasiPesanan}
          type="button"
        >
          {t("buttonLanjut")}
        </Button>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetClose />
            <BottomSheetTitle>{t("titlePeriksaPesananAnda")}</BottomSheetTitle>
          </BottomSheetHeader>
          <div className="flex w-full flex-col gap-y-4 overflow-y-auto bg-white px-4">
            {isEditPage ? (
              <Alert
                variant="warning"
                className="flex h-[38px] items-center gap-2.5 bg-warning-100 p-3"
              >
                Perubahan hanya dapat kamu lakukan satu kali. Pastikan informasi
                yang kamu isi sudah benar.
              </Alert>
            ) : null}
            {/* Waktu Muat */}
            <OrderSummarySection className="gap-y-4 font-semibold text-neutral-900">
              <h4 className="text-sm leading-[15.4px]">
                {t("labelWaktuMuat")}
              </h4>
              <span className="text-xs leading-[13.2px]">
                {`${formatDate(loadTimeStart, { padDay: true })}${showRangeOption ? ` s/d ${formatDate(loadTimeEnd, { padDay: true })}` : ""}`}
              </span>
            </OrderSummarySection>
            <OrderSummarySection className="gap-y-4 text-neutral-900">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold leading-[15.4px]">
                  {t("labelRute")}
                </h4>
                <span className="text-xs font-medium leading-[13.2px]">
                  {distance && distanceUnit
                    ? `Estimasi ${distance} ${distanceUnit}`
                    : "Estimasi 178 km"}
                </span>
              </div>
              <TimelineContainer>
                <NewTimelineItem
                  variant="bullet"
                  totalLength={2}
                  index={0}
                  activeIndex={0}
                  title={lokasiMuat?.[0]?.dataLokasi.location.name}
                  buttonDetail={
                    lokasiMuat?.length > 1 ? (
                      <ButtonMini
                        onClick={() => {
                          setLocationType("muat");
                          setIsLocationBottomsheetOpen(true);
                        }}
                      >
                        Lihat Lokasi Muat Lainnya
                      </ButtonMini>
                    ) : null
                  }
                />
                <NewTimelineItem
                  isLast
                  variant="bullet"
                  totalLength={2}
                  index={1}
                  activeIndex={0}
                  title={lokasiBongkar?.[0]?.dataLokasi.location.name}
                  buttonDetail={
                    lokasiBongkar?.length > 1 ? (
                      <ButtonMini
                        onClick={() => {
                          setLocationType("bongkar");
                          setIsLocationBottomsheetOpen(true);
                        }}
                      >
                        Lihat Lokasi Bongkar Lainnya
                      </ButtonMini>
                    ) : null
                  }
                />
              </TimelineContainer>
            </OrderSummarySection>
            {/* Updated Informasi Armada Section */}
            <OrderSummarySection className="gap-y-3 text-neutral-900">
              <h4 className="text-sm font-semibold leading-[15.4px]">
                {t("titleInformasiArmada")}
              </h4>
              <div className="flex items-center gap-x-3">
                <div className="size-[68px] overflow-hidden rounded-xl border border-neutral-400">
                  <ImageComponent
                    className="w-full object-cover"
                    src={truckInfo.image}
                    width={68}
                    height={68}
                    alt={truckInfo.fullName}
                  />
                </div>
                <div className="flex flex-col gap-y-3">
                  <span className="text-sm font-semibold leading-[15.4px]">
                    {truckInfo.fullName}
                  </span>
                  <span className="text-sm font-medium leading-[15.4px]">
                    {`Kebutuhan : ${truckCount} Unit`}
                  </span>
                  {/* Display additional truck info if available */}
                  {selectedTruck?.capacity && (
                    <span className="text-xs font-medium leading-[13.2px] text-neutral-600">
                      Kapasitas: {selectedTruck.capacity}
                    </span>
                  )}
                </div>
              </div>
            </OrderSummarySection>

            <OrderSummarySection className="gap-y-4 text-neutral-900">
              <h4 className="text-sm font-semibold leading-[15.4px]">
                {t("titleInformasiMuatan")}
              </h4>
              <div className="flex flex-col gap-y-3">
                {informasiMuatan.slice(0, 2).map((item, key) => (
                  <div className="flex items-center gap-x-2" key={key}>
                    <IconComponent src="/icons/muatan16.svg" />
                    <span className="text-xs font-medium leading-[13.2px] text-neutral-900">
                      {`${item.namaMuatan.label} `}
                      <span className="text-neutral-600">{`(${item.beratMuatan.berat.toLocaleString("id-ID")} ${item.beratMuatan.unit})`}</span>
                    </span>
                  </div>
                ))}
                {informasiMuatan.length > 2 ? (
                  <div className="ml-6 flex items-center">
                    <BottomSheet
                      open={isInformasiMuatanBottomsheetOpen}
                      onOpenChange={setIsInformasiMuatanBottomsheetOpen}
                    >
                      <BottomSheetTrigger asChild>
                        <button
                          className="text-xs font-semibold leading-[13.2px] text-primary-700"
                          onClick={() =>
                            setIsInformasiMuatanBottomsheetOpen(true)
                          }
                        >
                          {t("buttonLihatMuatanLainnya")}
                        </button>
                      </BottomSheetTrigger>
                      <BottomSheetContent>
                        <BottomSheetHeader>
                          {t("titleInformasiMuatan")}
                        </BottomSheetHeader>
                        <div className="flex flex-col gap-y-4 px-4 py-6">
                          {informasiMuatan.map((item, key) => (
                            <div
                              className="flex items-center gap-x-2"
                              key={key}
                            >
                              <IconComponent src="/icons/muatan16.svg" />
                              <span className="text-xs font-medium leading-[13.2px] text-neutral-900">
                                {`${item.namaMuatan.label} `}
                                <span className="text-neutral-600">{`(${item.beratMuatan.berat.toLocaleString("id-ID")} ${item.beratMuatan.unit})`}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </BottomSheetContent>
                    </BottomSheet>
                  </div>
                ) : null}
              </div>
            </OrderSummarySection>

            <div className="text-xs font-medium leading-[13.2px] text-neutral-900">
              {t("messageSyaratKetentuan")}
              <span className="font-semibold text-primary-700">
                {t("labelSyaratKetentuan")}
              </span>
            </div>
          </div>
          <BottomSheetFooter>
            <Button
              variant="muatparts-primary"
              className="h-10 w-full"
              onClick={onCreateOrder}
              type="button"
            >
              {isEditPage ? "Simpan Perubahan" : t("buttonPesanSekarang")}
            </Button>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheet>

      {/* Bottomsheet Lokasi Muat dan Lokasi Bongkar */}
      <BottomSheet
        open={isLocationBottomsheetOpen}
        onOpenChange={setIsLocationBottomsheetOpen}
      >
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetClose />
            <BottomSheetTitle>
              {locationType === "muat"
                ? t("titleLokasiMuat")
                : t("titleLokasiBongkar")}
            </BottomSheetTitle>
          </BottomSheetHeader>
          <div className="px-4 pb-6">
            <TimelineContainer>
              {(locationType === "muat" ? lokasiMuat : lokasiBongkar).map(
                (item, key) => (
                  <Fragment key={key}>
                    <NewTimelineItem
                      variant={
                        locationType === "muat"
                          ? "number-muat"
                          : "number-bongkar"
                      }
                      totalLength={
                        (locationType === "muat" ? lokasiMuat : lokasiBongkar)
                          .length
                      }
                      index={key}
                      activeIndex={0}
                      title={item?.dataLokasi?.location?.name || ""}
                    />
                  </Fragment>
                )
              )}
            </TimelineContainer>
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </>
  );
};

export default OrderConfirmationBottomSheet;

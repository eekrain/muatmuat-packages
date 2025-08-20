import { Fragment, useState } from "react";

import { isSameDay } from "date-fns";

import Card, { CardContent } from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import MuatBongkarStepperWithModal from "@/components/Stepper/MuatBongkarStepperWithModal";
import { LocationTypeEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { cn } from "@/lib/utils";
import { formatDate, formatTime } from "@/lib/utils/dateFormat";
import { thousandSeparator } from "@/lib/utils/formatters";

import { DetailPicLokasiCard } from "./AdditionalServiceDetail";

const SectionRow = ({ label, children }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
    <p className="w-full text-xs font-medium text-neutral-600 md:w-[178px] md:flex-shrink-0">
      {label}
    </p>
    <div className="flex-1">{children}</div>
  </div>
);

// Component untuk detail item individual
const PICDetailItem = ({ icon, text, className = "" }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <IconComponent src={icon} className="icon-fill-muat-trans-secondary-900" />
    <span className="capsize text-xs font-medium leading-[14.4px] text-neutral-900">
      {text}
    </span>
  </div>
);

// Component untuk kartu lokasi individual
const PICLocationCard = ({ locations = [], title }) => {
  return (
    <div className={"flex w-full flex-row gap-8"}>
      <div className="flex h-8 min-w-[178px] items-center">
        <span className="text-xs font-medium leading-[14.4px] text-neutral-600">
          {title}
        </span>
      </div>

      <Card className="rounded-xl border !border-neutral-400 bg-white !shadow-none">
        <CardContent className="h-full px-4 py-5">
          <div className="flex h-full flex-col gap-y-5">
            {locations.map((location, index) => (
              <Fragment key={index}>
                <div
                  className={cn(
                    "flex flex-col gap-y-3",
                    locations.length - 1 === index
                      ? ""
                      : "border-b border-b-neutral-400 pb-5"
                  )}
                >
                  {/* Header lokasi */}
                  <span className="text-xs font-bold leading-[14.4px] text-neutral-900">
                    {location.type === LocationTypeEnum.PICKUP
                      ? "Lokasi Muat"
                      : "Lokasi Bongkar"}
                  </span>

                  {/* Detail items */}
                  <PICDetailItem
                    icon="/icons/lokasi16.svg"
                    text={location.fullAddress}
                  />
                  <PICDetailItem
                    icon="/icons/topik-amandemen16.svg"
                    text={location.detailAddress}
                  />
                  <PICDetailItem
                    icon="/icons/profile16.svg"
                    text={location.picName}
                  />
                </div>
              </Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RingkasanPesananBody = ({ data }) => {
  const [isMainSectionExpanded, setIsMainSectionExpanded] = useState(false);
  const [isPicSectionExpanded, setIsPicSectionExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsPicSectionExpanded((prevState) => !prevState);
  };
  const isSameLoadDay = isSameDay(
    new Date(data?.loadTimeStart),
    new Date(data?.loadTimeEnd)
  );

  const pickupLocations = data?.orderSummary?.locations?.filter(
    (location) => location.locationType === "PICKUP"
  );
  const dropoffLocations = data?.orderSummary?.locations?.filter(
    (location) => location.locationType === "DROPOFF"
  );

  const totalWeightKg = data?.cargo
    ?.reduce((sum, item) => sum + item.weight * 1000, 0)
    .toLocaleString("id-ID");

  const displayedCargo = data?.orderSummary?.cargo?.cargos
    ?.slice(0, 3)
    .map((item, index) => {
      let convertedWeight = item.weight;
      if (item.weightUnit === "ton") {
        convertedWeight = item.weight * 1000; // Convert tons to kg
      } else if (item.weightUnit === "liter") {
        // Assuming 1 liter of water is approximately 1 kg for simplicity, or adjust based on specific cargo density if available
        // For now, treating liter as kg as per common practice if no density is specified.
        convertedWeight = item.weight; // Treat liter as kg if no specific conversion factor is given
      }
      const formattedWeight = convertedWeight.toLocaleString("id-ID");

      let convertedLength = item?.dimensions?.length || 0;
      let convertedWidth = item?.dimensions?.width || 0;
      let convertedHeight = item?.dimensions?.height || 0;

      if (item?.dimensions?.unit === "m") {
        convertedLength = convertedLength * 100; // Convert meters to cm
        convertedWidth = convertedWidth * 100; // Convert meters to cm
        convertedHeight = convertedHeight * 100; // Convert meters to cm
      }
      const withDimension =
        convertedLength > 0 || convertedWidth > 0 || convertedHeight > 0;

      const formattedLength = convertedLength.toLocaleString("id-ID");
      const formattedWidth = convertedWidth.toLocaleString("id-ID");
      const formattedHeight = convertedHeight.toLocaleString("id-ID");

      return (
        <div key={index} className="flex items-center gap-3">
          <IconComponent
            src="/icons/muatan16.svg"
            className="size-4 text-muat-trans-secondary-900"
            alt="Muatan Icon"
          />
          <p className="text-xs font-semibold text-neutral-900">
            {item.name}
            <span className="text-neutral-600">
              {` (${formattedWeight} kg) ${withDimension ? `(${formattedLength}x${formattedWidth}x${formattedHeight} cm)` : ""}`}
            </span>
          </p>
        </div>
      );
    });

  return (
    <Card className="rounded-xl border-none">
      <CardContent className="flex flex-col gap-y-6 p-6">
        {data?.orderSummary?.isHalalLogistic && (
          <div className="flex h-10 w-full items-center gap-3 rounded-xl bg-[#F7EAFD] px-4">
            <img
              src="/icons/halal.svg"
              width={18}
              height={24}
              alt="Halal Indonesia"
            />
            <span className="mt-0.5 text-center text-xs font-semibold text-[#652672]">
              Memerlukan pengiriman dengan sertifikasi halal logistik
            </span>
          </div>
        )}
        <h1 className="text-lg font-semibold leading-tight text-neutral-900">
          Ringkasan Pesanan
        </h1>

        {/* --- Always Visible Sections --- */}
        <SectionRow label="Informasi Armada">
          <div className="flex items-center gap-4">
            <LightboxProvider
              image={data?.orderSummary?.vehicle?.vehicleImage}
              title={data?.orderSummary?.vehicle?.truckTypeName}
            >
              <LightboxPreview
                image={data?.orderSummary?.vehicle?.vehicleImage}
                alt={data?.orderSummary?.vehicle?.truckTypeName}
                className="size-[68px] rounded-xl object-cover"
              />
            </LightboxProvider>
            <div>
              <h3 className="text-xs font-bold text-neutral-900">
                {data?.orderSummary?.vehicle?.truckTypeName}
              </h3>
              <p className="mt-2 text-xs font-medium text-neutral-900">
                Kebutuhan : {data?.orderSummary?.truckCount} Unit
              </p>
            </div>
          </div>
        </SectionRow>

        <SectionRow label="Waktu Muat">
          <p className="text-xs font-medium text-neutral-900">
            {`${formatDate(data?.orderSummary?.loadTimeStart)} ${
              data?.orderSummary?.loadTimeEnd
                ? ` s/d ${
                    isSameLoadDay
                      ? formatTime(data?.orderSummary?.loadTimeEnd)
                      : formatDate(data?.orderSummary?.loadTimeEnd)
                  }`
                : ""
            }`}
          </p>
        </SectionRow>

        <SectionRow label="Rute Muat & Bongkar">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-neutral-900">
              Estimasi {data?.orderSummary?.estimatedDistance}{" "}
              {data?.orderSummary?.estimatedDistanceUnit}
            </p>
            <MuatBongkarStepperWithModal
              pickupLocations={pickupLocations}
              dropoffLocations={dropoffLocations}
            />
          </div>
        </SectionRow>

        <SectionRow label="Informasi Muatan">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium">
              {`Total Berat : ${thousandSeparator(data?.orderSummary?.cargo?.totalWeight)} ${data?.orderSummary?.cargo?.totalWeightUnit}`}
            </span>
            <div className="flex flex-col gap-2">{displayedCargo}</div>
          </div>
        </SectionRow>

        {/* Wrapper for collapsible content and its button */}
        <div>
          {/* --- Collapsible Section --- */}
          <div
            className={`grid transition-all duration-500 ease-in-out ${
              isMainSectionExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-6">
                <SectionRow label="Deskripsi Muatan">
                  <p className="text-xs font-medium leading-[14.4px] text-neutral-900">
                    {data?.orderSummary?.cargo?.description}
                  </p>
                </SectionRow>

                <SectionRow label="Foto Muatan">
                  <LightboxProvider
                    images={data?.orderSummary?.cargo?.cargoPhotos || []}
                    title="Lampiran/Foto Muatan"
                  >
                    <div className="flex gap-4">
                      {data?.orderSummary?.cargo?.cargoPhotos?.map(
                        (photo, index) => (
                          <LightboxPreview
                            key={index}
                            image={photo}
                            index={index}
                            alt={`Foto Muatan ${index + 1}`}
                            className="size-[124px] rounded-xl object-cover"
                          />
                        )
                      )}
                    </div>
                  </LightboxProvider>
                </SectionRow>

                {data?.orderSummary?.additionalServices.length > 0 ? (
                  <SectionRow label="Layanan Tambahan">
                    <div className="flex flex-col gap-y-2">
                      {data?.orderSummary?.additionalServices.map(
                        (data, key) => (
                          <Fragment key={key}>
                            <div className="flex items-center gap-x-2">
                              <IconComponent
                                className="text-muat-trans-secondary-900"
                                src="/icons/layanan-tambahan16.svg"
                              />
                              <span className="text-xs font-semibold">
                                {data.serviceName}
                              </span>
                            </div>
                            {data?.isDocumentDelivery && (
                              <div className="pl-6">
                                <DetailPicLokasiCard data={data} />
                              </div>
                            )}
                          </Fragment>
                        )
                      )}
                    </div>
                  </SectionRow>
                ) : null}

                <div className="flex w-full items-center justify-between">
                  <h1 className="text-lg font-semibold leading-[21.6px] text-neutral-900">
                    Detail PIC
                  </h1>
                  <button
                    onClick={toggleExpanded}
                    className="flex h-6 w-6 items-center justify-center"
                  >
                    <IconComponent
                      src="/icons/chevron-down24.svg"
                      width={24}
                      height={24}
                      className={`text-neutral-700 transition-transform duration-300 ${isPicSectionExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {/* Main Content Area - FIXED VERSION */}
                <div
                  className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
                    isPicSectionExpanded
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="flex flex-col gap-y-6">
                    {/* Detail PIC Lokasi Muat Section */}
                    <PICLocationCard
                      locations={pickupLocations}
                      title="Detail PIC Lokasi Muat"
                    />

                    {/* Detail PIC Lokasi Bongkar Section */}
                    <PICLocationCard
                      locations={dropoffLocations}
                      title="Detail PIC Lokasi Bongkar"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* --- Collapse Toggle Button --- */}
          <button
            onClick={() => setIsMainSectionExpanded((prevState) => !prevState)}
            className={`flex w-full items-center justify-center gap-2 ${
              isMainSectionExpanded ? "mt-6" : ""
            }`}
          >
            <IconComponent
              src="/icons/chevron-down24.svg"
              alt="Toggle visibility"
              className={`size-5 text-primary-700 transition-transform duration-300 ${
                isMainSectionExpanded ? "rotate-180" : ""
              }`}
            />
            <span className="mt-0.5 text-xs font-semibold text-primary-700">
              {isMainSectionExpanded ? "Sembunyikan" : "Lihat Selengkapnya"}
            </span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RingkasanPesananBody;

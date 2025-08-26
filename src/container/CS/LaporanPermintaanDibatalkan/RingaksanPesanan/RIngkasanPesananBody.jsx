import { Fragment, useState } from "react";

import { format, isSameDay } from "date-fns";
import { id } from "date-fns/locale";

import { TagBubble } from "@/components/Badge/TagBubble";
import Card, { CardContent } from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { Modal } from "@/components/Modal";
import { ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import MuatBongkarStepperWithModal from "@/components/Stepper/MuatBongkarStepperWithModal";
import { LocationTypeEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { cn } from "@/lib/utils";

import { DetailPicLokasiCard } from "../../DetailPesanan/TabRingkasanPesanan/AdditionalServiceDetail";

// Custom function to format load time always on one line
const formatLoadTimeOnOneLine = (loadTimeStart, loadTimeEnd) => {
  if (!loadTimeStart) return "";

  const startDate = new Date(loadTimeStart);
  const endDate = loadTimeEnd ? new Date(loadTimeEnd) : null;

  const formattedStartDate = format(startDate, "dd MMM yyyy", { locale: id });
  const formattedStartTime = `${format(startDate, "HH:mm", { locale: id })} WIB`;

  if (!endDate) {
    return `${formattedStartDate} ${formattedStartTime}`;
  }

  const formattedEndDate = format(endDate, "dd MMM yyyy", { locale: id });
  const formattedEndTime = `${format(endDate, "HH:mm", { locale: id })} WIB`;

  if (isSameDay(startDate, endDate)) {
    return `${formattedStartDate} ${formattedStartTime} s/d ${formattedEndTime}`;
  } else {
    return `${formattedStartDate} ${formattedStartTime} s/d ${formattedEndDate} ${formattedEndTime}`;
  }
};

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
  console.log("locations", locations);
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

const RingkasanPesananBody = ({ dataOrderDetail }) => {
  const [isMainSectionExpanded, setIsMainSectionExpanded] = useState(false);
  const [isPicSectionExpanded, setIsPicSectionExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsPicSectionExpanded((prevState) => !prevState);
  };

  const pickupLocations = dataOrderDetail?.locations?.filter(
    (location) => location.type === "PICKUP"
  );
  const dropoffLocations = dataOrderDetail?.locations?.filter(
    (location) => location.type === "DROPOFF"
  );

  const totalWeightKg = dataOrderDetail?.cargo
    ?.reduce((sum, item) => {
      let weightInKg = item.weight;
      if (item.weightUnit === "ton") {
        weightInKg = item.weight * 1000; // Convert tons to kg
      }
      return sum + weightInKg;
    }, 0)
    .toLocaleString("id-ID");

  const renderCargoItems = (cargoList) =>
    cargoList?.map((item, index) => {
      let convertedWeight = item.weight;
      if (item.weightUnit === "ton") {
        convertedWeight = item.weight * 1000; // Convert tons to kg
      } else if (item.weightUnit === "liter") {
        convertedWeight = item.weight; // Treat liter as kg if no specific conversion factor is given
      }
      const formattedWeight = convertedWeight.toLocaleString("id-ID");

      // Handle null dimensions
      const hasDimensions =
        item.length && item.width && item.height && item.dimensionUnit;
      let dimensionText = "";

      if (hasDimensions) {
        let convertedLength = item.length;
        let convertedWidth = item.width;
        let convertedHeight = item.height;

        if (item.dimensionUnit === "m") {
          convertedLength = item.length * 100; // Convert meters to cm
          convertedWidth = item.width * 100; // Convert meters to cm
          convertedHeight = item.height * 100; // Convert meters to cm
        }

        const formattedLength = convertedLength.toLocaleString("id-ID");
        const formattedWidth = convertedWidth.toLocaleString("id-ID");
        const formattedHeight = convertedHeight.toLocaleString("id-ID");

        dimensionText = ` (${formattedLength}x${formattedWidth}x${formattedHeight} cm)`;
      }

      return (
        <div key={index} className="flex items-center gap-3">
          <IconComponent
            src="/icons/muatan16.svg"
            className="size-4"
            alt="Muatan Icon"
          />
          <p className="text-xs font-medium text-neutral-900">
            {item.name}
            <span className="text-neutral-600">
              {` (${formattedWeight} kg)${dimensionText}`}
            </span>
          </p>
        </div>
      );
    });

  const displayedCargo = renderCargoItems(dataOrderDetail?.cargo?.slice(0, 3));

  return (
    <Card className="rounded-xl border-none">
      <CardContent className="flex flex-col gap-y-6 p-6">
        {dataOrderDetail?.isHalalLogistics && (
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
              image={dataOrderDetail?.vehicle?.vehicleImage}
              title={dataOrderDetail?.vehicle?.truckTypeName}
            >
              <LightboxPreview
                image={dataOrderDetail?.vehicle?.vehicleImage}
                alt={dataOrderDetail?.vehicle?.truckTypeName}
                className="size-[68px] rounded-xl object-cover"
              />
            </LightboxProvider>
            <div>
              <h3 className="text-xs font-bold text-neutral-900">
                {/* Carrier name menyusul */}
                {`${dataOrderDetail?.vehicle?.truckTypeName} - Box`}
              </h3>
              <p className="mt-2 text-xs font-medium text-neutral-900">
                Kebutuhan : {dataOrderDetail?.truckCount} Unit
              </p>
            </div>
          </div>
        </SectionRow>

        <SectionRow label="Waktu Muat">
          <p className="text-xs font-medium text-neutral-900">
            {formatLoadTimeOnOneLine(
              dataOrderDetail?.loadTimeStart,
              dataOrderDetail?.loadTimeEnd
            )}
          </p>
        </SectionRow>

        <SectionRow label="Rute Muat & Bongkar">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-neutral-900">
              Estimasi {dataOrderDetail?.estimatedDistance} km
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
              {`Total Berat : ${totalWeightKg} kg`}
            </span>
            <div className="flex flex-col gap-2">{displayedCargo}</div>

            <Modal closeOnOutsideClick>
              {dataOrderDetail?.cargo?.length >= 4 ? (
                <ModalTrigger>
                  <button className="text-start text-xs font-medium leading-[14.4px] text-primary-700">
                    Lihat Informasi Muatan Lainnya
                  </button>
                </ModalTrigger>
              ) : null}
              <ModalContent>
                <div className="flex flex-col gap-y-3 p-6">
                  {/* Header */}
                  <h2 className="text-center text-base font-bold leading-[19.2px] text-neutral-900">
                    Informasi Muatan
                  </h2>
                  <div className="flex w-[600px] flex-col items-start gap-2 rounded-xl border border-neutral-400 px-4 py-5">
                    {renderCargoItems(dataOrderDetail.cargo)}
                  </div>
                </div>
              </ModalContent>
            </Modal>
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
                    {dataOrderDetail?.cargoDescription}
                  </p>
                </SectionRow>

                <SectionRow label="Foto Muatan">
                  <LightboxProvider
                    images={
                      dataOrderDetail?.photos?.map((photo) => photo) || []
                    }
                    title="Foto Muatan"
                  >
                    <div className="flex gap-4">
                      {dataOrderDetail?.photos?.map((photo, index) => (
                        <LightboxPreview
                          key={index}
                          image={photo}
                          index={index}
                          alt={`Foto Muatan ${index + 1}`}
                          className="size-[124px] rounded-xl object-cover"
                        />
                      ))}
                    </div>
                  </LightboxProvider>
                </SectionRow>

                {dataOrderDetail?.deliveryOrders?.length > 0 ? (
                  <SectionRow label="No. Delivery Order">
                    <div className="flex flex-wrap gap-2">
                      {dataOrderDetail?.deliveryOrders?.map((order, index) => (
                        <TagBubble key={index}>{order}</TagBubble>
                      ))}
                    </div>
                  </SectionRow>
                ) : null}

                {dataOrderDetail?.additionalServices.length > 0 ? (
                  <SectionRow label="Layanan Tambahan">
                    <div className="flex flex-col gap-y-2">
                      {dataOrderDetail?.additionalServices.map(
                        (service, key) => (
                          <Fragment key={key}>
                            <div
                              className="flex items-center gap-x-2"
                              key={key}
                            >
                              <IconComponent
                                className="text-muat-trans-secondary-900"
                                src="/icons/layanan-tambahan16.svg"
                              />
                              <span className="text-xs font-semibold">
                                {service.serviceName}
                              </span>
                            </div>
                            {service?.isDocumentDelivery && (
                              <div className="pl-6">
                                <DetailPicLokasiCard data={service} />
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
            <span className="text-xs font-semibold text-primary-700">
              {isMainSectionExpanded ? "Sembunyikan" : "Lihat Selengkapnya"}
            </span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RingkasanPesananBody;

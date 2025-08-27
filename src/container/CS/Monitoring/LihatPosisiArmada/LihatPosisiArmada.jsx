"use client";

import { ChevronDown } from "lucide-react";

import { BadgeSOSPopover } from "@/components/Badge/BadgeSOSPopover";
import { BadgeStatusPesanan as BadgeStatus } from "@/components/Badge/BadgeStatusPesanan";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import PageTitle from "@/components/PageTitle/PageTitle";
import { DriverTimeline } from "@/components/Timeline/DriverTimeline";

import { useTranslation } from "@/hooks/use-translation";

import { getStatusDriverMetadata } from "@/lib/normalizers/detailpesanan/getStatusDriverMetadata";
import { cn } from "@/lib/utils";

import { AppliedFilterBubbles } from "./AppliedFilterBubbles";
import { Filter } from "./Filter";
import {
  PosisiArmadaProvider,
  usePosisiArmada,
} from "./use-posisi-armada-store";

const MOCK_SOS_POPOVER = {
  licensePlate: "AB 1234 CD",
  truckIcon: null,
  reportTime: "10 Jan 2025 12:00 WIB",
  images: [
    "https://picsum.photos/200?random=1",
    "https://picsum.photos/200?random=2",
    "https://picsum.photos/200?random=3",
    "https://picsum.photos/200?random=4",
  ],
  vehicleType: "Colt Diesel Double - Bak Terbuka",
  driverName: "Ardian Eka Candra",
  driverPhone: "0823-3123-1290",
  lastLocation: "Kab. Batu",
  orderNumber: "MT25A002A",
  pickupLocation: "Kota Surabaya, Kec. Tegalsari",
  dropoffLocation: "Kab. Pasuruan, Kec. Klojen",
};

const InfoItem = ({ icon, value }) => (
  <div className="flex items-center gap-1.5">
    <IconComponent
      src={icon}
      className="h-4 w-4 flex-shrink-0 text-muat-trans-secondary-900"
    />
    <span className="line-clamp-1 text-xs font-medium text-neutral-900">
      {value}
    </span>
  </div>
);

const VehicleTrackingCard = ({
  vehicle,
  index,
  isExpanded,
  onToggle,
  onViewSos,
  t,
}) => {
  const statusDriver = getStatusDriverMetadata({
    orderStatus: vehicle.driverStatus.mainStatus,
    driverStatus: vehicle.driverStatus.subStatus,
    t,
  });

  return (
    <div className="flex flex-col rounded-lg border border-neutral-300 p-4">
      <div className="relative">
        {/* Status Badges */}
        <div className="mb-3 flex items-center gap-2">
          <BadgeStatus
            variant={statusDriver?.variant || "primary"}
            className="inline-flex w-auto flex-shrink-0"
          >
            {statusDriver?.label}
          </BadgeStatus>
          {vehicle.sosStatus?.hasSos && (
            <div className="flex w-full items-center gap-2">
              <div className="h-6 w-10 content-center gap-1 rounded-md bg-error-400 text-center text-xs font-semibold text-error-50">
                {t("BadgeSOSPopover.sosLabel", {}, "SOS")}
              </div>
              <Button
                variant="link"
                className="h-auto flex-1 justify-start p-0 text-xs font-medium"
                onClick={onViewSos}
              >
                {t("BadgeSOSPopover.viewSosButton", {}, "Lihat SOS")}
              </Button>
            </div>
          )}
        </div>

        {/* Vehicle and Driver Info */}
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-neutral-300 bg-white">
            <img
              src={`/img/mock-armada/${["one", "two", "three"][index % 3]}.png`}
              alt={t("LihatPosisiArmada.truckIcon", {}, "Ikon Truk")}
              className="h-6 w-6 object-contain"
            />
          </div>
          <div className="max-w-[376px] flex-1">
            <h3 className="text-sm font-bold text-neutral-900">
              {vehicle.licensePlate}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <InfoItem
                icon="/icons/transporter16.svg"
                value={vehicle.transporterName}
              />
              <div className="size-0.5 rounded-full bg-neutral-600"></div>
              <InfoItem icon="/icons/user16.svg" value={vehicle.driverName} />
            </div>
          </div>
        </div>

        {/* Expand/Collapse Toggle Button */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <button
            onClick={onToggle}
            className="rounded-full p-1 transition-colors hover:bg-neutral-100"
            aria-label={
              isExpanded
                ? t("LihatPosisiArmada.hideDetail", {}, "Sembunyikan detail")
                : t("LihatPosisiArmada.showDetail", {}, "Tampilkan detail")
            }
          >
            <ChevronDown
              className={cn(
                "h-5 w-5 text-neutral-600 transition-transform",
                isExpanded && "rotate-180"
              )}
            />
          </button>
        </div>
      </div>

      {/* Collapsible Details Section */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="mt-4 border-t border-neutral-300">
          {vehicle?.estimatedArrival && (
            <div className="mt-4 bg-neutral-100 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="w-[120px] text-xs font-medium text-neutral-600">
                  {t(
                    "LihatPosisiArmada.estimatedArrival",
                    {},
                    "Estimasi Tiba di Lokasi Bongkar"
                  )}
                </span>
                <span className="text-xs font-semibold">
                  {vehicle.estimatedArrival
                    ? `${new Date(vehicle.estimatedArrival).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" })} WIB`
                    : "-"}
                </span>
              </div>
            </div>
          )}
          <div className="pt-4">
            <h3 className="mb-4 text-xs font-semibold text-neutral-900">
              {t(
                "LihatPosisiArmada.driverStatusDetail",
                {},
                "Detail Status Driver"
              )}
            </h3>
            <DriverTimeline
              dataTimeline={vehicle.timeline}
              onClickProof={(photos) => alert(`Viewing proof: ${photos}`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const LihatPosisiArmadaContent = ({ onClose: _onClose, orderId }) => {
  const { t } = useTranslation();

  // Use the custom hook
  const {
    data,
    isLoading,
    filteredVehicles,
    activeFilters,
    filterOptions,
    inputSearchTerm,
    confirmedSearchTerm,
    expandedVehicles,
    sosPopoverData,
    handleSearchInputChange,
    handleSearchKeyDown,
    handleFilterChange,
    handleRemoveFilter,
    handleClearAllFilters,
    handleToggleVehicle,
    handleViewSos,
    handleCloseSos,
  } = usePosisiArmada(orderId);

  const breadcrumbData = [
    { name: "Monitoring", href: "/monitoring" },
    { name: "Daftar Pesanan Aktif" },
    { name: "Detail Pesanan" },
    { name: "Lihat Posisi Armada" },
  ];

  return (
    <div className="relative flex h-full flex-col rounded-xl bg-white">
      <div className="px-4">
        <BreadCrumb data={breadcrumbData} className="pt-6" />
      </div>
      <PageTitle className="mb-0 mt-4 px-4 text-base">
        {t("LihatPosisiArmada.title", {}, "Lihat Posisi Armada")}
      </PageTitle>

      {/* Search and Filter Inputs */}
      {data?.vehicles && data.vehicles?.length > 1 && (
        <div className="mt-4 flex items-center gap-3 px-4">
          <Input
            icon={{ left: "/icons/search.svg" }}
            appearance={{ iconClassName: "text-neutral-700" }}
            className="w-[332px] font-medium"
            placeholder="Cari No. Polisi / Nama Driver / Transporter"
            value={inputSearchTerm}
            onChange={handleSearchInputChange}
            onKeyDown={handleSearchKeyDown}
            withReset={true}
            disabled={
              filteredVehicles.length === 0 &&
              (activeFilters.transporters.length > 0 ||
                activeFilters.statuses.length > 0)
            }
          />
          <Filter
            onFilterChange={handleFilterChange}
            transporters={filterOptions.transporters}
            statuses={filterOptions.statuses}
            activeFilters={activeFilters}
          />
        </div>
      )}

      <AppliedFilterBubbles
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearAllFilters={handleClearAllFilters}
        filterOptions={filterOptions}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-sm text-neutral-500">
              {t("LihatPosisiArmada.loading", {}, "Loading...")}
            </div>
          </div>
        ) : (
          <div className="h-full space-y-4">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle, index) => (
                <VehicleTrackingCard
                  key={vehicle.vehicleId}
                  vehicle={vehicle}
                  index={index}
                  isExpanded={!!expandedVehicles[vehicle.vehicleId]}
                  onToggle={() => handleToggleVehicle(vehicle.vehicleId)}
                  onViewSos={() => handleViewSos(MOCK_SOS_POPOVER)}
                  t={t}
                />
              ))
            ) : confirmedSearchTerm.trim() ||
              activeFilters.transporters.length > 0 ||
              activeFilters.statuses.length > 0 ? (
              <div className="flex h-full items-center justify-center">
                {confirmedSearchTerm.trim() &&
                activeFilters.transporters.length === 0 &&
                activeFilters.statuses.length === 0 ? (
                  <DataNotFound type="search" title="Keyword Tidak Ditemukan" />
                ) : (
                  <DataNotFound
                    type="search"
                    title={
                      <>
                        Data tidak Ditemukan.
                        <br />
                        Mohon coba hapus beberapa filter
                      </>
                    }
                  />
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* SOS Popover */}
      <div className="absolute bottom-0 right-[-72px]">
        <BadgeSOSPopover data={sosPopoverData} onClose={handleCloseSos} />
      </div>
    </div>
  );
};

const LihatPosisiArmada = (props) => {
  return (
    <PosisiArmadaProvider>
      <LihatPosisiArmadaContent {...props} />
    </PosisiArmadaProvider>
  );
};

export default LihatPosisiArmada;

import { useMemo, useState } from "react";

import { useGetTransporterInactiveFleetDetails } from "@/services/CS/laporan/riwayat-transporter-tidak-aktif/getTransporterInactiveDetail";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import DataTable from "@/components/DataTable/DataTable";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";

import { useTranslation } from "@/hooks/use-translation";

import { TransporterInactiveTypeEnum } from "@/lib/constants/Transporter/laporan/transporterInactive.enum";
import { formatDate } from "@/lib/utils/dateFormat";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";

import DetailTransporterHeader from "./DetailTransporterHeader/DetailTransporterHeader";

function formatDuration(minutes) {
  if (minutes === null || minutes === undefined) return "-";
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = minutes % 60;
  let result = "";
  if (days) result += `${days} hari `;
  if (hours) result += `${hours} jam `;
  if (mins) result += `${mins} menit`;
  return result.trim() || "-";
}

// Column definitions for inactive status
const armadaNonaktifColumns = (t) => [
  {
    key: "licensePlate",
    header: t("DetailTransporter.licensePlate", {}, "No. Polisi"),
    width: "131px",
    sortable: true,
    render: (row) => (
      <span className="text-xs font-medium text-neutral-900">
        {row.licensePlate}
      </span>
    ),
  },
  {
    key: "driverName",
    header: t("DetailTransporter.driverName", {}, "Nama Driver"),
    width: "245px",
    sortable: true,
    render: (row) => (
      <span className="text-wrap text-xs font-medium text-neutral-900">
        {row.driverName}
      </span>
    ),
  },
  {
    key: "tanggalNonaktif",
    header: t("DetailTransporter.tanggalNonaktif", {}, "Tanggal Nonaktif"),
    width: "131px",
    sortable: true,
    render: (row) => (
      <span className="text-xs font-medium text-neutral-900">
        {row.tanggalNonaktif}
      </span>
    ),
  },
  {
    key: "lamaNonaktif",
    header: t(
      "DetailTransporter.lamaArmadaNonaktif",
      {},
      "Lama Armada Nonaktif"
    ),
    width: "131px",
    sortable: true,
    render: (row) => (
      <span className="text-xs font-medium text-neutral-900">
        {row.lamaNonaktif}
      </span>
    ),
  },
];

// Column definitions for idle status
const armadaIdleColumns = (t) => [
  {
    key: "orderNumber",
    header: t("DetailTransporter.orderNumber", {}, "No. Pesanan"),
    sortable: true,
    width: "131px",
    render: (row) => (
      <span className="text-xs font-medium text-neutral-900">
        {row.orderNumber}
      </span>
    ),
  },
  {
    key: "receivingTransporter",
    header: t(
      "DetailTransporter.receivingTransporter",
      {},
      "Transporter Penerima"
    ),
    sortable: true,
    width: "245px",
    render: (row) => (
      <span className="text-wrap text-xs font-medium text-neutral-900">
        {row.receivingTransporter}
      </span>
    ),
  },
  {
    key: "orderCreationTime",
    header: t(
      "DetailTransporter.orderCreationTime",
      {},
      "Waktu Pesanan Diblast"
    ),
    sortable: true,
    width: "131px",
    render: (row) => (
      <span className="text-xs font-medium text-neutral-900">
        {row.orderCreationTime}
      </span>
    ),
  },
  {
    key: "pickupTime",
    header: t("DetailTransporter.pickupTime", {}, "Waktu Pengambilan"),
    sortable: true,
    width: "131px",
    render: (row) => (
      <span className="text-xs font-medium text-neutral-900">
        {row.pickupTime}
      </span>
    ),
  },
];

// Mock data for fleet notes
const fleetNoteData = {
  history: {
    reportedAt: "2025-01-15T10:00:00Z",
    notes:
      "Kondisi armada memang sedang maintenance, sehingga aplikasi driver juga tidak diaktifkan karena belum bisa bertugas juga",
    photos: [
      {
        url: "https://cdn.example.com/photos/maintenance_photo_1.jpg",
      },
      {
        url: "https://cdn.example.com/photos/maintenance_photo_2.jpg",
      },
    ],
  },
};

const DetailTransporter = ({ breadcrumbData }) => {
  const { t } = useTranslation();

  // State for pagination and UI controls
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [showHubungiModal, setShowHubungiModal] = useState(false);

  // To test different statuses, change the status in mockTransporterInactiveFleetDetails:
  // - TransporterInactiveTypeEnum.ADMIN_IDLE_DETECTED = shows idle table (order data)
  // - TransporterInactiveTypeEnum.INACTIVE_FLEET_TOO_MANY = shows inactive table (fleet data)
  const transporterId = "transporter-uuid-2";

  const { data: fleetDetailsData, isLoading: isFleetDetailsLoading } =
    useGetTransporterInactiveFleetDetails({
      transporterId,
      page: currentPage,
      limit: perPage,
    });

  // Extract data from API response
  const transporterInfo = fleetDetailsData?.Data?.transporterInfo || {};
  const pagination = fleetDetailsData?.Data?.pagination || {};

  // Determine status type
  const statusFleet =
    t(transporterInfo?.status) ||
    t(TransporterInactiveTypeEnum.INACTIVE_FLEET_TOO_MANY);
  const isIdleStatus =
    statusFleet === t(TransporterInactiveTypeEnum.ADMIN_IDLE_DETECTED);

  // Initialize sort config based on status
  const [sortConfig, setSortConfig] = useState({
    sort: isIdleStatus ? "orderNumber" : "licensePlate",
    order: "asc",
  });

  // Create transporter object for UI
  const transporter = {
    name: transporterInfo.name || "-",
    logoUrl: "/icons/company-placeholder.svg",
  };

  // Process and filter data based on status
  const processedData = useMemo(() => {
    const fleets = fleetDetailsData?.Data?.inactiveFleets || [];

    let mappedData = fleets.map((item) => {
      if (isIdleStatus) {
        // For idle status, simulate order data using existing fleet fields
        return {
          orderNumber: `ORD-${item.licensePlate?.replace(/\s/g, "")}` || "-",
          receivingTransporter: item.driverName || "-",
          orderCreationTime: formatDate(item.inactiveDate),
          pickupTime: formatDate(item.lastActiveDate),
          _rawOrderCreationTime: item.inactiveDate,
          _rawPickupTime: item.lastActiveDate,
        };
      } else {
        // Data mapping for inactive status (fleets)
        return {
          licensePlate: item.licensePlate,
          driverName: item.driverName,
          tanggalNonaktif: formatDate(item.inactiveDate),
          lamaNonaktif: formatDuration(item.inactiveDuration),
          _rawTanggalNonaktif: item.inactiveDate,
          _rawLamaNonaktif: item.inactiveDuration,
        };
      }
    });

    // Apply search filter
    if (searchQuery.trim().length > 2) {
      mappedData = mappedData.filter((item) => {
        const query = searchQuery.toLowerCase();
        if (isIdleStatus) {
          return (
            item.orderNumber?.toLowerCase().includes(query) ||
            item.receivingTransporter?.toLowerCase().includes(query)
          );
        } else {
          return (
            item.licensePlate?.toLowerCase().includes(query) ||
            item.driverName?.toLowerCase().includes(query)
          );
        }
      });
    }

    // Apply sorting
    if (sortConfig?.sort) {
      mappedData = [...mappedData].sort((a, b) => {
        let aValue = a[sortConfig.sort];
        let bValue = b[sortConfig.sort];

        // Handle raw values for date sorting
        if (isIdleStatus) {
          if (sortConfig.sort === "orderCreationTime") {
            aValue = a._rawOrderCreationTime;
            bValue = b._rawOrderCreationTime;
          } else if (sortConfig.sort === "pickupTime") {
            aValue = a._rawPickupTime;
            bValue = b._rawPickupTime;
          }
        } else {
          if (sortConfig.sort === "tanggalNonaktif") {
            aValue = a._rawTanggalNonaktif;
            bValue = b._rawTanggalNonaktif;
          } else if (sortConfig.sort === "lamaNonaktif") {
            aValue = a._rawLamaNonaktif;
            bValue = b._rawLamaNonaktif;
          }
        }

        // Handle null/undefined values
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        // Date comparison
        if (typeof aValue === "string" && typeof bValue === "string") {
          if (
            sortConfig.sort === "tanggalNonaktif" ||
            sortConfig.sort === "orderCreationTime" ||
            sortConfig.sort === "pickupTime"
          ) {
            return sortConfig.order === "asc"
              ? new Date(aValue) - new Date(bValue)
              : new Date(bValue) - new Date(aValue);
          }
          // String comparison
          return sortConfig.order === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Number comparison
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.order === "asc" ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    }

    return mappedData;
  }, [
    fleetDetailsData?.Data?.inactiveFleets,
    isIdleStatus,
    searchQuery,
    sortConfig,
  ]); // Pagination data
  const totalPages = pagination.totalPages || 1;
  const totalItems = pagination.totalItems || processedData.length;

  // Event handlers
  const handleSort = (sort, order) => {
    setSortConfig({ sort, order });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <BreadCrumb data={breadcrumbData} maxWidth={111} />
      <div className="my-4 flex gap-x-6">
        <div className="w-[340px] min-w-[320px]">
          <DetailTransporterHeader transporter={transporter} />
        </div>
      </div>
      <div className="flex w-full items-start gap-4">
        {/* Left Column: Admin Info Card */}
        <div className="flex flex-col gap-4">
          <div className="flex w-[340px] flex-col gap-5 rounded-xl bg-neutral-50 p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <img
                src={transporter.logoUrl}
                alt={transporter.name}
                className="h-14 w-14 flex-shrink-0 rounded-full border border-neutral-400 bg-white object-cover"
              />
              <div className="flex flex-col justify-center space-y-2">
                <p className="text-xs font-bold text-neutral-900">
                  {transporter.name}
                </p>
                <p className="text-xs font-medium text-error-400">
                  {`${t(transporterInfo.status)} (5/7${isIdleStatus ? " Order" : ""})`}
                </p>
              </div>
            </div>
            {/* <p className="text-xs font-medium text-neutral-600">
              {fleetNoteData?.Data?..content || "-"}
            </p> */}
            <div className="flex justify-between gap-3">
              <Button
                variant="muattrans-primary-secondary"
                className="h-8 w-full rounded-[24px] px-4 text-[14px] font-semibold"
                onClick={() => setShowHubungiModal(true)}
              >
                {t("DetailTransporter.contactButton", {}, "Hubungi")}
              </Button>
            </div>
          </div>
          <div className="flex w-[340px] flex-col rounded-xl bg-neutral-50 p-6 shadow-lg">
            <div className="mb-4 flex items-center">
              <p className="text-xs font-semibold text-neutral-900">
                {t(
                  "DetailTransporter.resolutionDetailTitle",
                  {},
                  "Detail Penyelesaian"
                )}
              </p>
            </div>
            <div className="mb-3 flex flex-col gap-2">
              <p className="text-xs font-medium text-neutral-600">
                {t(
                  "DetailTransporter.resolvedDateLabel",
                  {},
                  "Tanggal Diselesaikan"
                )}
              </p>
              <p className="text-xs font-medium text-neutral-900">
                {fleetNoteData?.history?.reportedAt
                  ? new Date(
                      fleetNoteData.history.reportedAt
                    ).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </p>
            </div>
            <div className="mb-3 flex flex-col gap-2">
              <p className="text-xs font-medium text-neutral-600">
                {t("DetailTransporter.noteLabel", {}, "Catatan")}
              </p>
              <p className="text-xs font-medium text-neutral-900">
                {fleetNoteData?.history?.notes || "-"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-neutral-600">
                {t(
                  "DetailTransporter.supportingPhotosLabel",
                  {},
                  "Foto Pendukung"
                )}
              </p>
              <LightboxProvider
                images={
                  fleetNoteData?.history?.photos?.map((photo) => photo.url) ||
                  []
                }
                title={t(
                  "DetailTransporter.photoTitle",
                  {},
                  "Foto Penyelesaian"
                )}
              >
                <div className="flex flex-row gap-2">
                  {fleetNoteData?.history?.photos?.length > 0 ? (
                    fleetNoteData.history.photos.map((photo, idx) => (
                      <LightboxPreview
                        key={idx}
                        image={photo.url}
                        index={idx}
                        className="h-10 w-10 flex-shrink-0 rounded-[4px] border object-cover"
                        alt={t(
                          "DetailTransporter.photoAlt",
                          { idx: idx + 1 },
                          `Foto Penyelesaian ${idx + 1}`
                        )}
                      />
                    ))
                  ) : (
                    <span className="text-xs text-neutral-500">
                      {t("DetailTransporter.noPhoto", {}, "Tidak ada foto")}
                    </span>
                  )}
                </div>
              </LightboxProvider>
            </div>
          </div>
        </div>

        {/* Modals */}
        <HubungiModal
          isOpen={showHubungiModal}
          onClose={() => setShowHubungiModal(false)}
          transporterData={null} // TODO: pass actual transporter data
        />

        {/* Right Column: DataTable */}
        <div className="w-full flex-grow">
          {/* {fleetNoteData?..status === "active" && (
            <div className="flex w-full rounded-xl bg-neutral-50 px-6 pt-5">
              <div className="flex w-full justify-center rounded-md bg-error-50 py-2">
                <p className="text-xs font-semibold text-error-400">
                  Armada nonaktif bertambah {totalIncrease} dari follow-up
                  terakhir.
                  <span className="cursor-pointer font-medium text-primary-700">
                    Lihat Catatan Terakhir
                  </span>
                </p>
              </div>
            </div>
          )} */}

          <DataTable
            data={processedData}
            columns={
              isIdleStatus ? armadaIdleColumns(t) : armadaNonaktifColumns(t)
            }
            searchPlaceholder={
              isIdleStatus
                ? t(
                    "DetailTransporter.searchOrderPlaceholder",
                    {},
                    "Cari No. Pesanan / Nama Transporter"
                  )
                : t(
                    "DetailTransporter.searchFleetPlaceholder",
                    {},
                    "Cari Nama Driver / No. Polisi"
                  )
            }
            totalCountLabel={
              isIdleStatus
                ? t("DetailTransporter.totalOrderLabel", {}, "Order Terlewat")
                : t("DetailTransporter.totalFleetLabel", {}, "Armada Nonaktif")
            }
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            perPage={perPage}
            onPageChange={setCurrentPage}
            onPerPageChange={setPerPage}
            onSearch={handleSearch}
            showFilter={false}
            showPagination={true}
            showTotalCount={true}
            onSort={handleSort}
            loading={isFleetDetailsLoading}
            className="w-full flex-grow rounded-xl border-0 bg-neutral-50 text-xs font-semibold text-neutral-900 shadow-lg"
            paginationCounter={true}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailTransporter;

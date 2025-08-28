"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { useGetInactiveTransporter } from "@/services/CS/monitoring/permintaan-angkut/getInactiveTransporter";
import { useGetLatestFleetNote } from "@/services/CS/monitoring/permintaan-angkut/getLatestFleetNote";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import DataTable from "@/components/DataTable/DataTable";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";

import DetailTransporterHeader from "@/container/CS/DetailTransporter/DetailTransporterHeader/DetailTransporterHeader";
import ModalCatatanPenyelesaian from "@/container/CS/DetailTransporter/DetailTransporterHeader/ModalCatatanPenyelesaian";

import { useTranslation } from "@/hooks/use-translation";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";

// Helper to format date and duration
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return `${date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  })} WIB`;
}

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

const DetailTransporter = ({ breadcrumbData }) => {
  const { t } = useTranslation();

  // Column definitions for the DataTable
  const armadaNonaktifColumns = [
    {
      key: "licensePlate",
      header: t("DetailTransporter.tableHeaderLicensePlate", {}, "No. Polisi"),
      sortable: true,
      render: (row) => (
        <span className="text-xs font-medium text-neutral-900">
          {row.licensePlate}
        </span>
      ),
    },
    {
      key: "driverName",
      header: t("DetailTransporter.tableHeaderDriverName", {}, "Nama Driver"),
      sortable: true,
      render: (row) => (
        <span className="text-wrap text-xs font-medium text-neutral-900">
          {row.driverName}
        </span>
      ),
    },
    {
      key: "tanggalNonaktif",
      header: t(
        "DetailTransporter.tableHeaderInactiveDate",
        {},
        "Tanggal Nonaktif"
      ),
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
        "DetailTransporter.tableHeaderInactiveDuration",
        {},
        "Lama Armada Nonaktif"
      ),
      sortable: true,
      render: (row) => (
        <span className="text-xs font-medium text-neutral-900">
          {row.lamaNonaktif}
        </span>
      ),
    },
  ];

  const idleOrderColumns = [
    {
      key: "orderCode",
      header: t("DetailTransporter.tableHeaderOrderNumber", {}, "No. Pesanan"),
      sortable: true,
      render: (row) => (
        <span className="text-xs font-medium text-neutral-900">
          {row.orderCode}
        </span>
      ),
    },
    {
      key: "transporterReceive",
      header: t(
        "DetailTransporter.tableHeaderReceivingTransporter",
        {},
        "Transporter Penerima"
      ),
      sortable: true,
      render: (row) => (
        <span className="text-wrap text-xs font-medium text-neutral-900">
          {row.transporterReceive}
        </span>
      ),
    },
    {
      key: "orderBlastAt",
      header: t(
        "DetailTransporter.tableHeaderOrderBlastTime",
        {},
        "Waktu Pesanan Diblast"
      ),
      sortable: true,
      render: (row) => (
        <span className="text-xs font-medium text-neutral-900">
          {row.orderBlastAt}
        </span>
      ),
    },
    {
      key: "orderTakenAt",
      header: t(
        "DetailTransporter.tableHeaderPickupTime",
        {},
        "Waktu Pengambilan"
      ),
      sortable: true,
      render: (row) => (
        <span className="text-xs font-medium text-neutral-900">
          {row.orderTakenAt}
        </span>
      ),
    },
  ];

  const [searchValue, setSearchValue] = useState("");
  // State for pagination (should be declared first)
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // State for Modals
  const [showHubungiModal, setShowHubungiModal] = useState(false);
  const [showCatatanModal, setShowCatatanModal] = useState(false);

  // Fetch alert summary for total
  const { data: alertData } = useGetInactiveTransporter();
  const total = alertData?.alertSummary?.total ?? 0;
  const current = alertData?.alertSummary?.current ?? 0;

  const [sortConfig, setSortConfig] = useState({
    sort: "licensePlate",
    order: "asc",
  });

  const params = useParams();
  const transporterId =
    params?.transporterId ??
    params?.id ??
    Object.values(params || {})[0] ??
    "transporter-uuid-2";

  const { data: fleetNoteData, isLoading: isFleetNoteLoading } =
    useGetLatestFleetNote(transporterId, {
      page: currentPage,
      limit: perPage,
      search: searchValue,
      sort: sortConfig.sort,
      order: sortConfig.order,
    });

  // Ambil nama transporter dari data - updated path for new API structure
  const transporterName =
    fleetNoteData?.latestNote?.relatedEntities?.transporterName || "-";
  const transporter = {
    name: transporterName,
    logoUrl: "/icons/company-placeholder.svg",
  };

  // Map data for DataTable - remove client-side sorting since it's handled by API
  let armadaNonaktifData = (fleetNoteData?.details || []).map((item) => ({
    licensePlate: item.licensePlate,
    driverName: item.driverName,
    tanggalNonaktif: formatDate(item.inactiveDate),
    // Handle both duration formats: number (minutes) or string (e.g. "3 hari")
    lamaNonaktif:
      typeof item.inactiveDuration === "number"
        ? formatDuration(item.inactiveDuration)
        : item.inactiveDuration || "-",
    _rawTanggalNonaktif: item.inactiveDate,
    _rawLamaNonaktif:
      typeof item.inactiveDuration === "number" ? item.inactiveDuration : 0,
  }));

  let idleOrderData = (fleetNoteData?.details || []).map((item) => ({
    orderCode: item.orderCode,
    transporterReceive: item.transporterReceive ? "Ya" : "Tidak",
    orderBlastAt: item.orderBlastAt ? formatDate(item.orderBlastAt) : "-",
    orderTakenAt: item.orderTakenAt ? formatDate(item.orderTakenAt) : "-",
    _rawOrderBlastAt: item.orderBlastAt || null,
    _rawOrderTakenAt: item.orderTakenAt || null,
  }));

  // Sorting
  if (sortConfig?.sort) {
    if (
      fleetNoteData?.latestNote?.relatedEntities?.inactivityStatus ===
      "ARMADA_INACTIVE"
    ) {
      armadaNonaktifData = [...armadaNonaktifData].sort((a, b) => {
        let aValue = a[sortConfig.sort];
        let bValue = b[sortConfig.sort];
        // Custom sort for tanggalNonaktif and lamaNonaktif
        if (sortConfig.sort === "tanggalNonaktif") {
          aValue = a._rawTanggalNonaktif;
          bValue = b._rawTanggalNonaktif;
        } else if (sortConfig.sort === "lamaNonaktif") {
          aValue = a._rawLamaNonaktif;
          bValue = b._rawLamaNonaktif;
        }
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        if (typeof aValue === "string" && typeof bValue === "string") {
          if (sortConfig.sort === "tanggalNonaktif") {
            // Compare date string
            return sortConfig.order === "asc"
              ? new Date(aValue) - new Date(bValue)
              : new Date(bValue) - new Date(aValue);
          }
          return sortConfig.order === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        // Number sort (lamaNonaktif)
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.order === "asc" ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
    } else if (
      fleetNoteData?.latestNote?.relatedEntities?.inactivityStatus ===
      "TRANSPORTER_IDLE"
    ) {
      idleOrderData = [...idleOrderData].sort((a, b) => {
        let aValue = a[sortConfig.sort];
        let bValue = b[sortConfig.sort];
        // Custom sort for orderBlastAt and orderTakenAt using raw values
        if (sortConfig.sort === "orderBlastAt") {
          aValue = a._rawOrderBlastAt ? new Date(a._rawOrderBlastAt) : 0;
          bValue = b._rawOrderBlastAt ? new Date(b._rawOrderBlastAt) : 0;
          return sortConfig.order === "asc" ? aValue - bValue : bValue - aValue;
        }
        if (sortConfig.sort === "orderTakenAt") {
          aValue = a._rawOrderTakenAt ? new Date(a._rawOrderTakenAt) : 0;
          bValue = b._rawOrderTakenAt ? new Date(b._rawOrderTakenAt) : 0;
          return sortConfig.order === "asc" ? aValue - bValue : bValue - aValue;
        }
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.order === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }
  }

  // Search filter
  const filteredArmadaNonaktifData = searchValue
    ? armadaNonaktifData.filter(
        (item) =>
          item.licensePlate
            ?.toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          item.driverName?.toLowerCase().includes(searchValue.toLowerCase())
      )
    : armadaNonaktifData;

  const filteredIdleOrderData = searchValue
    ? idleOrderData.filter(
        (item) =>
          item.orderCode?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.transporterReceive
            ?.toLowerCase()
            .includes(searchValue.toLowerCase())
      )
    : idleOrderData;

  // Use pagination from API response - updated for new structure
  const pagination = fleetNoteData?.pagination || {};
  const totalPages = pagination.totalPages || 1;
  const totalItems = pagination.totalItems || armadaNonaktifData.length;

  const handleSort = (sort, order) => {
    setSortConfig({ sort, order });
  };

  // Handle search for DataTable
  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex w-full justify-center">
      <div className="w-[1280px] p-6">
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
                <div className="flex flex-col justify-center">
                  <p className="text-xs font-bold text-neutral-900">
                    {transporter.name}
                  </p>
                  {fleetNoteData?.latestNote?.relatedEntities
                    ?.inactivityStatus === "ARMADA_INACTIVE" && (
                    <p className="text-xs font-medium text-error-400">
                      {t(
                        "DetailTransporter.messageErrorTooManyInactiveFleets",
                        {
                          current:
                            fleetNoteData?.latestNote?.relatedEntities
                              ?.current ?? "-",
                          total:
                            fleetNoteData?.latestNote?.relatedEntities?.total ??
                            "-",
                        },
                        "Armada Nonaktif Terlalu Banyak ({current}/{total})"
                      )}
                    </p>
                  )}
                  {fleetNoteData?.latestNote?.relatedEntities
                    ?.inactivityStatus === "TRANSPORTER_IDLE" && (
                    <p className="text-xs font-medium text-error-400">
                      {t(
                        "DetailTransporter.messageErrorAdminFrequentlyIdle",
                        {
                          current:
                            fleetNoteData?.latestNote?.relatedEntities
                              ?.current ?? "-",
                          total:
                            fleetNoteData?.latestNote?.relatedEntities?.total ??
                            "-",
                        },
                        "Admin Terdeteksi Sering Idle ({current}/{total} Order)"
                      )}
                    </p>
                  )}
                </div>
              </div>
              {fleetNoteData?.latestNote?.status === "active" && (
                <p className="text-xs font-medium text-neutral-600">
                  {fleetNoteData?.latestNote?.content || "-"}
                </p>
              )}

              <div className="flex justify-between gap-3">
                <Button
                  variant="muattrans-primary-secondary"
                  className="h-8 w-full rounded-[24px] px-4 text-[14px] font-semibold"
                  onClick={() => setShowHubungiModal(true)}
                >
                  {t("DetailTransporter.buttonContact", {}, "Hubungi")}
                </Button>
                {fleetNoteData?.latestNote?.status === "active" && (
                  <Button
                    variant="muattrans-warning"
                    className="h-8 w-full rounded-[24px] px-4 text-[14px] font-semibold text-[#461B02]"
                    onClick={() => setShowCatatanModal(true)}
                  >
                    {t("DetailTransporter.buttonComplete", {}, "Selesaikan")}
                  </Button>
                )}
              </div>
            </div>
            {fleetNoteData?.latestNote?.status === "completed" && (
              <div className="flex w-[340px] flex-col rounded-xl bg-neutral-50 p-6 shadow-lg">
                <div className="mb-6 flex items-center">
                  <p className="text-xs font-semibold text-neutral-900">
                    {t(
                      "DetailTransporter.titleCompletionDetails",
                      {},
                      "Detail Penyelesaian"
                    )}
                  </p>
                </div>
                <div className="mb-3 flex flex-col gap-2">
                  <p className="text-xs font-medium text-neutral-600">
                    {t(
                      "DetailTransporter.labelCompletionDate",
                      {},
                      "Tanggal Diselesaikan"
                    )}
                  </p>
                  <p className="text-xs font-medium text-neutral-900">
                    {fleetNoteData?.latestNote?.relatedEntities?.reportedAt
                      ? new Date(
                          fleetNoteData.latestNote.relatedEntities.reportedAt
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
                    {t("DetailTransporter.labelNotes", {}, "Catatan")}
                  </p>
                  <p className="text-xs font-medium text-neutral-900">
                    {fleetNoteData?.latestNote?.relatedEntities?.noteResolve ||
                      "-"}
                  </p>
                </div>
                <div className="mb-3 flex flex-col gap-2">
                  <p className="text-xs font-medium text-neutral-600">
                    {t(
                      "DetailTransporter.labelSupportingPhotos",
                      {},
                      "Foto Pendukung"
                    )}
                  </p>
                  <LightboxProvider
                    images={fleetNoteData?.latestNote?.attachments || []}
                    title={t(
                      "DetailTransporter.lightboxTitleSupportingPhotos",
                      {},
                      "Foto Pendukung"
                    )}
                  >
                    <div className="flex flex-row gap-2">
                      {fleetNoteData?.latestNote?.attachments?.length > 0 ? (
                        fleetNoteData.latestNote.attachments.map(
                          (photoUrl, idx) => (
                            <LightboxPreview
                              key={idx}
                              image={photoUrl}
                              index={idx}
                              className="h-10 w-10 flex-shrink-0 rounded-[4px] border object-cover"
                              alt={t(
                                "DetailTransporter.altTextSupportingPhoto",
                                { number: idx + 1 },
                                "Foto Pendukung {number}"
                              )}
                            />
                          )
                        )
                      ) : (
                        <span className="text-xs text-neutral-500">
                          {t(
                            "DetailTransporter.textNoPhotos",
                            {},
                            "Tidak ada foto"
                          )}
                        </span>
                      )}
                    </div>
                  </LightboxProvider>
                </div>
              </div>
            )}
          </div>

          {/* Modals */}
          <HubungiModal
            isOpen={showHubungiModal}
            onClose={() => setShowHubungiModal(false)}
            transporterData={null} // TODO: pass actual transporter data
          />
          <ModalCatatanPenyelesaian
            isOpen={showCatatanModal}
            onClose={() => setShowCatatanModal(false)}
            onConfirm={() => setShowCatatanModal(false)}
            fleetNoteData={fleetNoteData}
          />

          {/* Right Column: DataTable */}
          <div className="w-full flex-grow">
            {fleetNoteData?.latestNote?.status === "active" && (
              <div className="relative top-2 flex w-full rounded-t-xl bg-neutral-50 px-6 pb-3 pt-5">
                <div className="flex w-full justify-center rounded-md bg-error-50 py-2">
                  {fleetNoteData?.latestNote?.relatedEntities
                    ?.inactivityStatus === "ARMADA_INACTIVE" && (
                    <p className="text-xs font-semibold text-error-400">
                      {t(
                        "DetailTransporter.alertInactiveFleetIncreased",
                        { total },
                        "Armada nonaktif bertambah {total} dari follow-up terakhir."
                      )}
                      <span className="ml-1 cursor-pointer font-medium text-primary-700">
                        {t(
                          "DetailTransporter.linkViewLastNote",
                          {},
                          "Lihat Catatan Terakhir"
                        )}
                      </span>
                    </p>
                  )}
                  {fleetNoteData?.latestNote?.relatedEntities
                    ?.inactivityStatus === "TRANSPORTER_IDLE" && (
                    <p className="text-xs font-semibold text-error-400">
                      {t(
                        "DetailTransporter.alertStillMissingOrders",
                        { name: transporterName, current, total },
                        "{name} masih melewatkan {current} dari {total} pesanan dari follow-up terakhir."
                      )}
                      <span className="ml-1 cursor-pointer font-medium text-primary-700">
                        {t(
                          "DetailTransporter.linkViewLastNote",
                          {},
                          "Lihat Catatan Terakhir"
                        )}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {fleetNoteData?.latestNote?.relatedEntities?.inactivityStatus ===
              "ARMADA_INACTIVE" && (
              <DataTable
                data={filteredArmadaNonaktifData}
                columns={armadaNonaktifColumns}
                searchPlaceholder={t(
                  "DetailTransporter.searchPlaceholderDriverOrPlate",
                  {},
                  "Cari Nama Driver / No. Polisi"
                )}
                totalCountLabel={t(
                  "DetailTransporter.totalCountLabelInactiveFleet",
                  {},
                  "Armada Nonaktif"
                )}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                perPage={perPage}
                onPageChange={setCurrentPage}
                onPerPageChange={setPerPage}
                showFilter={false}
                showPagination={true}
                showTotalCount={true}
                onSort={handleSort}
                onSearch={handleSearch}
                loading={isFleetNoteLoading}
                className="w-full flex-grow rounded-xl border-0 bg-neutral-50 text-xs font-semibold text-neutral-900 shadow-lg"
              />
            )}
            {fleetNoteData?.latestNote?.relatedEntities?.inactivityStatus ===
              "TRANSPORTER_IDLE" && (
              <DataTable
                data={filteredIdleOrderData}
                columns={idleOrderColumns}
                searchPlaceholder={t(
                  "DetailTransporter.searchPlaceholderOrderOrTransporter",
                  {},
                  "Cari No. Pesanan / Nama Transporter"
                )}
                totalCountLabel={t(
                  "DetailTransporter.totalCountLabelMissedOrders",
                  {},
                  "Order Terlewat"
                )}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredIdleOrderData.length}
                perPage={perPage}
                onPageChange={setCurrentPage}
                onPerPageChange={setPerPage}
                showFilter={false}
                showPagination={true}
                showTotalCount={true}
                onSort={handleSort}
                onSearch={handleSearch}
                loading={isFleetNoteLoading}
                className="w-full flex-grow rounded-xl border-0 bg-neutral-50 text-xs font-semibold text-neutral-900 shadow-lg"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTransporter;

import { useEffect, useState } from "react";

import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { useGetCompletedIssueList } from "@/services/CS/monitoring/urgent-issue/getCompletedIssue";
import { useGetProcessingIssueList } from "@/services/CS/monitoring/urgent-issue/getProccessingIssue";
import { useGetUrgentIssueCount } from "@/services/CS/monitoring/urgent-issue/getUrgentIssueCount";
import { useGetUrgentIssueList } from "@/services/CS/monitoring/urgent-issue/getUrgentIssues";

import FilterPopoverUrgentIssue from "./components/FilterPopoverUrgentIssue";
import { UrgentIssueCard } from "./components/UrgentIssueCard";

const statusMap = {
  baru: "new",
  proses: "processing",
  selesai: "completed",
};

const RequestList = ({
  requests,
  isLoading,
  status,
  openDetails,
  toggleDetail,
  meta,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="text-center text-neutral-500">
          {t("UrgentIssue.messageLoading", {}, "Memuat...")}
        </div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="h-full py-8">
        <DataNotFound className="h-full gap-y-5 pb-10" type="data">
          <p className="text-center text-base font-semibold text-neutral-600">
            {t(
              "UrgentIssue.messageNoReports",
              {},
              "Belum ada laporan urgent issue"
            )}{" "}
            {status === "baru"
              ? t("UrgentIssue.messageNoReportsNew", {}, "baru")
              : status === "proses"
                ? t(
                    "UrgentIssue.messageNoReportsProcessing",
                    {},
                    "sudah diproses"
                  )
                : t(
                    "UrgentIssue.messageNoReportsCompleted",
                    {},
                    "yang diselesaikan"
                  )}
          </p>
        </DataNotFound>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12">
      {requests.map((item) => (
        <UrgentIssueCard
          key={item.id}
          data={{
            ...item,
            ...(item.issues && item.issues[0] ? item.issues[0] : {}),
            vehicle:
              item.issues && item.issues[0]
                ? item.issues[0].vehicle
                : undefined,
            transporter: item.transporter,
            orderLocations: item.orderLocations,
            countdown: item.countdown,
            orderCode: item.orderCode,
            orderId: item.order_id,
            detectedAt:
              item.issues && item.issues[0]
                ? item.issues[0].detected_at
                : item.detected_at,
            completedAt:
              item.issues && item.issues[0]
                ? item.issues[0].completed_at
                : item.completed_at,
          }}
          statusTab={status}
          isDetailOpen={openDetails.includes(item.id)}
          onToggleDetail={() => toggleDetail(item.id)}
          meta={meta}
        />
      ))}
    </div>
  );
};

const UrgentIssue = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("baru");
  const [openDetails, setOpenDetails] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [hubungiModal, setHubungiModal] = useState(false);
  const [data, setData] = useState([]);
  const { data: urgentIssueData, isLoading: isUrgentIssueLoading } =
    useGetUrgentIssueCount();
  // Gunakan data dari getProccessingIssue.js jika tab proses aktif
  const {
    items: processingItems,
    meta: processingMeta,
    isLoading: isProcessingLoading,
  } = useGetProcessingIssueList({
    page: currentPage,
    limit: 10,
    sort: "detectedAt",
    sortDirection: "desc",
  });

  // Untuk tab selesai, ambil dari getCompletedIssue.js
  const {
    items: completedItems,
    meta: completedMeta,
    isLoading: isCompletedLoading,
  } = useGetCompletedIssueList({
    page: currentPage,
    limit: 10,
    sort: "detectedAt",
    sortDirection: "desc",
  });

  const { items, meta, isLoading } = useGetUrgentIssueList({
    status: statusMap[activeTab],
    page: currentPage,
    limit: 10,
    sort: "detectedAt",
    sortDirection: "desc",
  });

  // Reset data dan page ketika tab berubah
  useEffect(() => {
    setData([]);
    setCurrentPage(1);
    setOpenDetails([]);
  }, [activeTab]);

  // Update data ketika items berubah
  useEffect(() => {
    if (activeTab === "proses") {
      if (!processingItems) return;
      setData((prev) =>
        currentPage === 1 ? processingItems : [...prev, ...processingItems]
      );
    } else if (activeTab === "selesai") {
      if (!completedItems) return;
      setData((prev) =>
        currentPage === 1 ? completedItems : [...prev, ...completedItems]
      );
    } else {
      if (!items) return;
      setData((prev) => (currentPage === 1 ? items : [...prev, ...items]));
    }
  }, [items, processingItems, currentPage, activeTab]);

  const toggleDetail = (id) => {
    setOpenDetails((prev) => {
      let newOpen;

      // Jika id sudah ada → tutup
      if (prev.includes(id)) {
        newOpen = prev.filter((item) => item !== id);
      } else {
        newOpen = [...prev, id];
      }

      // Jika lebih dari 5, sisakan 5 terakhir (yang terbaru)
      if (newOpen.length > 5) {
        newOpen = newOpen.slice(newOpen.length - 5);
      }

      return newOpen;
    });
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const filterConfig = {
    categories: [
      {
        key: "status",
        label: t("UrgentIssue.filterStatus", {}, "Status"),
        searchable: true,
      },
      {
        key: "vehicleType",
        label: t("UrgentIssue.filterVehicleType", {}, "Jenis Kendaraan"),
        searchable: true,
      },
    ],
    data: {
      status: [
        {
          id: "scheduled",
          label: t("UrgentIssue.filterStatusScheduled", {}, "Dijadwalkan"),
        },
        {
          id: "waiting",
          label: t("UrgentIssue.filterStatusWaiting", {}, "Menunggu Jam Muat"),
        },
        {
          id: "on_duty",
          label: t("UrgentIssue.filterStatusOnDuty", {}, "Bertugas"),
        },
        {
          id: "completed",
          label: t(
            "UrgentIssue.filterStatusCompleted",
            {},
            "Pengiriman Selesai"
          ),
        },
        {
          id: "inactive",
          label: t("UrgentIssue.filterStatusInactive", {}, "Non - Aktif"),
        },
      ],
      vehicleType: [
        {
          id: "truck",
          label: t(
            "UrgentIssue.filterVehicleTypeTruck",
            {},
            "Medium Truk 6x2 - Tangki"
          ),
        },
        {
          id: "colt",
          label: t(
            "UrgentIssue.filterVehicleTypeColt",
            {},
            "Colt Diesel Double - Bak Terbuka"
          ),
        },
        {
          id: "dump",
          label: t(
            "UrgentIssue.filterVehicleTypeDump",
            {},
            "Colt Diesel Double - Dump"
          ),
        },
      ],
    },
  };

  // Pilih meta dan isLoading sesuai tab aktif
  const currentMeta =
    activeTab === "proses"
      ? processingMeta
      : activeTab === "selesai"
        ? completedMeta
        : meta;
  const currentLoading =
    activeTab === "proses"
      ? isProcessingLoading
      : activeTab === "selesai"
        ? isCompletedLoading
        : isLoading;

  return (
    <div className="flex h-[calc(100vh-92px-48px)] min-h-0 flex-col">
      <div className="flex-shrink-0 bg-white px-4 py-6">
        <h1 className="mb-4 text-base font-bold text-neutral-900">
          {t("UrgentIssue.titleUrgentIssueReport", {}, "Laporan Urgent Issue")}
        </h1>
        {currentMeta?.overdue_count > 0 && (
          <div
            className={cn(
              "mb-4 flex items-center gap-1 rounded-xl bg-error-50 p-2"
            )}
          >
            <IconComponent src="/icons/warning-red.svg" className="h-4 w-4" />
            <div className="flex flex-col">
              <span className={cn("text-xs font-semibold text-error-400")}>
                {currentMeta?.overdue_count ?? 0} Laporan Urgent Issue Melewati
                Batas Waktu
              </span>
              <span className="text-[10px] font-medium text-neutral-900">
                {t(
                  "UrgentIssue.alertOverdueReportsAction",
                  {},
                  "Segera hubungi Transporter terkait untuk penyelesaian laporan."
                )}
              </span>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("baru")}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold transition-colors ${
                activeTab === "baru"
                  ? "border border-primary-700 bg-primary-50 text-primary-700"
                  : "border border-neutral-200 bg-neutral-200 text-neutral-900"
              }`}
            >
              {t("UrgentIssue.tabNew", {}, "Baru")} (
              {isUrgentIssueLoading
                ? "-"
                : (urgentIssueData?.new_count ?? 0) > 99
                  ? "99+"
                  : (urgentIssueData?.new_count ?? 0)}
              )
            </button>
            <button
              onClick={() => setActiveTab("proses")}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold transition-colors ${
                activeTab === "proses"
                  ? "border border-primary-700 bg-primary-50 text-primary-700"
                  : "border border-neutral-200 bg-neutral-200 text-neutral-900"
              }`}
            >
              {t("UrgentIssue.tabProcessing", {}, "Proses")} (
              {isUrgentIssueLoading
                ? "-"
                : (urgentIssueData?.process_count ?? 0) > 99
                  ? "99+"
                  : (urgentIssueData?.process_count ?? 0)}
              )
            </button>
            <button
              onClick={() => setActiveTab("selesai")}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold transition-colors ${
                activeTab === "selesai"
                  ? "border border-primary-700 bg-primary-50 text-primary-700"
                  : "border border-neutral-200 bg-neutral-200 text-neutral-900"
              }`}
            >
              {t("UrgentIssue.tabCompleted", {}, "Selesai")} (
              {isUrgentIssueLoading
                ? "-"
                : (urgentIssueData?.completed_count ?? 0) > 99
                  ? "99+"
                  : (urgentIssueData?.completed_count ?? 0)}
              )
            </button>
          </div>
          <FilterPopoverUrgentIssue
            onApplyFilter={handleFilter}
            filterCounts={filters}
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto bg-white px-4">
        <RequestList
          requests={data}
          isLoading={currentLoading}
          status={activeTab}
          openDetails={openDetails}
          toggleDetail={toggleDetail}
          meta={currentMeta}
        />
      </div>
    </div>
  );
};

export default UrgentIssue;

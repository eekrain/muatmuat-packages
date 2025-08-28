import { useEffect, useRef, useState } from "react";

import { mutate } from "swr";

import {
  useGetUrgentIssueCount,
  useGetUrgentIssueList,
} from "@/services/Transporter/monitoring/getUrgentIssues";

import DataNotFound from "@/components/DataNotFound/DataNotFound";

import { useTranslation } from "@/hooks/use-translation";

import { UrgentIssueCardTransporter } from "./components/UrgentIssueCard";

const statusMap = {
  baru: "NEW",
  proses: "PROCESSING",
  selesai: "COMPLETED",
};

const RequestList = ({
  ref,
  requests,
  isLoading,
  status,
  openDetails,
  toggleDetail,
  pagination,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="text-center text-neutral-500">
          {t("UrgentIssueTransporter.messageLoading", {}, "Memuat...")}
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
              "UrgentIssueTransporter.messageNoReports",
              {},
              "Belum ada laporan urgent issue"
            )}{" "}
            {status === "baru"
              ? t("UrgentIssueTransporter.messageNoReportsNew", {}, "baru")
              : status === "proses"
                ? t(
                    "UrgentIssueTransporter.messageNoReportsProcessing",
                    {},
                    "sudah diproses"
                  )
                : t(
                    "UrgentIssueTransporter.messageNoReportsCompleted",
                    {},
                    "yang diselesaikan"
                  )}
          </p>
        </DataNotFound>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12" ref={ref}>
      {requests.map((item, index) => (
        <UrgentIssueCardTransporter
          key={item.id}
          data={item}
          statusTab={status}
          isDetailOpen={openDetails.includes(item.id)}
          onToggleDetail={() => toggleDetail(item.id)}
        />
      ))}

      {/* Loading spinner untuk lazy load */}
      {isLoading && requests.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600"></div>
              <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full border-2 border-primary-400 opacity-20"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary-600 [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary-600 [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary-600"></div>
            </div>
            <span className="text-sm font-medium text-neutral-600">
              Memuat data...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const UrgentIssue = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("baru");
  const [openDetails, setOpenDetails] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const requestContainer = useRef(null);

  const { count, isLoading: isCountLoading } = useGetUrgentIssueCount();

  const {
    items: rawItems,
    isLoading,
    pagination,
  } = useGetUrgentIssueList({
    status: statusMap[activeTab],
    page,
    limit: 10,
    sort: "detectedAt",
    sortDirection: "desc",
  });

  // Use rawItems directly, no need for memoization that causes issues
  const items = rawItems || [];

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

  // Reset data dan page ketika tab berubah
  useEffect(() => {
    setData([]);
    setPage(1);
    setOpenDetails([]);

    // Clear SWR cache untuk memastikan data fresh
    mutate(
      (key) => typeof key === "string" && key.includes("getUrgentIssueList")
    );
  }, [activeTab]);

  // Update data ketika items berubah - only when loading completes
  useEffect(() => {
    // Skip if still loading
    if (isLoading) return;

    if (!items || items.length === 0) {
      // Only reset data if page is 1
      if (page === 1) {
        setData([]);
      }
      return;
    }

    if (page === 1) {
      // For first page, just set the items
      setData(items);
    } else {
      // For subsequent pages, append only new items
      setData((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = items.filter((item) => !existingIds.has(item.id));

        if (newItems.length > 0) {
          return [...prev, ...newItems];
        }
        return prev;
      });
    }
  }, [isLoading, page, activeTab]); // Only depend on isLoading state change, page, and activeTab

  // Setup scroll handler untuk infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const container = requestContainer.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;

      // Trigger lazy load jika sudah di bottom dan ada data lebih
      if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading) {
        // Cek apakah masih ada halaman berikutnya
        if (pagination?.hasNext) {
          setPage((p) => p + 1);
        }
      }
    };

    const container = requestContainer.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [pagination?.hasNext, isLoading]);

  return (
    <div className="flex h-[calc(100vh-92px-48px)] min-h-0 flex-col">
      <div className="flex-shrink-0 bg-white px-4 py-6">
        <h1 className="mb-4 text-base font-bold text-neutral-900">
          {t(
            "UrgentIssueTransporter.titleUrgentIssueReport",
            {},
            "Laporan Urgent Issue"
          )}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("baru")}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold transition-colors ${
              activeTab === "baru"
                ? "border border-primary-700 bg-primary-50 text-primary-700"
                : "border border-neutral-200 bg-neutral-200 text-neutral-900"
            }`}
          >
            {t("UrgentIssueTransporter.tabNew", {}, "Baru")} (
            {isCountLoading
              ? "-"
              : (count?.new ?? 0) > 99
                ? "99+"
                : (count?.new ?? 0)}
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
            {t("UrgentIssueTransporter.tabProcessing", {}, "Proses")} (
            {isCountLoading
              ? "-"
              : (count?.processing ?? 0) > 99
                ? "99+"
                : (count?.processing ?? 0)}
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
            {t("UrgentIssueTransporter.tabCompleted", {}, "Selesai")} (
            {isCountLoading
              ? "-"
              : (count?.completed ?? 0) > 99
                ? "99+"
                : (count?.completed ?? 0)}
            )
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto bg-white px-4">
        <RequestList
          ref={requestContainer}
          requests={data}
          isLoading={isLoading}
          status={activeTab}
          openDetails={openDetails}
          toggleDetail={toggleDetail}
          pagination={pagination}
        />
      </div>
    </div>
  );
};

export default UrgentIssue;

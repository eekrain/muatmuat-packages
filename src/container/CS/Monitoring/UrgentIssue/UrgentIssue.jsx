import { useState } from "react";

import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";
import {
  useGetUrgentIssueCount,
  useGetUrgentIssueList,
} from "@/services/Transporter/monitoring/getUrgentIssues";

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
}) => {
  if (isLoading) {
    return (
      <div className="py-8">
        <div className="text-center text-neutral-500">Memuat...</div>
      </div>
    );
  }

  // Filter sesuai tab
  let filtered = [];
  if (status === "baru") {
    filtered = requests.filter((item) => item.status === "NEW");
  } else if (status === "proses") {
    filtered = requests.filter((item) => item.status === "PROCESSING");
  } else if (status === "selesai") {
    filtered = requests.filter((item) => item.status === "COMPLETED");
  }

  if (!filtered || filtered.length === 0) {
    return (
      <div className="h-full py-8">
        <DataNotFound className="h-full gap-y-5 pb-10" type="data">
          <p className="text-center text-base font-semibold text-neutral-600">
            Belum ada laporan urgent issue{" "}
            {status === "baru"
              ? "baru"
              : status === "proses"
                ? "sudah diproses"
                : "yang diselesaikan"}
          </p>
        </DataNotFound>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12">
      {filtered.map((item) => (
        <UrgentIssueCard
          key={item.id}
          data={item}
          statusTab={status}
          isDetailOpen={openDetails.includes(item.id)}
          onToggleDetail={() => toggleDetail(item.id)}
        />
      ))}
    </div>
  );
};

const UrgentIssue = () => {
  const [activeTab, setActiveTab] = useState("baru");
  const [openDetails, setOpenDetails] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const { count, isLoading: isCountLoading } = useGetUrgentIssueCount();

  const { items, isLoading } = useGetUrgentIssueList({
    status: statusMap[activeTab],
    page: 1,
    limit: 10,
    sort: "detectedAt",
    sortDirection: "desc",
  });

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
        label: "Status",
        searchable: true,
      },
      {
        key: "vehicleType",
        label: "Jenis Kendaraan",
        searchable: true,
      },
    ],
    data: {
      status: [
        { id: "scheduled", label: "Dijadwalkan" },
        { id: "waiting", label: "Menunggu Jam Muat" },
        { id: "on_duty", label: "Bertugas" },
        { id: "completed", label: "Pengiriman Selesai" },
        { id: "inactive", label: "Non - Aktif" },
      ],
      vehicleType: [
        { id: "truck", label: "Medium Truk 6x2 - Tangki" },
        { id: "colt", label: "Colt Diesel Double - Bak Terbuka" },
        { id: "dump", label: "Colt Diesel Double - Dump" },
      ],
    },
  };

  return (
    <div className="flex h-[calc(100vh-92px-48px)] min-h-0 flex-col">
      <div className="flex-shrink-0 bg-white px-4 py-6">
        <h1 className="mb-4 text-base font-bold text-neutral-900">
          Laporan Urgent Issue
        </h1>
        <div
          className={cn(
            "mb-4 flex items-center gap-1 rounded-xl bg-error-50 p-2"
          )}
        >
          <IconComponent src="/icons/warning-red.svg" className="h-4 w-4" />
          <div className="flex flex-col">
            <span className={cn("text-xs font-semibold text-error-400")}>
              2 Laporan Urgent Issue Melewati Batas Waktu
            </span>
            <span className="text-[10px] font-medium text-neutral-900">
              Segera hubungi Transporter terkait untuk penyelesaian laporan.
            </span>
          </div>
        </div>
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
              Baru (
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
              Proses (
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
              Selesai (
              {isCountLoading
                ? "-"
                : (count?.completed ?? 0) > 99
                  ? "99+"
                  : (count?.completed ?? 0)}
              )
            </button>
          </div>
          <FilterPopoverUrgentIssue
            onApplyFilter={handleFilter}
            filterCounts={filters}
          />
          {/* <ConfirmationModal
            isOpen={true}
            setIsOpen={setRangeDateModal}
            title={{
              text: "Batalkan Armada",
              className: "text-base font-bold text-center",
            }}
            description={{
              text: "Maaf, kamu belum memiliki akses. Pembatalan Armada maupun Pesanan hanya bisa dilakukan oleh akses sebagai GM.",
              className: "font-medium text-neutral-900 leading-tight",
            }}
            confirm={{
              text: "Oke",
              onClick: () => { },
            }}
            withCancel={false}
          >
          </ConfirmationModal> */}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto bg-white px-4">
        <RequestList
          requests={items}
          isLoading={isLoading}
          status={activeTab}
          openDetails={openDetails}
          toggleDetail={toggleDetail}
        />
      </div>
    </div>
  );
};

export default UrgentIssue;

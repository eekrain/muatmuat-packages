import { useState } from "react";

import DataNotFound from "@/components/DataNotFound/DataNotFound";
import {
  useGetUrgentIssueCount,
  useGetUrgentIssueList,
} from "@/services/Transporter/monitoring/getUrgentIssues";

import { UrgentIssueCard } from "./components/UrgentIssueCard";

const statusMap = {
  baru: "new",
  proses: "processing",
  selesai: "completed",
};

const RequestList = ({ requests, isLoading, status }) => {
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
      <div className="py-8">
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
        <UrgentIssueCard key={item.id} data={item} statusTab={status} />
      ))}
    </div>
  );
};

const UrgentIssue = () => {
  const [activeTab, setActiveTab] = useState("baru");

  const { count, isLoading: isCountLoading } = useGetUrgentIssueCount();

  const { items, isLoading } = useGetUrgentIssueList({
    status: statusMap[activeTab],
    page: 1,
    limit: 10,
    sort: "detectedAt",
    sortDirection: "desc",
  });

  console.log(items);

  return (
    <div className="flex h-[calc(100vh-92px-48px)] min-h-0 flex-col py-4">
      <div className="flex-shrink-0 bg-white px-6 py-4">
        <h1 className="mb-4 text-base font-bold text-neutral-900">
          Laporan Urgent Issue
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("baru")}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === "baru"
                ? "bg-primary-700 text-white"
                : "border border-neutral-300 bg-white text-neutral-600"
            }`}
          >
            Baru ({isCountLoading ? "-" : (count?.new ?? 0)})
          </button>
          <button
            onClick={() => setActiveTab("proses")}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === "proses"
                ? "bg-primary-700 text-white"
                : "border border-neutral-300 bg-white text-neutral-600"
            }`}
          >
            Proses ({isCountLoading ? "-" : (count?.processing ?? 0)})
          </button>
          <button
            onClick={() => setActiveTab("selesai")}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === "selesai"
                ? "bg-primary-700 text-white"
                : "border border-neutral-300 bg-white text-neutral-600"
            }`}
          >
            Selesai ({isCountLoading ? "-" : (count?.completed ?? 0)})
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto bg-white px-6">
        <RequestList
          requests={items}
          isLoading={isLoading}
          status={activeTab}
        />
      </div>
    </div>
  );
};

export default UrgentIssue;

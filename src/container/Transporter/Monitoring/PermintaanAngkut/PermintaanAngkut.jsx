"use client";

import { useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { useGetTransportRequestList } from "@/services/Transporter/monitoring/getTransportRequestList";

import TransportRequestCard from "./components/TransportRequestCard";

const PermintaanAngkut = () => {
  const [activeTab, setActiveTab] = useState("tersedia");
  const [searchValue, setSearchValue] = useState("");

  // Get data based on active tab
  const getParams = () => {
    switch (activeTab) {
      case "halal_logistik":
        return { isHalalLogistics: true };
      case "disimpan":
        return { isSaved: true };
      default:
        return {};
    }
  };

  const { data, error, isLoading } = useGetTransportRequestList(getParams());

  const handleSearch = (value) => {
    setSearchValue(value);
    // TODO: Implement search functionality
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Fixed Header - Search Input and Tabs */}
      <div className="flex-shrink-0 bg-white px-4 py-6">
        <h1 className="mb-4 text-base font-bold text-neutral-900">
          Permintaan Jasa Angkut
        </h1>

        {/* Search Input */}
        <div className="mb-4">
          <div className="flex h-8 w-full items-center gap-2 rounded-md border border-neutral-300 bg-neutral-50 px-3">
            <IconComponent
              src="/icons/search.svg"
              className="h-4 w-4 text-[#7B7B7B]"
            />
            <input
              type="text"
              placeholder="Cari No. Pesanan / Armada / Lokasi Muat & Bongkar / Muatan"
              className="h-full w-[338px] border-none bg-transparent py-0 text-xs font-medium leading-[120%] text-[#7B7B7B] placeholder:text-[#7B7B7B] focus:outline-none"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex h-7 w-[323px] gap-2">
          <button
            onClick={() => setActiveTab("tersedia")}
            className="relative flex h-full w-[79px] items-center justify-center gap-1 rounded-full border border-[#176CF7] bg-[#E2F2FF] px-3 py-1 text-[10px] font-medium text-[#176CF7] transition-colors"
          >
            Tersedia ({data?.tabCounts?.tersedia ?? 4})
          </button>

          <button
            onClick={() => setActiveTab("halal_logistik")}
            className="flex h-full w-[124px] items-center justify-center gap-1 rounded-full border border-[#F1F1F1] bg-[#F1F1F1] px-3 py-1 text-[10px] font-medium text-[#000000] transition-colors"
          >
            <IconComponent src="/icons/halal.svg" className="h-4 w-4" />
            Halal Logistik ({data?.tabCounts?.halal_logistik ?? 1})
          </button>

          <button
            onClick={() => setActiveTab("disimpan")}
            className="flex h-full w-[104px] items-center justify-center gap-1 rounded-full border border-[#F1F1F1] bg-[#F1F1F1] px-3 py-1 text-[10px] font-medium text-[#000000] transition-colors"
          >
            <IconComponent src="/icons/bookmark.svg" className="h-4 w-4" />
            Disimpan ({data?.tabCounts?.disimpan ?? 0})
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto bg-background px-4">
        {activeTab === "tersedia" && (
          <RequestList requests={data?.requests || []} isLoading={isLoading} />
        )}

        {activeTab === "halal_logistik" && (
          <RequestList
            requests={
              data?.requests?.filter((req) => req.isHalalLogistics) || []
            }
            isLoading={isLoading}
          />
        )}

        {activeTab === "disimpan" && (
          <RequestList
            requests={data?.requests?.filter((req) => req.isSaved) || []}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

const RequestList = ({ requests, isLoading }) => {
  if (isLoading) {
    return (
      <div className="py-8">
        <div className="text-center text-neutral-500">Memuat...</div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="py-8">
        <div className="text-center text-neutral-500">
          Tidak ada permintaan tersedia
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <TransportRequestCard key={request.id} request={request} />
      ))}
    </div>
  );
};

export default PermintaanAngkut;

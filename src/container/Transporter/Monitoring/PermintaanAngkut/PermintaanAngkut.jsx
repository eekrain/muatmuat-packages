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
    <div className="flex h-[calc(100vh-92px-48px)] flex-col bg-background">
      {/* Fixed Header - Search Input and Tabs */}
      <div className="flex-shrink-0 bg-white px-4 py-4">
        <h1 className="mb-4 text-base font-bold text-neutral-900">
          Permintaan Jasa Angkut
        </h1>

        {/* Search Input */}
        <div className="mb-4">
          <div className="relative">
            <IconComponent
              src="/icons/search.svg"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="text"
              placeholder="Cari No. Pesanan / Armada / Lokasi Muat & Bongkar / Muatan"
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-2 pl-10 text-sm text-neutral-700 placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("tersedia")}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === "tersedia"
                ? "bg-primary-700 text-white"
                : "border border-neutral-300 bg-white text-neutral-600"
            }`}
          >
            Tersedia ({data?.tabCounts?.tersedia ?? 4})
          </button>

          <button
            onClick={() => setActiveTab("halal_logistik")}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === "halal_logistik"
                ? "bg-primary-700 text-white"
                : "border border-neutral-300 bg-white text-neutral-600"
            }`}
          >
            <IconComponent src="/icons/halal.svg" className="h-4 w-4" />
            Halal Logistik ({data?.tabCounts?.halal_logistik ?? 1})
          </button>

          <button
            onClick={() => setActiveTab("disimpan")}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === "disimpan"
                ? "bg-primary-700 text-white"
                : "border border-neutral-300 bg-white text-neutral-600"
            }`}
          >
            <IconComponent src="/icons/bookmark.svg" className="h-4 w-4" />
            Disimpan ({data?.tabCounts?.disimpan ?? 0})
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto bg-white px-4">
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
    <div className="space-y-4 pb-4">
      {requests.map((request) => (
        <TransportRequestCard key={request.id} request={request} />
      ))}
    </div>
  );
};

export default PermintaanAngkut;

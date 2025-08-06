"use client";

import { useState } from "react";

import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import Search from "@/components/Search/Search";
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

  // Format counter display with animation for new requests
  // Range behavior:
  // - 1-9: Show exact number, no animation
  // - 10-99: Show exact number with blinking animation for new requests
  // - 100+: Show "99+" with special error styling
  const formatCounter = (count, hasAnimation = false) => {
    if (count >= 100) {
      return "99+";
    }
    return count.toString();
  };

  // Check if counter should have blinking animation (only for 10-99 range with new requests)
  const shouldAnimate = (count, hasNewRequests = false) => {
    return hasNewRequests && count >= 10 && count <= 99;
  };

  // Get dynamic width based on counter value
  const getTabWidth = (baseWidth, count, isActive) => {
    if (count >= 100) {
      // "99+" takes more space
      return isActive ? baseWidth : `w-auto min-w-[${baseWidth}]`;
    } else if (count >= 10) {
      // 2-digit numbers need slightly more space
      return isActive ? baseWidth : `w-auto min-w-[${baseWidth}]`;
    }
    // 1-digit numbers use base width
    return isActive ? baseWidth : `w-auto min-w-[${baseWidth}]`;
  };

  return (
    <div className="flex h-[calc(100vh-92px-48px)] flex-col bg-white">
      {/* Fixed Header - Search Input and Tabs */}
      <div className="flex-shrink-0 bg-white px-4 py-6">
        <h1 className="mb-4 text-base font-bold text-neutral-900">
          Permintaan Jasa Angkut
        </h1>

        {/* Suspended Account Alert */}
        {data?.userStatus?.isSuspended && (
          <div className="mb-4 flex items-center gap-1 rounded-xl bg-[#FFE9ED] px-3 py-2">
            <IconComponent
              src="/icons/warning24.svg"
              className="h-4 w-4 flex-shrink-0 text-[#F22C25]"
            />
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-semibold text-[#F22C25]">
                {data?.userStatus?.suspensionReason}
              </span>
              <span className="text-[10px] font-medium text-[#000000]">
                {data?.userStatus?.suspensionMessage}{" "}
                <a
                  href={data?.userStatus?.supportContactUrl}
                  className="cursor-pointer font-medium text-primary-700 hover:text-primary-800"
                >
                  disini
                </a>
              </span>
            </div>
          </div>
        )}

        {/* Driver Delegation Warning */}
        {data?.userStatus?.driverDelegationEnabled &&
          !data?.userStatus?.isSuspended && (
            <div className="mb-4 flex items-center gap-1 rounded-xl bg-[#FFFBEB] px-3 py-2">
              <IconComponent
                src="/icons/warning24.svg"
                className="h-4 w-4 flex-shrink-0 text-[#F9A307]"
              />
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-semibold text-[#F9A307]">
                  Delegasi Driver Aktif
                </span>
                <span className="text-[10px] font-medium text-[#000000]">
                  {data?.userStatus?.delegationWarningMessage}{" "}
                  <a
                    href={data?.userStatus?.delegationResetUrl}
                    className="cursor-pointer font-medium text-primary-700 hover:text-primary-800"
                  >
                    Atur ulang
                  </a>
                </span>
              </div>
            </div>
          )}

        {/* Halal Certification Warning */}
        {!data?.userStatus?.isHalalCertified &&
          !data?.userStatus?.isSuspended &&
          !data?.userStatus?.driverDelegationEnabled && (
            <div className="mb-4 flex items-center gap-1 rounded-xl bg-[#FFFBEB] px-3 py-2">
              <IconComponent
                src="/icons/warning24.svg"
                className="h-4 w-4 flex-shrink-0 text-[#F9A307]"
              />
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-semibold text-[#F9A307]">
                  Memerlukan Pengiriman Dengan Sertifikasi Halal Logistik
                </span>
                <span className="text-[10px] font-medium text-[#000000]">
                  {data?.userStatus?.halalCertificationMessage ||
                    "Tambahkan sertifikasi halal dengan menghubungi kami"}{" "}
                  <a
                    href={
                      data?.userStatus?.halalCertificationUrl ||
                      "tel:+62-811-1234-5678"
                    }
                    className="cursor-pointer font-medium text-primary-700 hover:text-primary-800"
                  >
                    disini
                  </a>
                </span>
              </div>
            </div>
          )}

        {/* Search Input */}
        <div className="mb-4">
          <Search
            placeholder="Cari No. Pesanan / Armada / Lokasi Muat & Bongkar / Muatan"
            onSearch={handleSearch}
            autoSearch={true}
            debounceTime={300}
            defaultValue={searchValue}
            disabled={data?.userStatus?.isSuspended}
            inputClassName="w-full"
          />
        </div>

        {/* Tabs */}
        <div className="flex h-7 w-auto max-w-[450px] gap-2">
          <button
            onClick={() => setActiveTab("tersedia")}
            className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
              activeTab === "tersedia"
                ? "w-auto min-w-[79px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
                : "w-auto min-w-[79px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
            }`}
          >
            <span className="whitespace-nowrap">
              Tersedia (
              <span
                className={`${
                  shouldAnimate(
                    data?.tabCounts?.tersedia ?? 35,
                    data?.newRequestsCount?.hasAnimation
                  )
                    ? "font-base animate-semibold"
                    : ""
                }`}
              >
                {formatCounter(data?.tabCounts?.tersedia ?? 35)}
              </span>
              )
            </span>
          </button>

          <button
            onClick={() => setActiveTab("halal_logistik")}
            className={`flex h-full items-center justify-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
              activeTab === "halal_logistik"
                ? "w-auto min-w-[124px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
                : "w-auto min-w-[124px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
            }`}
          >
            <IconComponent src="/icons/halal.svg" className="h-4 w-4" />
            <span className="whitespace-nowrap">
              Halal Logistik (
              <span
                className={`${
                  shouldAnimate(
                    data?.tabCounts?.halal_logistik ?? 22,
                    data?.newRequestsCount?.hasAnimation
                  )
                    ? "animate-pulse font-bold text-warning-600"
                    : ""
                }`}
              >
                {formatCounter(data?.tabCounts?.halal_logistik ?? 22)}
              </span>
              )
            </span>
          </button>

          <button
            onClick={() => setActiveTab("disimpan")}
            className={`flex h-full items-center justify-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
              activeTab === "disimpan"
                ? "w-auto min-w-[104px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
                : "w-auto min-w-[104px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
            }`}
          >
            <IconComponent src="/icons/bookmark.svg" className="h-4 w-4" />
            <span className="whitespace-nowrap">
              Disimpan (
              <span
                className={`${
                  data?.tabCounts?.disimpan >= 100
                    ? "font-bold text-error-600" // Special styling for 99+
                    : shouldAnimate(
                          data?.tabCounts?.disimpan ?? 8,
                          data?.newRequestsCount?.hasAnimation
                        )
                      ? "animate-pulse font-bold text-warning-600"
                      : ""
                }`}
              >
                {formatCounter(data?.tabCounts?.disimpan ?? 8)}
              </span>
              )
            </span>
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto bg-white px-4">
        {/* Always show content regardless of suspension status */}
        {activeTab === "tersedia" && (
          <RequestList
            requests={data?.requests || []}
            isLoading={isLoading}
            activeTab={activeTab}
            isSuspended={data?.userStatus?.isSuspended}
          />
        )}

        {activeTab === "halal_logistik" && (
          <RequestList
            requests={
              data?.requests?.filter((req) => req.isHalalLogistics) || []
            }
            isLoading={isLoading}
            activeTab={activeTab}
            isSuspended={data?.userStatus?.isSuspended}
          />
        )}

        {activeTab === "disimpan" && (
          <RequestList
            requests={data?.requests?.filter((req) => req.isSaved) || []}
            isLoading={isLoading}
            activeTab={activeTab}
            isSuspended={data?.userStatus?.isSuspended}
          />
        )}
      </div>
    </div>
  );
};

const RequestList = ({
  requests,
  isLoading,
  activeTab,
  isSuspended = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-2 text-neutral-500">
          <IconComponent
            src="/icons/loader-truck-spinner.svg"
            className="h-6 w-6 animate-spin"
          />
          <span className="text-sm font-medium">Memuat permintaan...</span>
        </div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    // Different empty states based on active tab
    const getEmptyStateConfig = () => {
      switch (activeTab) {
        case "halal_logistik":
          return {
            title: "Belum Ada Permintaan Halal Logistik",
            subtitle: "SMohon bersabar untuk menanti permintaan baru.",
            icon: "/icons/halal.svg",
          };
        case "disimpan":
          return {
            title: "Belum Ada Permintaan Tersimpan",
            subtitle:
              "Anda belum menyimpan permintaan angkut apapun. Simpan permintaan yang menarik dengan menekan ikon bookmark untuk melihatnya di sini.",
            icon: "/icons/bookmark.svg",
          };
        default:
          return {
            title: "Oops, belum ada permintaan jasa angkut",
            subtitle: "Mohon bersabar untuk menanti permintaan baru",
            icon: "/icons/truck-jenis.svg",
          };
      }
    };

    const emptyConfig = getEmptyStateConfig();

    return (
      <div className="mt-[100px] flex-1 overflow-y-auto p-4">
        <DataNotFound className="h-full gap-y-5 pb-10" type="data">
          <div className="text-center">
            <p className="text-base font-semibold text-neutral-600">
              Oops, belum ada permintaan jasa angkut
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Mohon bersabar untuk menanti permintaan baru{" "}
            </p>
          </div>
        </DataNotFound>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {requests.map((request) => (
        <TransportRequestCard
          key={request.id}
          request={request}
          isSuspended={isSuspended}
        />
      ))}
    </div>
  );
};

export default PermintaanAngkut;

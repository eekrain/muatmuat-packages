"use client";

import { useMemo, useState } from "react";

import { useGetTransportRequestList } from "@/services/Transporter/monitoring/permintaan-angkut/getTransportRequestList";

import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import Search from "@/components/Search/Search";

import { useTranslation } from "@/hooks/use-translation";

import PermintaanAngkutDetail from "./PermintaanAngkutDetail";
import TransportRequestCard from "./components/TransportRequestCard";

const PermintaanAngkut = ({
  onAcceptRequest,
  onDetailRequest,
  onCloseDetailRequest,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("tersedia");
  const [searchValue, setSearchValue] = useState("");
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [removedItems, setRemovedItems] = useState(new Set());
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // Get data based on active tab, tambahkan query param 'tab', 'search', 'page', 'limit'
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Handler for Enter key in search input
  // No need for custom keydown/input handler, Search handles Enter
  const params = useMemo(() => {
    const baseParams = {
      tab: activeTab,
      search:
        searchValue && searchValue.trim().length >= 3 ? searchValue : undefined,
      page,
      limit,
    };
    switch (activeTab) {
      case "halal_logistik":
        return { ...baseParams, isHalalLogistics: true };
      case "disimpan":
        return { ...baseParams, isSaved: true };
      default:
        return baseParams;
    }
  }, [activeTab, searchValue, page, limit]);

  const { data, error, isLoading } = useGetTransportRequestList(params);
  console.log("Transport Request List:", data);

  const handleSearch = (value) => setSearchValue(value);

  const handleBookmarkToggle = (requestId, newSavedState) => {
    const newBookmarkedItems = new Set(bookmarkedItems);
    const originalRequest = data?.requests?.find((req) => req.id === requestId);
    const originalSavedState = originalRequest?.isSaved || false;
    if (newSavedState === originalSavedState) {
      newBookmarkedItems.delete(requestId);
    } else {
      newBookmarkedItems.add(requestId);
    }
    setBookmarkedItems(newBookmarkedItems);
  };

  const handleUnderstand = (requestId) => {
    const newRemovedItems = new Set(removedItems);
    newRemovedItems.add(requestId);
    setRemovedItems(newRemovedItems);
  };

  const handleShowDetail = (request) => {
    setSelectedRequest(request);
    setShowDetail(true);
    // Call the parent handler to collapse bottom panel
    if (onDetailRequest) {
      onDetailRequest(request);
    }
  };

  const handleBackToList = () => {
    setSelectedRequest(null);
    setShowDetail(false);
    // Reset URL ke /monitoring agar id hilang
    if (typeof window !== "undefined") {
      // Untuk Next.js app router
      window.history.replaceState(null, "", "/monitoring");
    }
    if (onCloseDetailRequest) {
      onCloseDetailRequest();
    }
  };

  // Calculate dynamic tab counts based on data and local state
  const getDynamicTabCounts = () => {
    if (!data?.requests) {
      return {
        tersedia: data?.tabCounts?.tersedia ?? 0,
        halal_logistik: data?.tabCounts?.halal_logistik ?? 0,
        disimpan: data?.tabCounts?.disimpan ?? 0,
      };
    }

    // Kalau tidak ada search, langsung pakai tabCounts asli
    if (!searchValue || searchValue.trim() === "") {
      return {
        tersedia: data?.tabCounts?.tersedia ?? 0,
        halal_logistik: data?.tabCounts?.halal_logistik ?? 0,
        disimpan: data?.tabCounts?.disimpan ?? 0,
      };
    }

    // Kalau ada search, hitung ulang berdasarkan data yang terlihat
    const visibleRequests = data.requests.filter(
      (request) =>
        !removedItems.has(request.id) &&
        request.orderCode.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Hitung jumlah saved dengan memperhatikan perubahan bookmark state
    let savedCount = 0;
    visibleRequests.forEach((request) => {
      const isOriginallyBookmarked = request.isSaved;
      const hasStateChanged = bookmarkedItems.has(request.id);
      const isCurrentlyBookmarked = hasStateChanged
        ? !isOriginallyBookmarked
        : isOriginallyBookmarked;
      if (isCurrentlyBookmarked) savedCount++;
    });

    return {
      tersedia: visibleRequests.length,
      halal_logistik: visibleRequests.filter((req) => req.isHalalLogistics)
        .length,
      disimpan: savedCount,
    };
  };

  const dynamicTabCounts = getDynamicTabCounts();

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
      {/* Show detail view if a request is selected */}
      {showDetail && selectedRequest ? (
        <PermintaanAngkutDetail
          request={selectedRequest}
          onBack={handleBackToList}
        />
      ) : (
        <>
          {/* Fixed Header - Search Input and Tabs */}
          <div className="flex-shrink-0 bg-white px-4 py-6">
            <h1 className="mb-4 text-base font-bold text-neutral-900">
              {t(
                "PermintaanAngkut.titleTransportServiceRequest",
                {},
                "Permintaan Jasa Angkut"
              )}
            </h1>

            {/* Suspended Account Alert */}
            {data?.userStatus?.isSuspended && (
              <div className="mb-4 flex items-center gap-1 rounded-xl bg-[#FFE9ED] px-3 py-2">
                <IconComponent
                  src="/icons/warning24.svg"
                  className="h-4 w-4 flex-shrink-0 text-[#F22C25]"
                />
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-[#F22C25]">
                    {t(
                      "PermintaanAngkut.alertTitleAccountSuspended",
                      {},
                      "Akun Kamu Ditangguhkan"
                    )}
                  </span>
                  <span className="text-[10px] font-medium text-[#000000]">
                    {t(
                      "PermintaanAngkut.alertSubtitleContactSupport",
                      {},
                      "Hubungi dukungan pelanggan untuk aktivasi kembali"
                    )}
                    <a
                      href={data?.userStatus?.supportContactUrl}
                      className="ml-1 cursor-pointer font-medium text-primary-700 hover:text-primary-800"
                    >
                      {t("PermintaanAngkut.linkHere", {}, "disini")}
                    </a>
                  </span>
                </div>
              </div>
            )}

            {/* Driver Delegation Warning */}
            {data?.userStatus?.driverDelegationEnabled && (
              <div className="mb-4 flex items-center gap-1 rounded-xl bg-[#FFECB4] px-3 py-2">
                <IconComponent
                  src="/icons/warning24.svg"
                  className="h-4 w-4 flex-shrink-0 text-[#FF7A00]"
                />
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-[#FF7A00]">
                    {t(
                      "PermintaanAngkut.alertTitleDriverDelegationActive",
                      {},
                      "Pengaturan Delegasi Driver Sedang Aktif"
                    )}
                  </span>
                  <span className="text-[10px] font-medium text-[#000000]">
                    {t(
                      "PermintaanAngkut.alertSubtitleCannotAcceptDeclineOrders",
                      {},
                      "Tidak dapat menerima atau menolak pesanan secara langsung"
                    )}
                    <a
                      href={data?.userStatus?.delegationResetUrl}
                      className="ml-1 cursor-pointer font-medium text-primary-700 hover:text-primary-800"
                    >
                      {t("PermintaanAngkut.buttonReset", {}, "Atur ulang")}
                    </a>
                  </span>
                </div>
              </div>
            )}

            {/* Search Input */}
            <div className="mb-4">
              <Search
                placeholder={t(
                  "PermintaanAngkut.searchPlaceholder",
                  {},
                  "Cari No. Pesanan / Armada / Lokasi Muat & Bongkar / Muatan"
                )}
                defaultValue={searchValue}
                onSearch={handleSearch}
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
                  {t("PermintaanAngkut.tabLabelAvailable", {}, "Tersedia")} (
                  <span
                    className={`${
                      shouldAnimate(
                        dynamicTabCounts.tersedia,
                        data?.newRequestsCount?.hasAnimation
                      )
                        ? "font-base animate-semibold"
                        : ""
                    }`}
                  >
                    {formatCounter(dynamicTabCounts.tersedia)}
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
                  {t(
                    "PermintaanAngkut.tabLabelHalalLogistics",
                    {},
                    "Halal Logistik"
                  )}{" "}
                  (
                  <span
                    className={`${
                      shouldAnimate(
                        dynamicTabCounts.halal_logistik,
                        data?.newRequestsCount?.hasAnimation
                      )
                        ? "font-base animate-semibold"
                        : ""
                    }`}
                  >
                    {formatCounter(dynamicTabCounts.halal_logistik)}
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
                  {t("PermintaanAngkut.tabLabelSaved", {}, "Disimpan")} (
                  <span
                    className={`${
                      dynamicTabCounts.disimpan >= 100
                        ? "font-bold text-error-600" // Special styling for 99+
                        : shouldAnimate(
                              dynamicTabCounts.disimpan,
                              data?.newRequestsCount?.hasAnimation
                            )
                          ? "font-base animate-semibold"
                          : ""
                    }`}
                  >
                    {formatCounter(dynamicTabCounts.disimpan)}
                  </span>
                  )
                </span>
              </button>
            </div>

            {/* Halal Certification Warning */}
            {!data?.userStatus?.isHalalCertified && (
              <div className="mt-4 flex items-center gap-1 rounded-xl bg-secondary-100 px-3 py-2">
                <IconComponent
                  src="/icons/warning24.svg"
                  className="h-4 w-4 flex-shrink-0 text-muat-trans-primary-400"
                />
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-[#F9A307]">
                    {t(
                      "PermintaanAngkut.warningTitleRequiresHalalCertification",
                      {},
                      "Memerlukan Pengiriman Dengan Sertifikasi Halal Logistik"
                    )}
                  </span>
                  <span className="text-[10px] font-medium text-[#000000]">
                    {t(
                      "PermintaanAngkut.warningSubtitleAddCertification",
                      {},
                      "Tambahkan sertifikasi halal dengan menghubungi kami"
                    )}
                    <a
                      href="#"
                      className="ml-1 cursor-pointer font-semibold text-primary-700 hover:text-primary-800"
                    >
                      {t("PermintaanAngkut.linkHere", {}, "disini")}
                    </a>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto bg-white px-4">
            {/* Always show content regardless of suspension status */}
            <RequestList
              requests={data?.requests || []}
              isLoading={isLoading}
              activeTab={activeTab}
              isSuspended={data?.userStatus?.isSuspended}
              onBookmarkToggle={handleBookmarkToggle}
              bookmarkedItems={bookmarkedItems}
              removedItems={removedItems}
              onUnderstand={handleUnderstand}
              onShowDetail={handleShowDetail}
              searchValue={searchValue}
              onAcceptRequest={onAcceptRequest}
              data={data}
            />
          </div>
        </>
      )}
    </div>
  );
};

const RequestList = ({
  requests,
  isLoading,
  activeTab,
  isSuspended = false,
  onBookmarkToggle,
  bookmarkedItems,
  removedItems,
  onUnderstand,
  onShowDetail,
  searchValue,
  onAcceptRequest,
  data,
}) => {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-2 text-neutral-500">
          <IconComponent
            src="/icons/loader-truck-spinner.svg"
            className="h-6 w-6 animate-spin"
          />
          <span className="text-sm font-medium">
            {t(
              "PermintaanAngkut.requestListLoading",
              {},
              "Memuat permintaan..."
            )}
          </span>
        </div>
      </div>
    );
  }

  // Jika tab aktif dan tabCounts untuk tab tersebut bernilai 0, tampilkan DataNotFound
  const tabCountsZero =
    (activeTab === "tersedia" && data?.tabCounts?.tersedia === 0) ||
    (activeTab === "halal_logistik" && data?.tabCounts?.halal_logistik === 0) ||
    (activeTab === "disimpan" && data?.tabCounts?.disimpan === 0);

  if (tabCountsZero) {
    return (
      <div className="mt-[100px] flex-1 overflow-y-auto p-4">
        <DataNotFound className="h-full gap-y-5 pb-10" type="data">
          <div className="text-center">
            <p className="text-base font-semibold text-neutral-600">
              {t(
                "PermintaanAngkut.requestListEmptyTitleDefault",
                {},
                "Oops, belum ada permintaan jasa angkut"
              )}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {t(
                "PermintaanAngkut.requestListEmptySubtitleDefault",
                {},
                "Mohon bersabar untuk menanti permintaan baru"
              )}
            </p>
          </div>
        </DataNotFound>
      </div>
    );
  }
  // ...existing code...

  // Apply tab filter, search filter, and removed items filter
  let filteredRequests = requests.filter(
    (request) => !removedItems.has(request.id)
  );

  // Tab filter (frontend safety, in case API returns more than expected)
  if (activeTab === "halal_logistik") {
    filteredRequests = filteredRequests.filter(
      (request) => request.isHalalLogistics
    );
  } else if (activeTab === "disimpan") {
    filteredRequests = filteredRequests.filter((request) => request.isSaved);
  }

  // Search filter
  if (searchValue && searchValue.trim() !== "") {
    filteredRequests = filteredRequests.filter((request) =>
      request.orderCode.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  // Check if search returned no results
  const hasSearchResults =
    searchValue && searchValue.trim() !== "" && filteredRequests.length === 0;

  // If search yielded no results, show "Keyword Tidak Ditemukan"
  if (hasSearchResults) {
    return (
      <div className="flex h-full items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <IconComponent
            src="/icons/keyword-not-found.svg"
            className="h-[142px] w-[142px] flex-shrink-0"
          />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-[#868686]">
              {t(
                "PermintaanAngkut.requestListSearchNotFound",
                {},
                "Keyword Tidak Ditemukan"
              )}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {filteredRequests.map((request) => {
        // Determine current bookmark state
        const hasStateChanged = bookmarkedItems?.has(request.id);
        const currentBookmarkState = hasStateChanged
          ? !request.isSaved
          : request.isSaved;

        return (
          <TransportRequestCard
            key={request.id}
            request={request}
            isSuspended={isSuspended}
            onBookmarkToggle={onBookmarkToggle}
            isBookmarked={currentBookmarkState}
            onUnderstand={onUnderstand}
            onShowDetail={onShowDetail}
            onAccept={onAcceptRequest}
          />
        );
      })}
    </div>
  );
};

export default PermintaanAngkut;

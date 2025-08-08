"use client";

import { useMemo, useState } from "react";

import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import Search from "@/components/Search/Search";
import { useGetTransportRequestList } from "@/services/Transporter/monitoring/getTransportRequestList";

import PermintaanAngkutDetail from "./PermintaanAngkutDetail";
import TransportRequestCard from "./components/TransportRequestCard";

const PermintaanAngkut = () => {
  const [activeTab, setActiveTab] = useState("tersedia");
  const [searchValue, setSearchValue] = useState("");
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [removedItems, setRemovedItems] = useState(new Set());
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // Get data based on active tab
  const params = useMemo(() => {
    switch (activeTab) {
      case "halal_logistik":
        return { isHalalLogistics: true };
      case "disimpan":
        return { isSaved: true };
      default:
        return {};
    }
  }, [activeTab]);

  const { data, error, isLoading } = useGetTransportRequestList(params);

  const handleSearch = (value) => {
    setSearchValue(value);
    console.log("🔍 Search value:", value);
  };

  const handleBookmarkToggle = (requestId, newSavedState) => {
    const newBookmarkedItems = new Set(bookmarkedItems);

    // Find the original request to check its original saved state
    const originalRequest = data?.requests?.find((req) => req.id === requestId);
    const originalSavedState = originalRequest?.isSaved || false;

    console.log("🔖 Bookmark toggle:", {
      requestId: requestId.slice(-4),
      originalSavedState,
      newSavedState,
      isChangingFromOriginal: newSavedState !== originalSavedState,
    });

    if (newSavedState === originalSavedState) {
      // If new state matches original state, remove from tracking set
      newBookmarkedItems.delete(requestId);
      console.log("🔖 Removed from tracking (back to original)");
    } else {
      // If new state differs from original, track the change
      newBookmarkedItems.add(requestId);
      console.log("🔖 Added to tracking (changed from original)");
    }

    setBookmarkedItems(newBookmarkedItems);
    console.log("🔖 Current bookmarked items count:", newBookmarkedItems.size);
  };

  const handleUnderstand = (requestId) => {
    const newRemovedItems = new Set(removedItems);
    newRemovedItems.add(requestId);
    setRemovedItems(newRemovedItems);

    console.log("🤝 Request understood and removed:", requestId.slice(-4));
    console.log("🤝 Total removed items:", newRemovedItems.size);
  };

  const handleShowDetail = (request) => {
    setSelectedRequest(request);
    setShowDetail(true);
    console.log("📋 Showing detail for:", request.orderCode);
  };

  const handleBackToList = () => {
    setSelectedRequest(null);
    setShowDetail(false);
    console.log("🔙 Back to list");
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

    const allRequests = data.requests;

    // Filter out removed items and apply search filter
    let visibleRequests = allRequests.filter(
      (request) => !removedItems.has(request.id)
    );

    // Apply search filter if search value exists
    if (searchValue && searchValue.trim() !== "") {
      visibleRequests = visibleRequests.filter((request) =>
        request.orderCode.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Calculate saved count based on current bookmark state (only for visible requests)
    let savedCount = 0;
    visibleRequests.forEach((request) => {
      const isOriginallyBookmarked = request.isSaved;
      const hasStateChanged = bookmarkedItems.has(request.id);

      // Determine current bookmark state:
      // If state has changed, use opposite of original
      // If state hasn't changed, use original
      const isCurrentlyBookmarked = hasStateChanged
        ? !isOriginallyBookmarked
        : isOriginallyBookmarked;

      if (isCurrentlyBookmarked) {
        savedCount++;
      }
    });

    return {
      tersedia: visibleRequests.length, // Use visible requests count instead of original tab count
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
                <div className="mb-4 flex items-center gap-1 rounded-xl bg-[#FFECB4] px-3 py-2">
                  <IconComponent
                    src="/icons/warning24.svg"
                    className="h-4 w-4 flex-shrink-0 text-[#FF7A00]"
                  />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-[#FF7A00]">
                      Pengaturan Delegasi Driver Sedang Aktif
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
                  Halal Logistik (
                  <span
                    className={`${
                      shouldAnimate(
                        dynamicTabCounts.halal_logistik,
                        data?.newRequestsCount?.hasAnimation
                      )
                        ? "animate-pulse font-bold text-warning-600"
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
                  Disimpan (
                  <span
                    className={`${
                      dynamicTabCounts.disimpan >= 100
                        ? "font-bold text-error-600" // Special styling for 99+
                        : shouldAnimate(
                              dynamicTabCounts.disimpan,
                              data?.newRequestsCount?.hasAnimation
                            )
                          ? "animate-pulse font-bold text-warning-600"
                          : ""
                    }`}
                  >
                    {formatCounter(dynamicTabCounts.disimpan)}
                  </span>
                  )
                </span>
              </button>
            </div>
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

  // Apply search filter and removed items filter
  const filteredRequests = requests
    .filter((request) => !removedItems.has(request.id)) // Filter removed items
    .filter((request) => {
      // If no search value, show all
      if (!searchValue || searchValue.trim() === "") {
        return true;
      }
      // Filter by orderCode (case insensitive)
      return request.orderCode
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });

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
              Keyword Tidak Ditemukan
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
          />
        );
      })}
    </div>
  );
};

export default PermintaanAngkut;

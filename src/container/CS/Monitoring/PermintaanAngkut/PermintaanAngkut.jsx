"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

// ++ ADDED: useCallback

import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import { NotificationDot } from "@/components/NotificationDot/NotificationDot";
import { ScrollableTabs } from "@/components/ScrollableTabs/ScrollableTabs";
import Search from "@/components/Search/Search";
import { toast } from "@/lib/toast";
import { useGetInactiveTransporter } from "@/services/CS/monitoring/permintaan-angkut/getInactiveTransporter";
import { useGetTransportRequestList } from "@/services/CS/monitoring/permintaan-angkut/getTransportRequestListCS";

import PermintaanAngkutDetailCS from "./PermintaanAngkutDetailCS.jsx";
import ModalTransporterTidakAktif from "./components/ModalTransporterTidakAktif";
import TransportRequestCard from "./components/TransportRequestCard";

// ++ HELPER FUNCTION: Moved filtering logic outside the component for stability
const filterRequests = (requests, searchValue, removedItems) => {
  const trimmedSearch = searchValue.trim();
  if (trimmedSearch.length < 3) {
    return requests.filter((request) => !removedItems.has(request.id));
  }

  const searchTerm = trimmedSearch.toLowerCase();

  return requests
    .filter((request) => !removedItems.has(request.id))
    .filter((request) => {
      const searchableContent = [
        request.orderCode,
        request.shipperInfo?.name,
        request.orderType,
        request.loadTimeStart,
        request.loadTimeEnd,
        request.cargo?.description,
        request.vehicle?.truckType,
        request.vehicle?.carrierType,
        request.pricing?.potentialIncome,
        ...(request.locations?.pickupLocations?.map(
          (loc) => `${loc.fullAddress} ${loc.city} ${loc.district}`
        ) ?? []),
        ...(request.locations?.dropoffLocations?.map(
          (loc) => `${loc.fullAddress} ${loc.city} ${loc.district}`
        ) ?? []),
        ...(request.cargo?.items?.map((item) => item.name) ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(searchTerm);
    });
};

const PermintaanAngkutCS = () => {
  const [showModalTransporterTidakAktif, setShowModalTransporterTidakAktif] =
    useState(false);
  const [activeTab, setActiveTab] = useState("semua");
  const [searchValue, setSearchValue] = useState("");
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [removedItems, setRemovedItems] = useState(new Set());
  const [selectedRequest, setSelectedRequest] = useState(null);

  const params = useMemo(() => {
    switch (activeTab) {
      case "semua":
        return {};
      case "instan":
        return { orderType: "INSTANT" };
      case "terjadwal":
        return { orderType: "SCHEDULED" };
      case "halal_logistik":
        return { isHalalLogistics: true };
      case "disimpan":
        return { isSaved: true };
      default:
        return {};
    }
  }, [activeTab]);

  // FIXED: 'error' variable was removed as it was unused.
  const { data, isLoading } = useGetTransportRequestList(params);
  const { data: inactiveAlertData } = useGetInactiveTransporter();

  const handleSearch = (value) => {
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0 || trimmedValue.length >= 3) {
      setSearchValue(value);
    } else {
      toast.info("Masukkan minimal 3 karakter untuk melakukan pencarian.");
    }
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchValue("");
  };

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

  const handleBackToList = () => {
    setSelectedRequest(null);
  };

  const handleShowDetail = (request) => {
    setSelectedRequest(request);
  };

  // FIXED: Inlined logic from getDynamicTabCounts to resolve the exhaustive-deps warning.
  const dynamicTabCounts = useMemo(() => {
    const requestsToCount = data?.requests || [];

    const filteredForCount =
      searchValue.trim().length >= 3
        ? filterRequests(requestsToCount, searchValue, removedItems)
        : requestsToCount;

    const allCount = filteredForCount.length;
    const instantCount = filteredForCount.filter(
      (req) => req.orderType === "INSTANT"
    ).length;
    const scheduledCount = filteredForCount.filter(
      (req) => req.orderType === "SCHEDULED"
    ).length;
    const halalCount = filteredForCount.filter(
      (req) => req.isHalalLogistics
    ).length;

    return {
      all: allCount,
      instant: instantCount,
      scheduled: scheduledCount,
      halal: halalCount,
      hasArrow:
        allCount > 9 ||
        instantCount > 9 ||
        scheduledCount > 9 ||
        halalCount > 9,
    };
  }, [data?.requests, searchValue, removedItems]);

  // REMOVED: Unused functions 'formatCounter' and 'shouldAnimate'.

  useEffect(() => {
    toast.success("Pesanan ORDER123 telah diambil oleh PT Transporter ABC");
    toast.success("Pesanan ORDER123 telah diambil oleh PT Transporter ABC");
    toast.success("Pesanan ORDER123 telah diambil oleh PT Transporter ABC");
    toast.success("Pesanan ORDER123 telah diambil oleh PT Transporter ABC");
    toast.success("Pesanan ORDER123 telah diambil oleh PT Transporter ABC");
    toast.success("Pesanan ORDER123 telah diambil oleh PT Transporter ABC");
  }, []);

  if (selectedRequest) {
    return (
      <PermintaanAngkutDetailCS
        request={selectedRequest}
        onBack={handleBackToList}
        onUnderstand={handleUnderstand}
      />
    );
  }

  return (
    <div className="flex h-[calc(100vh-92px-48px)] flex-col bg-white">
      <>
        {/* Fixed Header - Search Input and Tabs */}
        <div className="flex-shrink-0 bg-white px-4 py-6">
          <div className="mb-4 flex justify-between">
            <h1 className="text-base font-bold text-neutral-900">
              Permintaan Jasa Angkut
            </h1>
            {inactiveAlertData?.alertSummary?.hasAlert && (
              <div
                className="flex cursor-pointer items-center text-xs font-medium text-primary-600"
                onClick={() => setShowModalTransporterTidakAktif(true)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter")
                    setShowModalTransporterTidakAktif(true);
                }}
              >
                Transporter Tidak Aktif
                <NotificationDot size="md" color="red" className="-top-1" />
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <Search
              placeholder="Cari Permintaan Jasa Angkut"
              onSearch={handleSearch}
              autoSearch={false}
              value={searchValue}
              disabled={data?.userStatus?.isSuspended}
              inputClassName="w-full"
            />
          </div>

          {/* Tabs */}
          <ScrollableTabs
            className="h-7 w-auto max-w-[450px] gap-2"
            dependencies={[dynamicTabCounts, activeTab]}
            hasArrow={dynamicTabCounts.hasArrow}
          >
            <button
              onClick={() => handleTabChange("semua")}
              className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-2 text-[10px] font-semibold transition-colors ${
                activeTab === "semua"
                  ? "w-auto min-w-[79px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
                  : "w-auto min-w-[79px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
              }`}
            >
              <span className="relative whitespace-nowrap">
                Semua ({data?.tabCounters?.all ?? 0})
              </span>
            </button>

            <button
              onClick={() => handleTabChange("instan")}
              className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-2 text-[10px] font-semibold transition-colors ${
                activeTab === "instan"
                  ? "w-auto min-w-[79px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
                  : "w-auto min-w-[79px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
              }`}
            >
              <span className="relative whitespace-nowrap">
                Instan ({data?.tabCounters?.instant ?? 0})
              </span>
            </button>

            <button
              onClick={() => handleTabChange("terjadwal")}
              className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-2 text-[10px] font-semibold transition-colors ${
                activeTab === "terjadwal"
                  ? "w-auto min-w-[79px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
                  : "w-auto min-w-[79px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
              }`}
            >
              <span className="relative whitespace-nowrap">
                Terjadwal ({data?.tabCounters?.scheduled ?? 0})
              </span>
            </button>

            <button
              onClick={() => handleTabChange("halal_logistik")}
              className={`flex h-full items-center justify-center gap-1 rounded-full border px-3 py-2 text-[10px] font-semibold transition-colors ${
                activeTab === "halal_logistik"
                  ? "w-auto min-w-[124px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
                  : "w-auto min-w-[124px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
              }`}
            >
              <IconComponent
                src="/icons/halal.svg"
                className="h-4 w-4 flex-shrink-0"
              />
              <span className="relative whitespace-nowrap">
                Halal Logistik ({data?.tabCounters?.halal ?? 0})
              </span>
            </button>
          </ScrollableTabs>
        </div>

        {/* Scrollable Content Area */}
        <div className="mx-2 flex-1 overflow-y-auto bg-white px-2">
          <RequestList
            requests={data?.requests || []}
            isLoading={isLoading}
            isSuspended={data?.userStatus?.isSuspended}
            onBookmarkToggle={handleBookmarkToggle}
            bookmarkedItems={bookmarkedItems}
            removedItems={removedItems}
            onUnderstand={handleUnderstand}
            searchValue={searchValue}
            onShowDetail={handleShowDetail}
          />
          {showModalTransporterTidakAktif && (
            <ModalTransporterTidakAktif
              onClose={() => setShowModalTransporterTidakAktif(false)}
            />
          )}
        </div>
      </>
    </div>
  );
};

const RequestList = ({
  requests,
  isLoading,
  // REMOVED: 'activeTab' prop was unused.
  isSuspended = false,
  onBookmarkToggle,
  bookmarkedItems,
  removedItems,
  onUnderstand,
  searchValue,
  onShowDetail,
}) => {
  // FIXED: Moved useMemo to the top of the component before any conditional returns.
  const filteredRequests = useMemo(
    () => filterRequests(requests, searchValue, removedItems),
    [requests, searchValue, removedItems]
  );

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
    return (
      <div className="mt-[100px] flex-1 overflow-y-auto p-4">
        <DataNotFound className="h-full gap-y-5 pb-10" type="data">
          <div className="text-center">
            <p className="text-base font-semibold text-neutral-600">
              Oops, belum ada permintaan jasa angkut
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Belum ada shipper yang membuat permintaan jasa angkut{" "}
            </p>
          </div>
        </DataNotFound>
      </div>
    );
  }

  const hasSearchResults =
    searchValue && searchValue.trim() !== "" && filteredRequests.length === 0;

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

export default PermintaanAngkutCS;

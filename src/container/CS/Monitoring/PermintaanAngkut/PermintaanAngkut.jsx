"use client";

import { useCallback, useMemo, useState } from "react";

// Service (Hook) Imports
import { useGetInactiveTransporter } from "@/services/CS/monitoring/permintaan-angkut/getInactiveTransporter";
import { useGetTransportRequestList } from "@/services/CS/monitoring/permintaan-angkut/getTransportRequestListCS";

// Component Imports
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import { NotificationDot } from "@/components/NotificationDot/NotificationDot";
import { ScrollableTabs } from "@/components/ScrollableTabs/ScrollableTabs";
import Search from "@/components/Search/Search";

import { useTranslation } from "@/hooks/use-translation";

import { toast } from "@/lib/toast";

// View & Child Component Imports
import PermintaanAngkutDetailCS from "./PermintaanAngkutDetailCS.jsx";
import ModalTransporterTidakAktif from "./components/ModalTransporterTidakAktif";
import TransportRequestCard from "./components/TransportRequestCard";

// --- Helper Functions ---
// Helper for filtering requests based on search input.
const filterRequests = (requests, searchValue, removedItems) => {
  const trimmedSearch = searchValue.trim().toLowerCase();

  // Always filter out removed items
  const availableRequests = requests.filter(
    (request) => !removedItems.has(request.id)
  );

  // Return early if search is too short
  if (trimmedSearch.length < 3) {
    return availableRequests;
  }

  return availableRequests.filter((request) => {
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

    return searchableContent.includes(trimmedSearch);
  });
};

// --- Main Component ---
const PermintaanAngkutCS = () => {
  const { t } = useTranslation();

  // --- Constants ---
  // Using a config object makes it easier to manage tabs and avoids repetition.
  const TABS_CONFIG = useMemo(
    () => [
      {
        id: "semua",
        labelKey: "permintaanAngkutCS.tabAll",
        fallback: "Semua",
        params: {},
        key: "all",
      },
      {
        id: "instan",
        labelKey: "permintaanAngkutCS.tabInstant",
        fallback: "Instan",
        params: { orderType: "INSTANT" },
        key: "instant",
      },
      {
        id: "terjadwal",
        labelKey: "permintaanAngkutCS.tabScheduled",
        fallback: "Terjadwal",
        params: { orderType: "SCHEDULED" },
        key: "scheduled",
      },
      {
        id: "halal_logistik",
        labelKey: "permintaanAngkutCS.tabHalalLogistics",
        fallback: "Halal Logistik",
        params: { isHalalLogistics: true },
        icon: "/icons/halal.svg",
        key: "halal",
      },
    ],
    [] // This is fine as the config is static
  );

  const [showModalTransporterTidakAktif, setShowModalTransporterTidakAktif] =
    useState(false);
  const [activeTab, setActiveTab] = useState("semua");
  const [searchValue, setSearchValue] = useState("");
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [removedItems, setRemovedItems] = useState(new Set());
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Memoize API parameters based on the active tab config.
  const params = useMemo(() => {
    return TABS_CONFIG.find((tab) => tab.id === activeTab)?.params || {};
  }, [activeTab, TABS_CONFIG]);

  const { data, isLoading } = useGetTransportRequestList(params);
  const { data: inactiveAlertData } = useGetInactiveTransporter();

  const handleSearch = useCallback(
    (value) => {
      const trimmedValue = value.trim();
      if (trimmedValue.length === 0 || trimmedValue.length >= 3) {
        setSearchValue(value);
      } else {
        toast.info(
          t(
            "permintaanAngkutCS.toastInfoSearchMinChars",
            {},
            "Masukkan minimal 3 karakter untuk melakukan pencarian."
          )
        );
      }
    },
    [t]
  );

  const handleTabChange = useCallback((tabName) => {
    setActiveTab(tabName);
    setSearchValue(""); // Reset search on tab change
  }, []);

  const handleBookmarkToggle = useCallback(
    (requestId, newSavedState) => {
      setBookmarkedItems((prevBookmarked) => {
        const newBookmarked = new Set(prevBookmarked);
        const originalRequest = data?.requests?.find(
          (req) => req.id === requestId
        );
        const originalSavedState = originalRequest?.isSaved || false;

        // Toggle logic: if the new state is different from original, track it.
        // If it's the same, stop tracking it.
        if (newSavedState === originalSavedState) {
          newBookmarked.delete(requestId);
        } else {
          newBookmarked.add(requestId);
        }
        return newBookmarked;
      });
    },
    [data?.requests]
  );

  const handleUnderstand = useCallback((requestId) => {
    setRemovedItems((prevRemoved) => {
      const newRemoved = new Set(prevRemoved);
      newRemoved.add(requestId);
      return newRemoved;
    });
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedRequest(null);
  }, []);

  const handleShowDetail = useCallback((request) => {
    setSelectedRequest(request);
  }, []);

  const openInactiveTransporterModal = useCallback(() => {
    setShowModalTransporterTidakAktif(true);
  }, []);

  // Display detail view if a request is selected
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
      {/* Fixed Header - Search Input and Tabs */}
      <div className="flex-shrink-0 bg-white px-4 py-6">
        <div className="mb-4 flex justify-between">
          <h1 className="text-base font-bold text-neutral-900">
            {t(
              "permintaanAngkutCS.titlePageHeader",
              {},
              "Permintaan Jasa Angkut"
            )}
          </h1>
          {inactiveAlertData?.alertSummary?.hasAlert && (
            <button
              className="flex cursor-pointer items-center text-xs font-medium text-primary-600"
              onClick={openInactiveTransporterModal}
            >
              {t(
                "permintaanAngkutCS.buttonInactiveTransporter",
                {},
                "Transporter Tidak Aktif"
              )}
              <NotificationDot size="md" color="red" className="-top-1" />
            </button>
          )}
        </div>

        <div className="mb-4">
          <Search
            placeholder={t(
              "permintaanAngkutCS.placeholderSearchRequest",
              {},
              "Cari Permintaan Jasa Angkut"
            )}
            onSearch={handleSearch}
            autoSearch={false}
            value={searchValue}
            disabled={data?.userStatus?.isSuspended}
            inputClassName="w-full"
          />
        </div>

        <ScrollableTabs
          className="h-7 w-auto max-w-[450px] gap-2"
          dependencies={[data?.tabCounters, activeTab]}
          hasArrow={Object.values(data?.tabCounters ?? {}).some(
            (count) => count > 9
          )}
        >
          {TABS_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-2 text-[10px] font-semibold transition-colors ${
                activeTab === tab.id
                  ? "border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
                  : "border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
              }`}
            >
              {tab.icon && (
                <IconComponent
                  src={tab.icon}
                  className="h-4 w-4 flex-shrink-0"
                />
              )}
              <span className="relative whitespace-nowrap">
                {t(tab.labelKey, {}, tab.fallback)} (
                {data?.tabCounters?.[tab.key] ?? 0})
              </span>
            </button>
          ))}
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
    </div>
  );
};

// --- Child: Request List Component ---
const RequestList = ({
  requests,
  isLoading,
  isSuspended = false,
  onBookmarkToggle,
  bookmarkedItems,
  removedItems,
  onUnderstand,
  searchValue,
  onShowDetail,
}) => {
  const { t } = useTranslation();

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
          <span className="text-sm font-medium">
            {t(
              "permintaanAngkutCS.textLoadingRequests",
              {},
              "Memuat permintaan..."
            )}
          </span>
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
              {t(
                "permintaanAngkutCS.textNoRequestsTitle",
                {},
                "Oops, belum ada permintaan jasa angkut"
              )}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {t(
                "permintaanAngkutCS.textNoRequestsSubtitle",
                {},
                "Belum ada shipper yang membuat permintaan jasa angkut"
              )}
            </p>
          </div>
        </DataNotFound>
      </div>
    );
  }

  const isSearching = searchValue && searchValue.trim().length >= 3;
  if (isSearching && filteredRequests.length === 0) {
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
                "permintaanAngkutCS.textKeywordNotFound",
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
        // Determine the final bookmark state based on original data and local changes.
        const hasLocalChange = bookmarkedItems.has(request.id);
        const isBookmarked = hasLocalChange
          ? !request.isSaved
          : request.isSaved;

        return (
          <TransportRequestCard
            key={request.id}
            request={request}
            isSuspended={isSuspended}
            onBookmarkToggle={onBookmarkToggle}
            isBookmarked={isBookmarked}
            onUnderstand={onUnderstand}
            onShowDetail={onShowDetail}
          />
        );
      })}
    </div>
  );
};

export default PermintaanAngkutCS;

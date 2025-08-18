"use client";

import { useEffect, useMemo, useState } from "react";

import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import { NotificationDot } from "@/components/NotificationDot/NotificationDot";
import Search from "@/components/Search/Search";
import { toast } from "@/lib/toast";
import { useGetInactiveTransporter } from "@/services/CS/monitoring/permintaan-angkut/getInactiveTransporter";
import { useGetTransportRequestList } from "@/services/CS/monitoring/permintaan-angkut/getTransportRequestListCS";

import PermintaanAngkutDetailCS from "./PermintaanAngkutDetailCS.jsx";
import ModalTransporterTidakAktif from "./components/ModalTransporterTidakAktif";
import TransportRequestCard from "./components/TransportRequestCard";

const PermintaanAngkutCS = () => {
  const [showModalTransporterTidakAktif, setShowModalTransporterTidakAktif] =
    useState(false);
  const [activeTab, setActiveTab] = useState("semua");
  const [searchValue, setSearchValue] = useState("");
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [removedItems, setRemovedItems] = useState(new Set());
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Get data based on active tab
  const params = useMemo(() => {
    switch (activeTab) {
      case "semua":
        return {}; // Show all requests
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

  const { data, error, isLoading } = useGetTransportRequestList(params);
  const { data: inactiveAlertData } = useGetInactiveTransporter();

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

  const handleBackToList = () => {
    setSelectedRequest(null);
  };

  const handleShowDetail = (request) => {
    setSelectedRequest(request);
  };

  // Calculate dynamic tab counts based on data and local state
  const getDynamicTabCounts = () => {
    // Use tabCounters from mock data
    if (!data?.requests) {
      return {
        all: data?.tabCounters?.all ?? 0,
        instant: data?.tabCounters?.instant ?? 0,
        scheduled: data?.tabCounters?.scheduled ?? 0,
        halal: data?.tabCounters?.halal ?? 0,
      };
    }

    // Kalau tidak ada search, langsung pakai tabCounters asli
    if (!searchValue || searchValue.trim() === "") {
      return {
        all: data?.tabCounters?.all ?? 0,
        instant: data?.tabCounters?.instant ?? 0,
        scheduled: data?.tabCounters?.scheduled ?? 0,
        halal: data?.tabCounters?.halal ?? 0,
      };
    }

    // Kalau ada search, hitung ulang berdasarkan data yang terlihat
    const visibleRequests = data.requests.filter(
      (request) =>
        !removedItems.has(request.id) &&
        request.orderCode.toLowerCase().includes(searchValue.toLowerCase())
    );

    return {
      all: visibleRequests.length,
      instant: visibleRequests.filter((req) => req.orderType === "INSTANT")
        .length,
      scheduled: visibleRequests.filter((req) => req.orderType === "SCHEDULED")
        .length,
      halal: visibleRequests.filter((req) => req.isHalalLogistics).length,
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

  // Show toast on every page refresh (mount)
  useEffect(() => {
    toast.success("Pesanan ORDER123 telah diambil oleh PT Transporter ABC");
    toast.success("Pesanan ORDER123 telah diambil oleh PT Transporter ABC");
    toast.success("Pesanan ORDER123 telah diambil oleh PT Transporter ABC");
    toast.success("Pesanan ORDER123 telah diambil oleh PT Transporter ABC");
    toast.success("Pesanan ORDER123 telah diambil oleh PT Transporter ABC");
    toast.success("Pesanan ORDER123 telah diambil oleh PT Transporter ABC");
  }, []);

  // WebSocket for realtime transporter take order alert (disabled until API ready)
  // useEffect(() => {
  //   const ws = new WebSocket("wss://your-api-domain/v1/ws/cs/alert-transporter-take-order");
  //   ws.onmessage = (event) => {
  //     try {
  //       const [type, payload] = JSON.parse(event.data);
  //       if (type === "alert-transporter-take-order" && payload?.orderCode && payload?.transporterName) {
  //         toast.success(`Pesanan ${payload.orderCode} telah diambil oleh ${payload.transporterName}`);
  //         // Optionally update local state/UI here
  //       }
  //     } catch (err) {
  //       // handle error
  //     }
  //   };
  //   return () => ws.close();
  // }, []);

  // If a request is selected, show detail view
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
              <p
                className="flex cursor-pointer items-center text-xs font-medium text-primary-600"
                onClick={() => setShowModalTransporterTidakAktif(true)}
              >
                Transporter Tidak Aktif
                <NotificationDot size="md" color="red" className="-top-1" />
              </p>
            )}
          </div>

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
              placeholder="Cari Permintaan Jasa Angkut"
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
              onClick={() => setActiveTab("semua")}
              className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
                activeTab === "semua"
                  ? "w-auto min-w-[79px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
                  : "w-auto min-w-[79px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
              }`}
            >
              <span className="relative whitespace-nowrap">
                Semua (
                <span
                  className={`$${
                    shouldAnimate(
                      dynamicTabCounts.all,
                      data?.newRequestsCount?.hasAnimation
                    )
                      ? "font-base animate-semibold"
                      : ""
                  }`}
                >
                  {formatCounter(dynamicTabCounts.all)}
                </span>
                )
                {data?.tabCounters?.hasBlinkNode && (
                  <NotificationDot
                    position="absolute"
                    positionClasses="-right-3 -top-1.5"
                    animated={true}
                    size="md"
                    color="red"
                  />
                )}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("instan")}
              className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
                activeTab === "instan"
                  ? "w-auto min-w-[79px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
                  : "w-auto min-w-[79px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
              }`}
            >
              <span className="relative whitespace-nowrap">
                Instan (
                <span
                  className={`$${
                    shouldAnimate(
                      dynamicTabCounts.instant,
                      data?.newRequestsCount?.hasAnimation
                    )
                      ? "font-base animate-semibold"
                      : ""
                  }`}
                >
                  {formatCounter(dynamicTabCounts.instant)}
                </span>
                )
                {data?.tabCounters?.hasBlinkNode && (
                  <NotificationDot
                    position="absolute"
                    positionClasses="-right-3 -top-1.5"
                    animated={true}
                    size="md"
                    color="red"
                  />
                )}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("terjadwal")}
              className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
                activeTab === "terjadwal"
                  ? "w-auto min-w-[79px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
                  : "w-auto min-w-[79px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
              }`}
            >
              <span className="relative whitespace-nowrap">
                Terjadwal (
                <span
                  className={`$${
                    shouldAnimate(
                      dynamicTabCounts.scheduled,
                      data?.newRequestsCount?.hasAnimation
                    )
                      ? "font-base animate-semibold"
                      : ""
                  }`}
                >
                  {formatCounter(dynamicTabCounts.scheduled)}
                </span>
                )
                {data?.tabCounters?.hasBlinkNode && (
                  <NotificationDot
                    position="absolute"
                    positionClasses="-right-3 -top-1.5"
                    animated={true}
                    size="md"
                    color="red"
                  />
                )}
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
              <span className="relative whitespace-nowrap">
                Halal Logistik (
                <span
                  className={`$${
                    shouldAnimate(
                      dynamicTabCounts.halal,
                      data?.newRequestsCount?.hasAnimation
                    )
                      ? "font-base animate-semibold"
                      : ""
                  }`}
                >
                  {formatCounter(dynamicTabCounts.halal)}
                </span>
                )
                {data?.tabCounters?.hasBlinkNode && (
                  <NotificationDot
                    position="absolute"
                    positionClasses="-right-3 -top-1.5"
                    animated={true}
                    size="md"
                    color="red"
                  />
                )}
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
  activeTab,
  isSuspended = false,
  onBookmarkToggle,
  bookmarkedItems,
  removedItems,
  onUnderstand,
  searchValue,
  onShowDetail,
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
            subtitle: "Belum ada shipper yang membuat permintaan jasa angkut",
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
            subtitle: "Belum ada shipper yang membuat permintaan jasa angkut",
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
              Belum ada shipper yang membuat permintaan jasa angkut{" "}
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

export default PermintaanAngkutCS;

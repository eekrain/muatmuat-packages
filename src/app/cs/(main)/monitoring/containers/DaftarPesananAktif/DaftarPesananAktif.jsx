"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { FilterSelect } from "@/components/Form/FilterSelect";
import IconComponent from "@/components/IconComponent/IconComponent";
import Search from "@/components/Search/Search";
import AssignArmadaModal from "@/container/Shared/OrderModal/AssignArmadaModal";
import BatalkanArmadaModal from "@/container/Shared/OrderModal/BatalkanArmadaModal";
import BatalkanPesananModal from "@/container/Shared/OrderModal/BatalkanPesananModal";
import ConfirmReadyModal from "@/container/Shared/OrderModal/ConfirmReadyModal";
import PilihArmadaBatalkan from "@/container/Shared/OrderModal/PilihArmadaBatalkanModal";
import RespondChangeModal from "@/container/Shared/OrderModal/RespondChangeModal";
import UbahJumlahUnitModal from "@/container/Shared/OrderModal/UbahJumlahUnitModal";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
  transformContactsForHubungiModal,
  useGetOrderContacts,
} from "@/services/CS/active-orders/getOrderContacts";
import { useGetActiveOrdersByOrdersWithParams } from "@/services/CS/daftar-pesanan-active/getActiveOrdersByOrders";
import { useGetActiveOrdersByTransporterWithParams } from "@/services/CS/daftar-pesanan-active/getActiveOrdersByTransporter";
import { useGetCSImportantNotifications } from "@/services/CS/getCSImportantNotifications";
import { useGetActiveOrdersCount } from "@/services/CS/monitoring/daftar-pesanan-active/getActiveOrdersCount";
import { useGetCsActiveOrdersUrgentStatusCounts } from "@/services/CS/monitoring/daftar-pesanan-active/getCsActiveOrdersUrgentStatusCounts";
import { usePutCSImportantNotificationsDismiss } from "@/services/CS/putCSImportantNotificationsDismiss";
import { ORDER_ACTIONS } from "@/utils/Transporter/orderStatus";

import OrderChangeInfoModal from "../../../daftar-pesanan/components/OrderChangeInfoModal";
import AlasanPembatalanArmadaModal from "../../components/AlasanPembatalanArmadaModal";
import LihatArmadaModal from "../../components/LihatArmadaModal";
import Onboarding from "../Onboarding/Onboarding";
import DaftarPesananAktifListItem from "./components/DaftarPesananAktifListItem";
import DaftarPesananAktifListItemByTransporter from "./components/DaftarPesananAktifListItemByTransporter";
import UrgentStatusFilter from "./components/UrgentStatusFilter";

// Mock data for OrderChangeInfoModal
const mockChangeDetails = {
  changeType: "LOCATION_AND_TIME", // Can be "LOCATION_AND_TIME", "TIME_ONLY", "LOCATION_ONLY"
  originalData: {
    loadTimeStart: "2025-01-15T08:00:00Z",
    loadTimeEnd: "2025-01-15T10:00:00Z",
    estimatedDistance: 45000, // 45 km in meters
    locations: [
      {
        locationType: "PICKUP",
        sequence: 1,
        fullAddress: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta",
      },
      {
        locationType: "PICKUP",
        sequence: 2,
        fullAddress: "Jl. Gatot Subroto No. 456, Jakarta Selatan, DKI Jakarta",
      },
      {
        locationType: "DROPOFF",
        sequence: 1,
        fullAddress: "Jl. Ahmad Yani No. 789, Surabaya, Jawa Timur",
      },
    ],
  },
  requestedChanges: {
    loadTimeStart: "2025-01-15T10:00:00Z",
    loadTimeEnd: "2025-01-15T12:00:00Z",
    estimatedDistance: 52000, // 52 km in meters
    locations: [
      {
        locationType: "PICKUP",
        sequence: 1,
        fullAddress: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta",
      },
      {
        locationType: "PICKUP",
        sequence: 2,
        fullAddress: "Jl. MH Thamrin No. 888, Jakarta Pusat, DKI Jakarta", // Changed address
      },
      {
        locationType: "DROPOFF",
        sequence: 1,
        fullAddress: "Jl. Diponegoro No. 321, Malang, Jawa Timur", // Changed address
      },
    ],
  },
  incomeAdjustment: {
    hasAdjustment: true,
    originalAmount: 2500000,
    adjustedAmount: 2750000,
  },
};

const DaftarPesananAktif = ({
  onToggleExpand,
  isExpanded,
  onViewFleetStatus,
  onTrackFleet,
  hasShownOnboarding,
  onOnboardingShown,
}) => {
  const router = useRouter();

  const { data: activeOrdersCount } = useGetActiveOrdersCount();
  const { data: urgentStatusCountsData } =
    useGetCsActiveOrdersUrgentStatusCounts();
  const { data: importantNotification } = useGetCSImportantNotifications(
    `/v1/cs/active-orders/important-notifications`
  );

  const [searchValue, setSearchValue] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState("ALL_STATUS");
  const [selectedGroupBy, setSelectedGroupBy] = useState("BY_PESANAN");
  const [selectedSort, setSelectedSort] = useState("WAKTU_MUAT_TERDEKAT");
  const [openDropdowns, setOpenDropdowns] = useState({});

  // modalState
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [assignArmadaModalOpen, setAssignArmadaModalOpen] = useState(false);
  const [lihatArmadaModalOpen, setLihatArmadaModalOpen] = useState(false);
  const [confirmReadyModalOpen, setConfirmReadyModalOpen] = useState(false);
  const [respondChangeModalOpen, setRespondChangeModalOpen] = useState(false);
  const [batalkanArmadaModalOpen, setBatalkanArmadaModalOpen] = useState(false);
  const [pilihArmadaBatalkanModalOpen, setPilihArmadaBatalkanModalOpen] =
    useState(false);
  const [batalkanPesananModalOpen, setBatalkanPesananModalOpen] =
    useState(false);
  const [ubahJumlahUnitModalOpen, setUbahJumlahUnitModalOpen] = useState(false);
  const [alasanPembatalanArmadaModalOpen, setAlasanPembatalanArmadaModalOpen] =
    useState(false);
  const [selectedFleetsForCancellation, setSelectedFleetsForCancellation] =
    useState([]);
  const [orderChangeInfoModalOpen, setOrderChangeInfoModalOpen] =
    useState(false);
  const [hubungiModalOpen, setHubungiModalOpen] = useState(false);
  const [hubungiModalProps, setHubungiModalProps] = useState({
    showInitialChoice: false,
    contacts: [],
    transporterContacts: [],
    driverContacts: [],
  });
  const [selectedOrderForContacts, setSelectedOrderForContacts] =
    useState(null);
  // Fetch contacts data when orderId is selected
  const { data: contactsData, isLoading: isContactsLoading } =
    useGetOrderContacts(selectedOrderForContacts?.orderId);

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Map filter keys to lowercase status values for API
  const getFilterStatus = () => {
    if (!selectedStatusFilter || selectedStatusFilter === "ALL_STATUS")
      return null;

    const statusMap = {
      NEED_CHANGE_RESPONSE: "need_change_response",
      NEED_CONFIRMATION_READY: "need_confirmation_ready",
      NEED_ASSIGN_VEHICLE: "need_assign_vehicle",
    };
    return statusMap[selectedStatusFilter] || null;
  };

  const { data, isLoading } = useGetActiveOrdersByOrdersWithParams({
    search: searchValue,
    status: getFilterStatus(),
    sort: selectedSort,
  });
  const { data: dataByTransporter } = useGetActiveOrdersByTransporterWithParams(
    {
      search: searchValue,
      status: getFilterStatus(),
      sort: selectedSort,
    }
  );

  const handleOpenFleetModal = (order) => {
    setSelectedOrder(order);
    setPilihArmadaBatalkanModalOpen(true);
  };

  // Handler for confirming armada cancellation with reason
  const handleCancelArmadaWithReason = async (cancellationData) => {
    try {
      // TODO: Implement API call to cancel selected fleets with reason
      // await cancelSelectedFleets({
      //   orderId: cancellationData.order.id,
      //   fleetIds: cancellationData.selectedFleets,
      //   reason: cancellationData.reason
      // });

      // Show success toast notification
      const fleetCount = cancellationData.selectedFleets.length;
      toast.success(
        `Berhasil membatalkan ${fleetCount} armada dari pesanan ${cancellationData.order?.orderCode || cancellationData.order?.orderNumber || ""}`
      );

      // TODO: Refresh data or update state as needed
      // You might want to refetch the orders list here
    } catch {
      // Show error toast
      toast.error("Gagal membatalkan armada. Silakan coba lagi.");
    }
  };

  const handleCancelSelectedFleets = async (cancellationData) => {
    // Open AlasanPembatalanArmadaModal instead of directly calling API
    setSelectedOrder(cancellationData.order);
    setSelectedFleetsForCancellation(cancellationData.selectedFleets);
    setAlasanPembatalanArmadaModalOpen(true);
    setPilihArmadaBatalkanModalOpen(false);
  };

  // Handler for confirming fleet cancellation
  // eslint-disable-next-line no-unused-vars
  const handleCancelFleet = async (order) => {
    try {
      // TODO: Implement API call to cancel fleet assignment
      // console.log("Canceling fleet for order:", order);

      // Example API call (replace with actual service)
      // await cancelFleetAssignment(order.id);

      // Show success toast notification
      const truckCount = order?.truckCount || order?.vehicleCount || 1;
      toast.success(
        `Berhasil membatalkan ${truckCount} armada dari pesanan ${order?.orderCode || order?.orderNumber || ""}`
      );

      // TODO: Refresh data or update state as needed
      // You might want to refetch the orders list here
    } catch {
      // console.error("Error canceling fleet:", error);
      // Show error toast
      toast.error("Gagal membatalkan armada. Silakan coba lagi.");
    }
  };

  // Handler for opening alasan pembatalan modal
  const handleOpenAlasanModal = (order) => {
    // Directly cancel the order without going to AlasanPembatalanModal
    handleCancelOrderDirectly(order);
  };

  // Handler for confirming order cancellation directly
  const handleCancelOrderDirectly = async (order) => {
    try {
      // TODO: Implement API call to cancel order
      // await cancelOrder({
      //   orderId: order.id
      // });

      // Show success toast notification
      toast.success(
        `Berhasil membatalkan pesanan ${order?.orderCode || order?.orderNumber || ""}`
      );

      // TODO: Refresh data or update state as needed
      // You might want to refetch the orders list here
    } catch {
      // Show error toast
      toast.error("Gagal membatalkan pesanan. Silakan coba lagi.");
    }
  };

  // Handler for confirming unit count change
  const handleChangeUnitCount = async (changeData) => {
    try {
      // TODO: Implement API call to change unit count
      // console.log("Changing unit count for order:", changeData);

      // Example API call (replace with actual service)
      // await changeUnitCount({
      //   orderId: changeData.orderData.id,
      //   newUnitCount: changeData.newUnitCount,
      //   reason: changeData.reason,
      //   supportingFiles: changeData.supportingFiles
      // });

      // Show success toast notification
      toast.success(
        `Berhasil melakukan perubahan jumlah unit pesanan ${changeData.orderData?.orderCode || changeData.orderData?.orderNumber || ""}`
      );

      // Open AssignArmadaModal after successful unit count change
      setSelectedOrder({
        ...changeData.orderData,
        truckCount: changeData.newUnitCount, // Update with new unit count
      });
      setAssignArmadaModalOpen(true);

      // TODO: Refresh data or update state as needed
      // You might want to refetch the orders list here
    } catch {
      // console.error("Error changing unit count:", error);
      // Show error toast
      toast.error("Gagal mengubah jumlah unit. Silakan coba lagi.");
    }
  };

  // Handle action button clicks based on action type
  const handleActionClick = (actionType, row) => {
    switch (actionType) {
      case ORDER_ACTIONS.TRACK_FLEET.type:
        onTrackFleet?.(row);
        break;
      case ORDER_ACTIONS.VIEW_FLEET.type:
        setSelectedOrder(row);
        setLihatArmadaModalOpen(true);
        setOpenDropdowns((prev) => ({ ...prev, [row.id]: false }));
        break;
      case ORDER_ACTIONS.VIEW_ORDER_DETAIL.type:
        // Navigate to order detail
        if (row.sosUnit > 0) {
          router.push(`/monitoring/riwayat-sos/${row.orderId}/detail-pesanan`);
          break;
        }
        router.push(
          `/monitoring/daftar-pesanan-aktif/${row.orderId}/detail-pesanan`
        );
        break;
      case ORDER_ACTIONS.DETAIL_ARMADA.type:
        // console.log("Detail Armada", row);
        break;
      case ORDER_ACTIONS.CANCEL_ORDER.type:
        setSelectedOrder(row);
        setBatalkanPesananModalOpen(true);
        setOpenDropdowns((prev) => ({ ...prev, [row.id]: false }));
        break;
      case ORDER_ACTIONS.ASSIGN_FLEET.type:
        setSelectedOrder(row);
        setAssignArmadaModalOpen(true);
        break;
      case ORDER_ACTIONS.CHANGE_UNIT_COUNT.type:
        setSelectedOrder(row);
        setUbahJumlahUnitModalOpen(true);
        setOpenDropdowns((prev) => ({ ...prev, [row.id]: false }));
        break;
      case ORDER_ACTIONS.RESPOND_CHANGE.type:
        // Open OrderChangeInfoModal to show change details
        setOrderChangeInfoModalOpen(true);
        setOpenDropdowns((prev) => ({ ...prev, [row.id]: false }));
        break;
      case ORDER_ACTIONS.CANCEL_FLEET.type:
        setSelectedOrder(row);
        setBatalkanArmadaModalOpen(true);
        setOpenDropdowns((prev) => ({ ...prev, [row.id]: false }));
        break;
      case ORDER_ACTIONS.CONFIRM_READY.type:
        setSelectedOrder(row);
        setConfirmReadyModalOpen(true);
        setOpenDropdowns((prev) => ({ ...prev, [row.id]: false }));
        break;
      default:
        // Unknown action
        break;
    }
  };

  const orders = data?.Data?.orders || [];
  const ordersByTransporters = dataByTransporter?.Data?.transporters || [];
  const totalActiveOrders = activeOrdersCount?.totalActiveOrders || 0;
  // Build availableStatuses expected by UrgentStatusFilter from the urgent-status-counts API
  const availableStatusesFromUrgent = (() => {
    const statusCounts = urgentStatusCountsData?.Data?.statusCounts || [];
    const findItem = (key) =>
      statusCounts.find((s) => s.status === key) || null;
    const toNumber = (v) => (typeof v === "number" ? v : Number(v) || 0);

    const assignItem = findItem("assign_armada");
    const confirmItem = findItem("konfirmasi_siap");
    const changeItem = findItem("respon_perubahan");

    const totalNeedAssignVehicle = toNumber(assignItem?.count);
    const totalNeedConfirmationReady = toNumber(confirmItem?.count);
    const totalNeedChangeResponse = toNumber(changeItem?.count);

    const total =
      totalNeedAssignVehicle +
      totalNeedConfirmationReady +
      totalNeedChangeResponse;

    // Separation of concerns:
    // - hasNeed* controls whether the option appears (based on count > 0)
    // - *IsUrgent controls whether the red dot should be shown (from API isUrgent)
    const assignIsUrgent = !!assignItem?.isUrgent;
    const confirmIsUrgent = !!confirmItem?.isUrgent;
    const changeIsUrgent = !!changeItem?.isUrgent;

    const hasNeedAssignVehicle = totalNeedAssignVehicle > 0;
    const hasNeedConfirmationReady = totalNeedConfirmationReady > 0;
    const hasNeedChangeResponse = totalNeedChangeResponse > 0;

    return {
      totalNeedAssignVehicle,
      totalNeedConfirmationReady,
      totalNeedChangeResponse,
      hasNeedAssignVehicle,
      hasNeedConfirmationReady,
      hasNeedChangeResponse,
      assignIsUrgent,
      confirmIsUrgent,
      changeIsUrgent,
      totalCount: urgentStatusCountsData?.Data?.totalUrgentCount ?? total,
    };
  })();

  // Prefer urgent-based statuses when available, otherwise fall back to activeOrdersCount availableStatuses
  const availableStatuses =
    (urgentStatusCountsData && availableStatusesFromUrgent) ||
    activeOrdersCount?.availableStatuses ||
    {};

  // Dropdown options

  const groupByOptions = [
    { value: "BY_PESANAN", label: "By Pesanan" },
    { value: "BY_TRANSPORTER", label: "By Transporter" },
  ];

  const sortOptions = [
    { value: "WAKTU_MUAT_TERDEKAT", label: "Waktu Muat Terdekat" },
    { value: "WAKTU_MUAT_TERLAMA", label: "Waktu Muat Terlama" },
    { value: "NO_PESANAN_AZ", label: "No. Pesanan (A-Z, 9-0)" },
    { value: "NO_PESANAN_ZA", label: "No. Pesanan (Z-A, 0-9)" },
  ];

  // Get selected status count for notification dot

  const isOrderZero = orders.length === 0;

  // Determine different empty states
  const isFirstTimer = totalActiveOrders === 0; // No data at all in database
  const hasSearchQuery = searchValue.trim() !== "";
  const hasActiveFilter = selectedStatusFilter !== "ALL_STATUS";
  const isSearchNotFound = hasSearchQuery && isOrderZero && !isFirstTimer;
  const isFilterNotFound =
    hasActiveFilter && isOrderZero && !isFirstTimer && !hasSearchQuery;

  // Show header controls only if not first timer
  const shouldShowControls = !isFirstTimer;

  useEffect(() => {
    if (
      importantNotification &&
      importantNotification.Data &&
      !importantNotification.Data.isRead
    ) {
      setIsAlertOpen(true);
    }
  }, [importantNotification]);

  // SWR mutation hook to dismiss important notification
  const { trigger: triggerDismissNotification } =
    usePutCSImportantNotificationsDismiss(
      importantNotification?.Data?.notificationId
    );

  const handleDismissAlert = async () => {
    setIsAlertOpen(false);
    try {
      // Call the API to mark notification as READ
      await triggerDismissNotification?.({ action: "READ" });
    } catch {
      setIsAlertOpen(true);
      toast.error("Gagal menandai notifikasi sebagai dibaca");
    }
  };

  // Open HubungiModal helper — caller should supply order data for contact fetching
  const openHubungiModal = (orderData) => {
    if (!orderData || !orderData.orderId) {
      toast.error("Order data atau orderId diperlukan untuk membuka kontak");
      return;
    }

    // Set the selected order to trigger API call
    setSelectedOrderForContacts(orderData);
    setHubungiModalOpen(true);
  };

  const closeHubungiModal = () => {
    setHubungiModalOpen(false);
    setSelectedOrderForContacts(null);
    setHubungiModalProps({
      showInitialChoice: false,
      contacts: [],
      transporterContacts: [],
      driverContacts: [],
    });
  };

  // Update modal props when contacts data is loaded
  useEffect(() => {
    if (contactsData && hubungiModalOpen) {
      const transformedContacts =
        transformContactsForHubungiModal(contactsData);
      if (transformedContacts) {
        setHubungiModalProps({
          showInitialChoice: false,
          contacts: transformedContacts,
          transporterContacts: [],
          driverContacts: [],
        });
      }
    }
  }, [contactsData, hubungiModalOpen]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="flex items-center gap-2">
          <h3 className="w-[80px] text-xs font-bold">Daftar Pesanan Aktif</h3>
          <Onboarding
            hasShownOnboarding={hasShownOnboarding}
            onOnboardingShown={onOnboardingShown}
          />
        </div>
        {shouldShowControls && (
          <div className="flex w-full items-center gap-4">
            {/* Filter Dropdowns */}
            <div className="flex w-full flex-1 items-center gap-3">
              {/* Status Urgent Dropdown */}
              <div className="relative">
                <div className="relative">
                  <UrgentStatusFilter
                    availableStatuses={availableStatuses}
                    value={selectedStatusFilter}
                    onChange={setSelectedStatusFilter}
                    disabled={isSearchNotFound}
                    onFocus={() => {
                      if (!isExpanded) {
                        onToggleExpand();
                      }
                    }}
                  />
                </div>
              </div>

              {/* Group By Dropdown */}
              <FilterSelect
                value={selectedGroupBy}
                onChange={setSelectedGroupBy}
                placeholder="By Pesanan"
                options={groupByOptions}
                icon="/icons/tabel.svg"
                className="max-w-[148px] hover:border-primary-700"
                itemClassName="hover:bg-neutral-100"
                disabled={isSearchNotFound}
                onFocus={() => {
                  if (!isExpanded) {
                    onToggleExpand();
                  }
                }}
              />

              {/* Sort Dropdown */}
              <FilterSelect
                value={selectedSort}
                onChange={setSelectedSort}
                className="max-w-[136px] hover:border-primary-700"
                itemClassName="hover:bg-neutral-100  !bg-none"
                options={sortOptions}
                icon="/icons/sorting16.svg"
                disabled={isSearchNotFound}
                onFocus={() => {
                  if (!isExpanded) {
                    onToggleExpand();
                  }
                }}
              />
            </div>

            <Search
              placeholder="Cari Pesanan"
              onSearch={(value) => {
                setSearchValue(value);
              }}
              onFocus={() => {
                if (!isExpanded) {
                  onToggleExpand();
                }
              }}
              containerClassName="h-8 w-[180px]"
              inputClassName="text-xs"
              disabled={isFilterNotFound || totalActiveOrders === 0}
            />
            <button
              onClick={onToggleExpand}
              className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
            >
              <IconComponent
                src="/icons/monitoring/collapse.svg"
                className={cn(
                  "h-5 w-5 transform transition-transform duration-300 ease-in-out",
                  !isExpanded && "rotate-180"
                )}
              />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <>
          {isAlertOpen && (
            <div className="flex w-full items-center justify-between bg-[#FFECB4] px-4 py-1 text-xs">
              <div className="flex w-full flex-grow items-center">
                <IconComponent
                  src="/icons/warning20.svg"
                  className="mr-1 size-4 shrink-0 text-warning-900"
                />
                <div className="text-black">
                  Transporter{" "}
                  <span className="font-bold">
                    PT Prima Transport dan 2 lainnya
                  </span>{" "}
                  telah melakukan pembatalan pesanan.
                </div>
                <Link
                  href="/daftar-pesanan/pesanan-aktif"
                  variant="link"
                  className="ml-1 text-xs font-medium text-primary-700 hover:cursor-pointer hover:text-primary-800"
                >
                  Lihat Pesanan
                </Link>
              </div>
              <Button
                onClick={handleDismissAlert}
                variant="link"
                className="ml-1 text-xs"
              >
                <IconComponent src="/icons/close20.svg" className="size-4" />
              </Button>
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            {/* Check if there are no active orders */}
            {!isLoading && isFirstTimer ? (
              <div className="flex h-full items-center justify-center p-4">
                <DataNotFound className="h-full gap-y-5 pb-10" type="data">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-center text-base font-semibold leading-tight text-neutral-600">
                      Oops, daftar pesananmu masih kosong
                    </p>
                    <p className="text-center text-xs font-medium leading-tight text-neutral-600">
                      Mohon bersabar untuk menanti permintaan baru
                    </p>
                  </div>
                </DataNotFound>
              </div>
            ) : (
              <div className="h-full overflow-auto">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <p className="text-base font-semibold text-neutral-600">
                        Loading...
                      </p>
                    </div>
                  </div>
                ) : isSearchNotFound ? (
                  <div className="flex h-full flex-grow flex-col items-center justify-center">
                    <DataNotFound
                      type="search"
                      className="text-center text-neutral-600"
                    >
                      <p className="text-base font-semibold">
                        Keyword Tidak Ditemukan
                      </p>
                    </DataNotFound>
                  </div>
                ) : isFilterNotFound ? (
                  <div className="flex h-full flex-grow flex-col items-center justify-center">
                    <DataNotFound
                      type="data"
                      className="text-center text-neutral-600"
                    >
                      <p className="text-base font-semibold">
                        Data Tidak Ditemukan.
                      </p>
                      <p className="mt-1 text-xs font-medium">
                        Mohon coba hapus beberapa filter
                      </p>
                    </DataNotFound>
                  </div>
                ) : isOrderZero ? (
                  <div className="flex h-full flex-grow flex-col items-center justify-center">
                    <DataNotFound
                      type="data"
                      className="text-center text-neutral-600"
                    >
                      <p className="font-semibold">
                        Oops, daftar pesanan masih kosong
                      </p>
                      <p className="mt-3 text-xs font-medium">
                        Belum ada Transporter yang menerima permintaan
                      </p>
                    </DataNotFound>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {selectedGroupBy === "BY_PESANAN"
                      ? orders.map((order) => (
                          <DaftarPesananAktifListItem
                            key={order.orderId}
                            row={order}
                            isOpen={openDropdowns[order.orderId]}
                            onToggleDropdown={(id, isOpen) =>
                              setOpenDropdowns((prev) => ({
                                ...prev,
                                [id]: isOpen,
                              }))
                            }
                            onActionClick={handleActionClick}
                            onViewFleetStatus={onViewFleetStatus}
                            onHubungi={() => openHubungiModal(order)}
                          />
                        ))
                      : ordersByTransporters.map((order) => (
                          <DaftarPesananAktifListItemByTransporter
                            key={order.id}
                            transporterData={order}
                            openDropdowns={openDropdowns}
                            onToggleDropdown={(id, isOpen) =>
                              setOpenDropdowns((prev) => ({
                                ...prev,
                                [id]: isOpen,
                              }))
                            }
                            onActionClick={handleActionClick}
                            onViewFleetStatus={onViewFleetStatus}
                            onHubungi={(orderData) =>
                              openHubungiModal(orderData)
                            }
                          />
                        ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Assign Armada Modal */}
      <AssignArmadaModal
        isOpen={assignArmadaModalOpen}
        onClose={() => {
          setAssignArmadaModalOpen(false);
          setSelectedOrder(null);
        }}
        orderData={selectedOrder}
      />

      {/* Confirm Ready Modal */}
      <ConfirmReadyModal
        isOpen={confirmReadyModalOpen}
        onClose={() => {
          setConfirmReadyModalOpen(false);
          setSelectedOrder(null);
        }}
        orderData={selectedOrder}
      />

      <LihatArmadaModal
        isOpen={lihatArmadaModalOpen}
        onClose={() => {
          setLihatArmadaModalOpen(false);
          setSelectedOrder(null);
        }}
        orderData={selectedOrder}
      />

      {/* Respond Change Modal */}
      <RespondChangeModal
        isOpen={respondChangeModalOpen}
        onClose={() => {
          setRespondChangeModalOpen(false);
          setSelectedOrder(null);
        }}
        orderData={selectedOrder}
      />

      <BatalkanArmadaModal
        isOpen={batalkanArmadaModalOpen}
        onClose={() => {
          setBatalkanArmadaModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onOpenFleetModal={handleOpenFleetModal}
      />

      {/* Batalkan Pesanan Modal */}
      <BatalkanPesananModal
        isOpen={batalkanPesananModalOpen}
        onClose={() => {
          setBatalkanPesananModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onOpenAlasanModal={handleOpenAlasanModal}
      />

      <PilihArmadaBatalkan
        isOpen={pilihArmadaBatalkanModalOpen}
        onClose={() => {
          setPilihArmadaBatalkanModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        fleetList={
          selectedOrder?.fleets || [
            {
              id: 1,
              plateNumber: "AE 1111 LBA",
              driverName: "Noel Gallagher",
              status: "Armada Dijadwalkan",
            },
            {
              id: 2,
              plateNumber: "AE 1111 LBA",
              driverName: "Noel Gallagher",
              status: "Armada Dijadwalkan",
            },
            {
              id: 3,
              plateNumber: "AE 1111 LBA",
              driverName: "Noel Gallagher",
              status: "Armada Dijadwalkan",
            },
          ]
        }
        onConfirm={handleCancelSelectedFleets}
      />

      {/* Ubah Jumlah Unit Modal */}
      <UbahJumlahUnitModal
        isOpen={ubahJumlahUnitModalOpen}
        onClose={() => {
          setUbahJumlahUnitModalOpen(false);
          setSelectedOrder(null);
        }}
        orderData={selectedOrder}
        onConfirm={handleChangeUnitCount}
      />

      {/* Alasan Pembatalan Armada Modal */}
      <AlasanPembatalanArmadaModal
        isOpen={alasanPembatalanArmadaModalOpen}
        onClose={() => {
          setAlasanPembatalanArmadaModalOpen(false);
          setSelectedOrder(null);
          setSelectedFleetsForCancellation([]);
        }}
        order={selectedOrder}
        selectedFleets={selectedFleetsForCancellation}
        onConfirm={handleCancelArmadaWithReason}
      />

      {/* Order Change Info Modal */}
      <OrderChangeInfoModal
        isOpen={orderChangeInfoModalOpen}
        onClose={() => {
          setOrderChangeInfoModalOpen(false);
        }}
        changeDetails={mockChangeDetails}
        isLoading={false}
        onHubungi={() => {
          // Pass the selected order data for contact fetching
          if (selectedOrder) {
            openHubungiModal(selectedOrder);
          }
        }}
      />

      {/* Hubungi Modal */}
      <HubungiModal
        isOpen={hubungiModalOpen}
        onClose={closeHubungiModal}
        showInitialChoice={hubungiModalProps.showInitialChoice}
        contacts={isContactsLoading ? [] : hubungiModalProps.contacts}
        transporterContacts={hubungiModalProps.transporterContacts}
        driverContacts={hubungiModalProps.driverContacts}
      />
    </div>
  );
};

export default DaftarPesananAktif;

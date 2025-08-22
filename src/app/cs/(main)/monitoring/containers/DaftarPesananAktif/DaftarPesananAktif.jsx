"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { FilterSelect } from "@/components/Form/FilterSelect";
import IconComponent from "@/components/IconComponent/IconComponent";
import Search from "@/components/Search/Search";
import AssignArmadaModal from "@/container/Shared/OrderModal/AssignArmadaModal";
import BatalkanArmadaModal from "@/container/Shared/OrderModal/BatalkanArmadaModal";
import BatalkanPesananModal from "@/container/Shared/OrderModal/BatalkanPesananModal";
import ConfirmReadyModal from "@/container/Shared/OrderModal/ConfirmReadyModal";
import LihatArmadaModal from "@/container/Shared/OrderModal/LihatArmadaModal";
import PilihArmadaBatalkan from "@/container/Shared/OrderModal/PilihArmadaBatalkanModal";
import RespondChangeModal from "@/container/Shared/OrderModal/RespondChangeModal";
import UbahJumlahUnitModal from "@/container/Shared/OrderModal/UbahJumlahUnitModal";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useGetActiveOrdersByOrdersWithParams } from "@/services/CS/daftar-pesanan-active/getActiveOrdersByOrders";
import { useGetActiveOrdersByTransporterWithParams } from "@/services/CS/daftar-pesanan-active/getActiveOrdersByTransporter";
import { useGetActiveOrdersCount } from "@/services/CS/monitoring/daftar-pesanan-active/getActiveOrdersCount";
import { ORDER_ACTIONS } from "@/utils/Transporter/orderStatus";

import OrderChangeInfoModal from "../../../daftar-pesanan/components/OrderChangeInfoModal";
import AlasanPembatalanArmadaModal from "../../components/AlasanPembatalanArmadaModal";
import Onboarding from "../Onboarding/Onboarding";
import DaftarPesananAktifListItem from "./components/DaftarPesananAktifListItem";
import DaftarPesananAktifListItemByTransporter from "./components/DaftarPesananAktifListItemByTransporter";

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
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState("ALL_STATUS");
  const [selectedGroupBy, setSelectedGroupBy] = useState("BY_PESANAN");
  const [selectedSort, setSelectedSort] = useState("WAKTU_MUAT_TERDEKAT");
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [assignArmadaModalOpen, setAssignArmadaModalOpen] = useState(false);
  const [selectedOrderForArmada, setSelectedOrderForArmada] = useState(null);
  const [lihatArmadaModalOpen, setLihatArmadaModalOpen] = useState(false);
  const [selectedOrderForViewFleet, setSelectedOrderForViewFleet] =
    useState(null);
  const [confirmReadyModalOpen, setConfirmReadyModalOpen] = useState(false);
  const [selectedOrderForConfirm, setSelectedOrderForConfirm] = useState(null);
  const [respondChangeModalOpen, setRespondChangeModalOpen] = useState(false);
  const [selectedOrderForChange, setSelectedOrderForChange] = useState(null);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState(null);
  const [batalkanArmadaModalOpen, setBatalkanArmadaModalOpen] = useState(false);
  const [selectedOrderForFleetCancel, setSelectedOrderForFleetCancel] =
    useState(null);
  const [pilihArmadaBatalkanModalOpen, setPilihArmadaBatalkanModalOpen] =
    useState(false);
  const [batalkanPesananModalOpen, setBatalkanPesananModalOpen] =
    useState(false);
  const [selectedOrderForCancelOrder, setSelectedOrderForCancelOrder] =
    useState(null);
  const [ubahJumlahUnitModalOpen, setUbahJumlahUnitModalOpen] = useState(false);
  const [selectedOrderForChangeUnit, setSelectedOrderForChangeUnit] =
    useState(null);
  const [alasanPembatalanArmadaModalOpen, setAlasanPembatalanArmadaModalOpen] =
    useState(false);
  const [selectedOrderForAlasanArmada, setSelectedOrderForAlasanArmada] =
    useState(null);
  const [selectedFleetsForCancellation, setSelectedFleetsForCancellation] =
    useState([]);
  const [orderChangeInfoModalOpen, setOrderChangeInfoModalOpen] =
    useState(false);
  const [selectedOrderForChangeInfo, setSelectedOrderForChangeInfo] =
    useState(null);

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
  });
  const { data: dataByTransporter, isLoading: isLoadingByTransporter } =
    useGetActiveOrdersByTransporterWithParams({
      search: searchValue,
      status: getFilterStatus(),
    });

  const handleOpenFleetModal = (order) => {
    setSelectedOrderForFleetCancel(order);
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
    setSelectedOrderForAlasanArmada(cancellationData.order);
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
      setSelectedOrderForArmada({
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
        setSelectedOrderForViewFleet(row);
        setLihatArmadaModalOpen(true);
        setOpenDropdowns((prev) => ({ ...prev, [row.id]: false }));
        break;
      case ORDER_ACTIONS.VIEW_ORDER_DETAIL.type:
        // console.log("Detail Pesanan", row);
        if (row.sosStatus.hasSos) {
          router.push(`/monitoring/riwayat-sos/${row.id}/detail-pesanan`);
          break;
        }
        router.push(
          `/monitoring/daftar-pesanan-aktif/${row.id}/detail-pesanan`
        );
        break;
      case ORDER_ACTIONS.DETAIL_ARMADA.type:
        // console.log("Detail Armada", row);
        break;
      case ORDER_ACTIONS.CANCEL_ORDER.type:
        setSelectedOrderForCancelOrder(row);
        setBatalkanPesananModalOpen(true);
        setOpenDropdowns((prev) => ({ ...prev, [row.id]: false }));
        break;
      case ORDER_ACTIONS.ASSIGN_FLEET.type:
        setSelectedOrderForArmada(row);
        setAssignArmadaModalOpen(true);
        break;
      case ORDER_ACTIONS.CHANGE_UNIT_COUNT.type:
        setSelectedOrderForChangeUnit(row);
        setUbahJumlahUnitModalOpen(true);
        setOpenDropdowns((prev) => ({ ...prev, [row.id]: false }));
        break;
      case ORDER_ACTIONS.RESPOND_CHANGE.type:
        // Open OrderChangeInfoModal to show change details
        setSelectedOrderForChangeInfo(row);
        setOrderChangeInfoModalOpen(true);
        setOpenDropdowns((prev) => ({ ...prev, [row.id]: false }));
        break;
      case ORDER_ACTIONS.CANCEL_FLEET.type:
        setSelectedOrderForCancel(row);
        setBatalkanArmadaModalOpen(true);
        setOpenDropdowns((prev) => ({ ...prev, [row.id]: false }));
        break;
      case ORDER_ACTIONS.CONFIRM_READY.type:
        setSelectedOrderForConfirm(row);
        setConfirmReadyModalOpen(true);
        setOpenDropdowns((prev) => ({ ...prev, [row.id]: false }));
        break;
      default:
        // console.log("Unknown action:", actionType, row);
        break;
    }
  };

  const orders = data?.Data?.orders || [];
  const ordersByTransporters = dataByTransporter?.Data?.orders || [];
  const totalActiveOrders = activeOrdersCount?.totalActiveOrders || 0;
  const availableStatuses = activeOrdersCount?.availableStatuses || {};

  // Dropdown options
  const getStatusOptions = () => {
    const urgentStatuses = [];

    if (availableStatuses?.hasNeedChangeResponse) {
      urgentStatuses.push({
        value: "NEED_CHANGE_RESPONSE",
        label: `Perlu Respon Perubahan (${availableStatuses?.totalNeedChangeResponse || 0})`,
      });
    }

    if (availableStatuses?.hasNeedConfirmationReady) {
      urgentStatuses.push({
        value: "NEED_CONFIRMATION_READY",
        label: `Perlu Konfirmasi Siap (${availableStatuses?.totalNeedConfirmationReady || 0})`,
      });
    }

    if (availableStatuses?.hasNeedAssignVehicle) {
      urgentStatuses.push({
        value: "NEED_ASSIGN_VEHICLE",
        label: `Perlu Assign Armada (${availableStatuses?.totalNeedAssignVehicle || 0})`,
      });
    }

    return [
      { value: "ALL_STATUS", label: "Semua Status (Default)" },
      ...urgentStatuses,
    ];
  };

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
  const getStatusUrgentCount = () => {
    let total = 0;
    if (availableStatuses?.hasNeedChangeResponse) {
      total += availableStatuses?.totalNeedChangeResponse || 0;
    }
    if (availableStatuses?.hasNeedConfirmationReady) {
      total += availableStatuses?.totalNeedConfirmationReady || 0;
    }
    if (availableStatuses?.hasNeedAssignVehicle) {
      total += availableStatuses?.totalNeedAssignVehicle || 0;
    }
    return total;
  };

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
    if (true) {
      setIsAlertOpen(true);
    }
  }, []);

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
                  <FilterSelect
                    value={selectedStatusFilter}
                    onChange={setSelectedStatusFilter}
                    placeholder={`Status Urgent (${getStatusUrgentCount() > 99 ? "99+" : getStatusUrgentCount()})`}
                    options={getStatusOptions()}
                    // showNotificationDot={getStatusUrgentCount() > 0}
                    // notificationCount={getStatusUrgentCount()}
                    className="max-w-[150px]"
                    disabled={isSearchNotFound || getStatusUrgentCount() === 0}
                    showNotificationDotWithoutNumber={
                      getStatusUrgentCount() > 0
                    }
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
                className="max-w-[148px]"
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
                className="max-w-[136px]"
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
            <Button variant="link" className="ml-1 text-xs">
              Lihat Pesanan
            </Button>
          </div>
          <Button
            onClick={() => {
              setIsAlertOpen(false);
            }}
            variant="link"
            className="ml-1 text-xs"
          >
            <IconComponent src="/icons/close20.svg" className="size-4" />
          </Button>
        </div>
      )}

      {/* Content */}
      {isExpanded && (
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
                          key={order.id}
                          row={order}
                          isOpen={openDropdowns[order.id]}
                          onToggleDropdown={(id, isOpen) =>
                            setOpenDropdowns((prev) => ({
                              ...prev,
                              [id]: isOpen,
                            }))
                          }
                          onActionClick={handleActionClick}
                          onViewFleetStatus={onViewFleetStatus}
                        />
                      ))
                    : ordersByTransporters.map((order) => (
                        <DaftarPesananAktifListItemByTransporter
                          key={order.id}
                          transporterData={order}
                          isOpen={openDropdowns[order.id]}
                          onToggleDropdown={(id, isOpen) =>
                            setOpenDropdowns((prev) => ({
                              ...prev,
                              [id]: isOpen,
                            }))
                          }
                          onActionClick={handleActionClick}
                          onViewFleetStatus={onViewFleetStatus}
                        />
                      ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Assign Armada Modal */}
      <AssignArmadaModal
        isOpen={assignArmadaModalOpen}
        onClose={() => {
          setAssignArmadaModalOpen(false);
          setSelectedOrderForArmada(null);
        }}
        orderData={selectedOrderForArmada}
      />

      {/* Confirm Ready Modal */}
      <ConfirmReadyModal
        isOpen={confirmReadyModalOpen}
        onClose={() => {
          setConfirmReadyModalOpen(false);
          setSelectedOrderForConfirm(null);
        }}
        orderData={selectedOrderForConfirm}
      />

      <LihatArmadaModal
        isOpen={lihatArmadaModalOpen}
        onClose={() => {
          setLihatArmadaModalOpen(false);
          setSelectedOrderForViewFleet(null);
        }}
        orderData={selectedOrderForViewFleet}
      />

      {/* Respond Change Modal */}
      <RespondChangeModal
        isOpen={respondChangeModalOpen}
        onClose={() => {
          setRespondChangeModalOpen(false);
          setSelectedOrderForChange(null);
        }}
        orderData={selectedOrderForChange}
      />

      <BatalkanArmadaModal
        isOpen={batalkanArmadaModalOpen}
        onClose={() => {
          setBatalkanArmadaModalOpen(false);
          setSelectedOrderForCancel(null);
        }}
        order={selectedOrderForCancel}
        onOpenFleetModal={handleOpenFleetModal}
      />

      {/* Batalkan Pesanan Modal */}
      <BatalkanPesananModal
        isOpen={batalkanPesananModalOpen}
        onClose={() => {
          setBatalkanPesananModalOpen(false);
          setSelectedOrderForCancelOrder(null);
        }}
        order={selectedOrderForCancelOrder}
        onOpenAlasanModal={handleOpenAlasanModal}
      />

      <PilihArmadaBatalkan
        isOpen={pilihArmadaBatalkanModalOpen}
        onClose={() => {
          setPilihArmadaBatalkanModalOpen(false);
          setSelectedOrderForFleetCancel(null);
        }}
        order={selectedOrderForFleetCancel}
        fleetList={
          selectedOrderForFleetCancel?.fleets || [
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
          setSelectedOrderForChangeUnit(null);
        }}
        orderData={selectedOrderForChangeUnit}
        onConfirm={handleChangeUnitCount}
      />

      {/* Alasan Pembatalan Armada Modal */}
      <AlasanPembatalanArmadaModal
        isOpen={alasanPembatalanArmadaModalOpen}
        onClose={() => {
          setAlasanPembatalanArmadaModalOpen(false);
          setSelectedOrderForAlasanArmada(null);
          setSelectedFleetsForCancellation([]);
        }}
        order={selectedOrderForAlasanArmada}
        selectedFleets={selectedFleetsForCancellation}
        onConfirm={handleCancelArmadaWithReason}
      />

      {/* Order Change Info Modal */}
      <OrderChangeInfoModal
        isOpen={orderChangeInfoModalOpen}
        onClose={() => {
          setOrderChangeInfoModalOpen(false);
          setSelectedOrderForChangeInfo(null);
        }}
        changeDetails={mockChangeDetails}
        isLoading={false}
        onHubungi={() => {
          // TODO: Implement contact functionality
        }}
      />
    </div>
  );
};

export default DaftarPesananAktif;

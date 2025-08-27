"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { useGetActiveOrdersInfinite } from "@/services/Transporter/monitoring/daftar-pesanan-aktif/getActiveOrders";
import { useGetActiveOrdersCount } from "@/services/Transporter/monitoring/daftar-pesanan-aktif/getActiveOrdersCount";

import BadgeOrderType from "@/components/Badge/BadgeOrderType";
import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import NotificationDot from "@/components/NotificationDot/NotificationDot";
import Search from "@/components/Search/Search";
import SearchNotFound from "@/components/SearchNotFound/SearchNotFound";
import MuatBongkarStepperWithModal from "@/components/Stepper/MuatBongkarStepperWithModal";
import Table from "@/components/Table/Table";

import AlasanPembatalanModal from "@/container/Shared/OrderModal/AlasanPembatalanModal";
import AssignArmadaWrapper from "@/container/Shared/OrderModal/AssignArmadaWrapper";
import BatalkanArmadaModal from "@/container/Shared/OrderModal/BatalkanArmadaModal";
import BatalkanPesananModal from "@/container/Shared/OrderModal/BatalkanPesananModal";
import ConfirmReadyModal from "@/container/Shared/OrderModal/ConfirmReadyModal";
import LihatArmadaModal from "@/container/Shared/OrderModal/LihatArmadaModal";
import PilihArmadaBatalkanModal from "@/container/Shared/OrderModal/PilihArmadaBatalkanModal";
import RespondChangeModal from "@/container/Shared/OrderModal/RespondChangeModal";
import UbahJumlahUnitModal from "@/container/Shared/OrderModal/UbahJumlahUnitModal";

import { useTranslation } from "@/hooks/use-translation";

import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

import { formatMuatTime } from "@/utils/Transporter/dateTimeUtils";
import {
  ORDER_STATUS,
  getOrderActions,
  getOrderStatusActionsWithTranslation,
  getOrderStatusBadgeWithTranslation,
} from "@/utils/Transporter/orderStatus";

import Onboarding from "../Onboarding/Onboarding";
import AlertPerubahanLokasi from "./components/AlertPerubahanLokasi";

// Component to handle truck name with conditional tooltip using character length
const TruckNameWithTooltip = ({ name }) => {
  const isLongName = name && name.length > 20;

  if (isLongName) {
    return (
      <InfoTooltip
        trigger={
          <span className="line-clamp-1 cursor-pointer break-all text-xs font-bold">
            {name}
          </span>
        }
        side="top"
      >
        <p className="text-sm">{name}</p>
      </InfoTooltip>
    );
  }

  return (
    <span className="line-clamp-1 break-all text-xs font-bold">{name}</span>
  );
};

const DaftarPesananAktif = ({
  onToggleExpand,
  isExpanded,
  onViewFleetStatus,
  onTrackFleet,
  hasShownOnboarding,
  onOnboardingShown,
}) => {
  const { t } = useTranslation();

  // Helper function to get translated action labels
  const getTranslatedActionLabel = (actionType, fallbackLabel) => {
    const translationKeys = {
      TRACK_FLEET: "OrderActions.trackFleet",
      VIEW_FLEET: "OrderActions.viewFleet",
      VIEW_ORDER_DETAIL: "OrderActions.viewOrderDetail",
      DETAIL_ARMADA: "OrderActions.detailArmada",
      CANCEL_ORDER: "OrderActions.cancelOrder",
      CANCEL_FLEET: "OrderActions.cancelFleet",
      ASSIGN_FLEET: "OrderActions.assignFleet",
      CHANGE_UNIT_COUNT: "OrderActions.changeUnitCount",
      RESPOND_CHANGE: "OrderActions.respondChange",
      CONFIRM_READY: "OrderActions.confirmReady",
      VIEW_CHANGE: "OrderActions.viewChange",
    };

    const translationKey = translationKeys[actionType];
    return translationKey
      ? t(translationKey, null, fallbackLabel)
      : fallbackLabel;
  };

  const { data: activeOrdersCount } = useGetActiveOrdersCount();
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Alert Perubahan Lokasi state management
  const [isLocationChangeAlertVisible, setIsLocationChangeAlertVisible] =
    useState(true);
  const [isFilteredByLocationChange, setIsFilteredByLocationChange] =
    useState(false);

  const [assignArmadaModalOpen, setAssignArmadaModalOpen] = useState(false);
  const [selectedOrderForArmada, setSelectedOrderForArmada] = useState(null);
  const [confirmReadyModalOpen, setConfirmReadyModalOpen] = useState(false);
  const [selectedOrderForConfirm, setSelectedOrderForConfirm] = useState(null);
  const [respondChangeModalOpen, setRespondChangeModalOpen] = useState(false);
  const [selectedOrderForChange, setSelectedOrderForChange] = useState(null);
  const [batalkanArmadaModalOpen, setBatalkanArmadaModalOpen] = useState(false);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState(null);
  const [batalkanPesananModalOpen, setBatalkanPesananModalOpen] =
    useState(false);
  const [selectedOrderForCancelOrder, setSelectedOrderForCancelOrder] =
    useState(null);
  const [lihatArmadaModalOpen, setLihatArmadaModalOpen] = useState(false);
  const [selectedOrderForViewFleet, setSelectedOrderForViewFleet] =
    useState(null);
  const [alasanPembatalanModalOpen, setAlasanPembatalanModalOpen] =
    useState(false);
  const [selectedOrderForAlasan, setSelectedOrderForAlasan] = useState(null);
  const [pilihArmadaBatalkanModalOpen, setPilihArmadaBatalkanModalOpen] =
    useState(false);
  const [selectedOrderForFleetCancel, setSelectedOrderForFleetCancel] =
    useState(null);
  const [ubahJumlahUnitModalOpen, setUbahJumlahUnitModalOpen] = useState(false);
  const [selectedOrderForChangeUnit, setSelectedOrderForChangeUnit] =
    useState(null);
  const [viewChangeModalOpen, setViewChangeModalOpen] = useState(false);
  const [selectedOrderForViewChange, setSelectedOrderForViewChange] =
    useState(null);
  const router = useRouter();

  // Helper function to translate status labels
  const getTranslatedStatusLabel = (status) => {
    const statusTranslations = {
      WAITING_CONFIRMATION_SHIPPER: "OrderStatus.waitingConfirmationShipper",
      CONFIRMED: "OrderStatus.confirmed",
      NEED_ASSIGN_FLEET: "OrderStatus.needAssignFleet",
      NEED_CONFIRMATION_READY: "OrderStatus.needConfirmationReady",
      NEED_CHANGE_RESPONSE: "OrderStatus.needChangeResponse",
      SCHEDULED_FLEET: "OrderStatus.scheduledFleet",
      LOADING: "OrderStatus.loading",
      UNLOADING: "OrderStatus.unloading",
      PREPARE_DOCUMENT: "OrderStatus.prepareDocument",
      DOCUMENT_DELIVERY: "OrderStatus.documentDelivery",
      COMPLETED: "OrderStatus.completed",
      HEADING_TO_LOADING: "OrderStatus.headingToLoading",
      HEADING_TO_UNLOADING: "OrderStatus.headingToUnloading",
      DOCUMENT_PREPARATION: "OrderStatus.documentPreparation",
      CANCELLED_BY_TRANSPORTER: "OrderStatus.cancelledByTransporter",
      CANCELLED_BY_SHIPPER: "OrderStatus.cancelledByShipper",
      CANCELLED_BY_SYSTEM: "OrderStatus.cancelledBySystem",
      ARMADA_DIJADWALKAN: "OrderStatus.armadaDijadwalkan",
      WAITING_CHANGE_FLEET: "OrderStatus.waitingChangeFleet",
      FLEET_FOUND: "OrderStatus.fleetFound",
      WAITING_PAYMENT: "OrderStatus.waitingPayment",
    };

    const translationKey = statusTranslations[status];
    const statusBadge = getOrderStatusBadgeWithTranslation(status, t);

    if (translationKey) {
      return t(translationKey, {}, statusBadge.label);
    }
    return statusBadge.label;
  };

  // Map filter keys to lowercase status values for API
  const getFilterStatus = (filterKey) => {
    const statusMap = {
      NEED_CHANGE_RESPONSE: "need_change_response",
      NEED_CONFIRMATION_READY: "need_confirmation_ready",
      NEED_ASSIGN_VEHICLE: "need_assign_vehicle",
    };
    return statusMap[filterKey] || null;
  };

  // Prepare the request parameters with location change filter
  const requestParams = {
    search: searchValue,
    status: getFilterStatus(selectedFilter),
    hasLocationChange: isFilteredByLocationChange || undefined, // Only add if filtering by location change
    ...sortConfig,
  };

  // Use infinite scroll with 10 items per page
  const ITEMS_PER_PAGE = 10;
  const { data, isLoading, isLoadingMore, hasNextPage, loadMore } =
    useGetActiveOrdersInfinite(requestParams, ITEMS_PER_PAGE);
  // Debug: uncomment for development
  // console.log("Order Aktif:", data);
  // console.log("hasNextPage:", hasNextPage, "isLoadingMore:", isLoadingMore, "orders count:", data?.orders?.length);

  // Calculate orders with location/time changes
  const orders = data?.orders || [];
  const ordersWithLocationChanges = orders.filter(
    (order) => order.hasChangeRequest
  );

  // Note: Infinite scroll logic is now handled by the Table component

  // Reset alert visibility if no orders with changes exist
  React.useEffect(() => {
    if (
      ordersWithLocationChanges.length === 0 &&
      isLocationChangeAlertVisible
    ) {
      setIsLocationChangeAlertVisible(false);
      setIsFilteredByLocationChange(false);
    } else if (
      ordersWithLocationChanges.length > 0 &&
      !isLocationChangeAlertVisible &&
      !isFilteredByLocationChange
    ) {
      // Show alert again if there are orders with changes and alert was previously hidden
      setIsLocationChangeAlertVisible(true);
    }
  }, [
    ordersWithLocationChanges.length,
    isLocationChangeAlertVisible,
    isFilteredByLocationChange,
  ]);

  // Handler functions for AlertPerubahanLokasi
  const handleViewOrdersWithChanges = () => {
    setIsFilteredByLocationChange(true);
    // Clear other filters when filtering by location change
    setSelectedFilter(null);
    setSearchValue("");
  };

  const handleBackToDefault = () => {
    setIsFilteredByLocationChange(false);
    // Optionally clear other filters as well
    setSelectedFilter(null);
    setSearchValue("");
  };

  const handleCloseLocationChangeAlert = () => {
    setIsLocationChangeAlertVisible(false);
    // Also reset filtering if currently filtered by location change
    if (isFilteredByLocationChange) {
      setIsFilteredByLocationChange(false);
    }
  };

  // Handle search while location filter is active
  const handleSearch = (value) => {
    console.log("🔍 Search triggered with value:", value);
    console.log("🔍 Value length:", value.length);
    console.log("🔍 Setting search value to:", value);
    setSearchValue(value);
    // Keep location change filter active if it was active
    // Search functionality is implemented via useGetActiveOrders hook
    // which automatically refetches data when searchValue changes
  };

  // Handle action button clicks based on action type
  const handleActionClick = (actionType, row) => {
    const ORDER_ACTIONS = getOrderActions(t);
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
        console.log("Detail Pesanan", row);
        router.push(`/monitoring/${row.id}/detail-pesanan`);
        break;
      case ORDER_ACTIONS.DETAIL_ARMADA.type:
        console.log("Detail Armada", row);
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
        // Navigate to respon-perubahan page if truckCount > 1
        if (row.truckCount > 1) {
          router.push(`/monitoring/${row.id}/respon-perubahan`);
        } else {
          // Use modal for single truck
          setSelectedOrderForChange(row);
          setRespondChangeModalOpen(true);
        }
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
      case "VIEW_CHANGE":
        setSelectedOrderForViewChange(row);
        setViewChangeModalOpen(true);
        setOpenDropdowns((prev) => ({ ...prev, [row.id]: false }));
        break;
      default:
        console.log("Unknown action:", actionType, row);
    }
  };

  // Handler for confirming fleet cancellation
  const handleCancelFleet = async (order) => {
    try {
      // TODO: Implement API call to cancel fleet assignment
      console.log("Canceling fleet for order:", order);

      // Example API call (replace with actual service)
      // await cancelFleetAssignment(order.id);

      // Show success toast notification
      const truckCount = order?.truckCount || order?.vehicleCount || 1;
      toast.success(
        t(
          "DaftarPesananAktif.cancelFleetSuccess",
          {
            truckCount,
            orderCode: order?.orderCode || order?.orderNumber || "",
          },
          `Berhasil membatalkan ${truckCount} armada dari pesanan ${order?.orderCode || order?.orderNumber || ""}`
        )
      );

      // TODO: Refresh data or update state as needed
      // You might want to refetch the orders list here
    } catch (error) {
      console.error("Error canceling fleet:", error);
      // Show error toast
      toast.error(
        t(
          "DaftarPesananAktif.cancelFleetError",
          {},
          "Gagal membatalkan armada. Silakan coba lagi."
        )
      );
    }
  };

  // Handler for opening alasan pembatalan modal
  const handleOpenAlasanModal = (order) => {
    setSelectedOrderForAlasan(order);
    setAlasanPembatalanModalOpen(true);
  };

  // Handler for confirming order cancellation with reason
  const handleCancelOrderWithReason = async (cancellationData) => {
    try {
      // TODO: Implement API call to cancel order with reason and files
      console.log("Canceling order with reason:", cancellationData);

      // Example API call (replace with actual service)
      // await cancelOrderWithReason({
      //   orderId: cancellationData.order.id,
      //   reason: cancellationData.reason,
      //   supportingFiles: cancellationData.supportingFiles
      // });

      // Show success toast notification
      toast.success(
        t(
          "DaftarPesananAktif.cancelOrderSuccess",
          {
            orderCode:
              cancellationData.order?.orderCode ||
              cancellationData.order?.orderNumber ||
              "",
          },
          `Berhasil membatalkan pesanan ${cancellationData.order?.orderCode || cancellationData.order?.orderNumber || ""}`
        )
      );

      // TODO: Refresh data or update state as needed
      // You might want to refetch the orders list here
    } catch (error) {
      console.error("Error canceling order:", error);
      // Show error toast
      toast.error(
        t(
          "DaftarPesananAktif.cancelOrderError",
          {},
          "Gagal membatalkan pesanan. Silakan coba lagi."
        )
      );
    }
  };

  // Handler for opening fleet selection modal
  const handleOpenFleetModal = (order) => {
    setSelectedOrderForFleetCancel(order);
    setPilihArmadaBatalkanModalOpen(true);
  };

  // Handler for confirming fleet cancellation with selected fleets
  const handleCancelSelectedFleets = async (cancellationData) => {
    try {
      // TODO: Implement API call to cancel selected fleets
      console.log("Canceling selected fleets:", cancellationData);

      // Example API call (replace with actual service)
      // await cancelSelectedFleets({
      //   orderId: cancellationData.order.id,
      //   fleetIds: cancellationData.selectedFleets
      // });

      // Show success toast notification
      const fleetCount = cancellationData.selectedFleets.length;
      toast.success(
        t(
          "DaftarPesananAktif.cancelSelectedFleetsSuccess",
          {
            fleetCount,
            orderCode:
              cancellationData.order?.orderCode ||
              cancellationData.order?.orderNumber ||
              "",
          },
          `Berhasil membatalkan ${fleetCount} armada dari pesanan ${cancellationData.order?.orderCode || cancellationData.order?.orderNumber || ""}`
        )
      );

      // TODO: Refresh data or update state as needed
      // You might want to refetch the orders list here
    } catch (error) {
      console.error("Error canceling selected fleets:", error);
      // Show error toast
      toast.error(
        t(
          "DaftarPesananAktif.cancelSelectedFleetsError",
          {},
          "Gagal membatalkan armada. Silakan coba lagi."
        )
      );
    }
  };

  // Handler for confirming unit count change
  const handleChangeUnitCount = async (changeData) => {
    try {
      // TODO: Implement API call to change unit count
      console.log("Changing unit count for order:", changeData);

      // Example API call (replace with actual service)
      // await changeUnitCount({
      //   orderId: changeData.orderData.id,
      //   newUnitCount: changeData.newUnitCount,
      //   reason: changeData.reason,
      //   supportingFiles: changeData.supportingFiles
      // });

      // Show success toast notification
      toast.success(
        t(
          "DaftarPesananAktif.changeUnitCountSuccess",
          {
            orderCode:
              changeData.orderData?.orderCode ||
              changeData.orderData?.orderNumber ||
              "",
          },
          `Berhasil melakukan perubahan jumlah unit pesanan ${changeData.orderData?.orderCode || changeData.orderData?.orderNumber || ""}`
        )
      );

      // Open AssignArmadaModal after successful unit count change
      setSelectedOrderForArmada({
        ...changeData.orderData,
        truckCount: changeData.newUnitCount, // Update with new unit count
      });
      setAssignArmadaModalOpen(true);

      // TODO: Refresh data or update state as needed
      // You might want to refetch the orders list here
    } catch (error) {
      console.error("Error changing unit count:", error);
      // Show error toast
      toast.error(
        t(
          "DaftarPesananAktif.changeUnitCountError",
          {},
          "Gagal mengubah jumlah unit. Silakan coba lagi."
        )
      );
    }
  };

  const columns = [
    {
      header: t("DaftarPesananAktif.orderNumberHeader", {}, "No. Pesanan"),
      key: "orderCode",
      sortable: true,
      headerClassName: "px-4 py-3",
      className: "p-4 align-top",
      render: (row) => (
        <div className="flex flex-col gap-2.5">
          <span className="text-xxs font-semibold text-gray-900">
            {row.orderCode}
          </span>
          <BadgeOrderType type={row.orderType} className="w-[70px]" />
          <div className="flex items-center gap-1">
            <InfoTooltip
              trigger={
                <button type="button" className="flex items-center">
                  <NotificationDot size="md" color="warning" animated={true} />
                </button>
              }
              side="right"
              align="center"
              className="border-none shadow-none"
            >
              <p className="w-[237px] text-xs">
                {t(
                  "DaftarPesananAktif.locationChangeTooltip",
                  {},
                  "Terdapat perubahan lokasi muat dan jam muat oleh shipper, klik pada aksi untuk melihat perubahan"
                )}
              </p>
            </InfoTooltip>
            <p className="text-xxs text-warning-900">
              {t("DaftarPesananAktif.hasChanges", {}, "Terdapat perubahan")}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: t("DaftarPesananAktif.loadTimeHeader", {}, "Waktu Muat"),
      key: "loadTimeStart",
      sortable: true,
      headerClassName: "px-4 py-3",
      className: "p-4 align-top",
      render: (row) => {
        const { dateLabel, timeRange, dateColor } = formatMuatTime(row, t);
        return (
          <div className="flex flex-col gap-1">
            <span className={`text-xs font-semibold ${dateColor}`}>
              {dateLabel}
            </span>
            <span className="text-xxs font-medium">{timeRange}</span>
          </div>
        );
      },
    },
    {
      header: t("DaftarPesananAktif.routeHeader", {}, "Rute Muat & Bongkar"),
      key: "route",
      sortable: false,
      width: "350px",
      headerClassName: "px-4 py-3",
      className: "p-4 align-top",
      render: (row) => (
        <MuatBongkarStepperWithModal
          pickupLocations={row.pickupLocations}
          dropoffLocations={row.dropoffLocations}
          appearance={{
            titleClassName: "line-clamp-2 break-all",
          }}
        />
      ),
    },
    {
      header: t("DaftarPesananAktif.fleetHeader", {}, "Armada"),
      key: "armada",
      sortable: false,
      headerClassName: "px-4 py-3",
      className: "p-4 align-top",
      render: (row) => (
        <div className="flex w-[140px] flex-col gap-1">
          <TruckNameWithTooltip name={row.truckType.name} />
          <span className="line-clamp-1 break-all text-xs font-medium">
            <span className="text-neutral-600">
              {t("DaftarPesananAktif.carrierLabel", {}, "Carrier")} :
            </span>{" "}
            {row.carrierTruck.description}
          </span>
          <div className="mt-1 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <IconComponent
                src="/icons/monitoring/daftar-pesanan-aktif/truck.svg"
                className="h-4 w-4 text-gray-600"
              />
              <span className="text-xxs font-medium">
                {t(
                  "DaftarPesananAktif.unitCount",
                  { count: row.truckCount },
                  `${row.truckCount} Unit`
                )}
              </span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <IconComponent
                src="/icons/monitoring/daftar-pesanan-aktif/scales.svg"
                className="h-4 w-4 text-gray-600"
              />
              <span className="text-xxs font-medium">
                {row.totalWeight} {row.weightUnit}
              </span>
            </div>
          </div>
          {/* SOS Indicator for UNLOADING status with SOS */}
          {row.orderStatus === ORDER_STATUS.UNLOADING &&
            row.sosStatus?.hasSos &&
            row.sosStatus?.sosCount > 0 && (
              <div className="mt-1 flex items-center gap-2">
                <div className="flex h-[14px] items-center gap-1 rounded bg-error-400 px-1">
                  <span className="text-[8px] font-bold leading-[130%] text-white">
                    {t(
                      "DaftarPesananAktif.sosCount",
                      { count: row.sosStatus.sosCount },
                      `SOS : ${row.sosStatus.sosCount} Unit`
                    )}
                  </span>
                </div>
                <Button
                  variant="link"
                  onClick={() => {
                    router.push("/monitoring?leftPanel=sos");
                  }}
                  className="h-auto p-0 text-xs font-medium"
                >
                  {t("DaftarPesananAktif.viewSos", {}, "Lihat SOS")}
                </Button>
              </div>
            )}
        </div>
      ),
    },
    {
      header: t("DaftarPesananAktif.statusHeader", {}, "Status"),
      key: "orderStatus",
      sortable: false,
      headerClassName: "px-4 py-3 ",
      className: "p-4 align-top",
      render: (row) => {
        const statusBadge = getOrderStatusBadgeWithTranslation(
          row.orderStatus,
          t
        );
        return (
          <div className="flex flex-col gap-2">
            <BadgeStatus
              variant={statusBadge.variant}
              className="w-[176px] px-0"
            >
              {row.orderStatus ===
                ORDER_STATUS.WAITING_CONFIRMATION_SHIPPER && (
                <InfoTooltip
                  side="top"
                  appearance={{
                    iconClassName: "text-primary-700 mr-1 size-3.5",
                  }}
                >
                  <p>
                    {t(
                      "DaftarPesananAktif.waitingConfirmationTooltip",
                      {},
                      "Armada kamu telah tercatat untuk pesanan ini, harap menunggu maks. 1 jam untuk konfirmasi dari Shipper"
                    )}
                  </p>
                </InfoTooltip>
              )}
              {row.orderStatus === ORDER_STATUS.NEED_CONFIRMATION_READY && (
                <IconComponent
                  src="/icons/warning-red.svg"
                  className="mr-1 h-3.5 w-3.5"
                />
              )}
              {row.orderStatus === ORDER_STATUS.NEED_CHANGE_RESPONSE && (
                <IconComponent
                  src="/icons/warning24.svg"
                  className="mr-1 h-3.5 w-3.5 text-warning-900"
                />
              )}
              {row.orderStatus === ORDER_STATUS.LOADING
                ? t(
                    "OrderStatus.loadingWithCount",
                    { count: row.truckCount || 0 },
                    `${getTranslatedStatusLabel(row.orderStatus)} : ${row.truckCount || 0} Unit`
                  )
                : getTranslatedStatusLabel(row.orderStatus)}
            </BadgeStatus>
            {row.orderStatus === ORDER_STATUS.LOADING && (
              <Button
                variant="link"
                onClick={() => {
                  onViewFleetStatus?.(row);
                }}
                className="self-start text-xs font-semibold"
              >
                {t(
                  "DaftarPesananAktif.viewOtherStatus",
                  {},
                  "Lihat Status Lainnya"
                )}
              </Button>
            )}
            {row.orderStatus === ORDER_STATUS.NEED_ASSIGN_FLEET && (
              <Button
                variant="muattrans-primary"
                onClick={() => {
                  setSelectedOrderForArmada(row);
                  setAssignArmadaModalOpen(true);
                }}
                className="mx-auto h-8 w-[147px] text-sm md:p-0"
              >
                {t("DaftarPesananAktif.assignFleet", {}, "Assign Armada")}
              </Button>
            )}
            {row.orderStatus === ORDER_STATUS.NEED_CONFIRMATION_READY && (
              <Button
                variant="muattrans-primary"
                onClick={() => {
                  setSelectedOrderForConfirm(row);
                  setConfirmReadyModalOpen(true);
                }}
                className="mx-auto h-8 w-[147px] text-sm md:p-0"
              >
                {t("DaftarPesananAktif.confirmReady", {}, "Konfirmasi Siap")}
              </Button>
            )}
            {row.orderStatus === ORDER_STATUS.NEED_CHANGE_RESPONSE && (
              <Button
                variant="muattrans-primary"
                onClick={() => {
                  // Navigate to respon-perubahan page if truckCount > 1
                  if (row.truckCount > 1) {
                    router.push(`/monitoring/${row.id}/respon-perubahan`);
                  } else {
                    // Use modal for single truck
                    setSelectedOrderForChange(row);
                    setRespondChangeModalOpen(true);
                  }
                }}
                className="mx-auto h-8 w-[170px] text-sm md:p-0"
              >
                {t("DaftarPesananAktif.respondChange", {}, "Respon Perubahan")}
              </Button>
            )}
          </div>
        );
      },
    },
    {
      header: "",
      key: "actions",
      sortable: false,
      headerClassName: "px-4 py-3",
      className: "p-4 align-top",
      render: (row) => {
        const config = getOrderStatusActionsWithTranslation(
          row.orderStatus,
          row,
          t
        );

        // If status has dropdown actions
        if (config) {
          // Clone the config to avoid mutating the original
          const modifiedConfig = { ...config, actions: [...config.actions] };

          // Add "Lihat Perubahan" action if the order has change requests
          if (row.hasChangeRequest) {
            const ORDER_ACTIONS = getOrderActions(t);
            const viewChangeAction = {
              ...ORDER_ACTIONS.VIEW_CHANGE,
              isError: false,
            };

            // Insert as the first action (at the top of the dropdown)
            modifiedConfig.actions.unshift(viewChangeAction);

            // Adjust width to accommodate longer text if needed
            if (modifiedConfig.width === "w-[122px]") {
              modifiedConfig.width = "w-[137px]";
            } else if (modifiedConfig.width === "w-[137px]") {
              modifiedConfig.width = "w-[152px]";
            }
          }

          return (
            <SimpleDropdown
              open={openDropdowns[row.id] || false}
              onOpenChange={(isOpen) =>
                setOpenDropdowns((prev) => ({ ...prev, [row.id]: isOpen }))
              }
            >
              <SimpleDropdownTrigger asChild>
                <button
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-lg",
                    openDropdowns[row.id]
                      ? "border border-primary-700 bg-primary-50"
                      : "hover:border hover:border-primary-700 hover:bg-neutral-200"
                  )}
                >
                  <IconComponent
                    src="/icons/monitoring/daftar-pesanan-aktif/action.svg"
                    className={cn(
                      "h-[13px] w-[13px]",
                      openDropdowns[row.id] ? "text-primary-700" : ""
                    )}
                  />
                </button>
              </SimpleDropdownTrigger>

              <SimpleDropdownContent
                className={cn("mr-1 mt-0", modifiedConfig.width)}
                side="left"
              >
                {modifiedConfig.actions.map((actionItem, index) => (
                  <SimpleDropdownItem
                    key={index}
                    onClick={() => handleActionClick(actionItem.type, row)}
                    className={cn(
                      "flex h-8 items-center",
                      actionItem.isError &&
                        "text-error-400 hover:text-error-500"
                    )}
                  >
                    {getTranslatedActionLabel(
                      actionItem.type,
                      actionItem.label
                    )}
                  </SimpleDropdownItem>
                ))}
              </SimpleDropdownContent>
            </SimpleDropdown>
          );
        }

        // Default action button for other statuses
        return (
          <button className="flex h-6 w-6 items-center justify-center rounded-lg hover:border hover:border-primary-700 hover:bg-neutral-200">
            <IconComponent
              src="/icons/monitoring/daftar-pesanan-aktif/action.svg"
              className="h-[13px] w-[13px]"
            />
          </button>
        );
      },
    },
  ];

  const handleSort = (columnKey) => {
    let newOrder = null;
    let newSort = columnKey;

    if (sortConfig.sort === columnKey) {
      if (sortConfig.order === "asc") {
        newOrder = "desc";
      } else if (sortConfig.order === "desc") {
        newOrder = null;
        newSort = null;
      } else {
        newOrder = "asc";
      }
    } else {
      newOrder = "asc";
    }

    setSortConfig({ sort: newSort, order: newOrder });
  };

  const renderEmptyState = () => (
    <tr>
      <td colSpan={columns.length} className="px-6 py-8 text-center">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-base font-semibold text-neutral-600">
              {isFilteredByLocationChange
                ? t(
                    "DaftarPesananAktif.noOrdersWithChanges",
                    {},
                    "Tidak ada pesanan dengan perubahan lokasi/waktu"
                  )
                : t(
                    "DaftarPesananAktif.noActiveOrders",
                    {},
                    "Belum ada pesanan aktif"
                  )}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {isFilteredByLocationChange
                ? t(
                    "DaftarPesananAktif.changeOrdersWillAppear",
                    {},
                    "Pesanan dengan perubahan akan muncul di sini"
                  )
                : t(
                    "DaftarPesananAktif.activeOrdersWillAppear",
                    {},
                    "Pesanan aktif akan muncul di sini"
                  )}
            </p>
          </div>
        </div>
      </td>
    </tr>
  );

  const totalActiveOrders = activeOrdersCount?.totalActiveOrders || 0;
  const availableStatuses = data?.availableStatuses || {};

  // Filter configuration
  const filterConfig = [
    {
      key: "NEED_CHANGE_RESPONSE",
      label: t(
        "DaftarPesananAktif.responseChangeFilter",
        {},
        "Respon Perubahan"
      ),
      hasFilter: !!availableStatuses?.totalNeedChangeResponse,
      count: availableStatuses?.totalNeedChangeResponse || 0,
    },
    {
      key: "NEED_CONFIRMATION_READY",
      label: t(
        "DaftarPesananAktif.needConfirmationFilter",
        {},
        "Perlu Konfirmasi Siap"
      ),
      hasFilter: !!availableStatuses?.totalNeedConfirmationReady,
      count: availableStatuses?.totalNeedConfirmationReady || 0,
    },
    {
      key: "NEED_ASSIGN_VEHICLE",
      label: t("DaftarPesananAktif.assignFleetFilter", {}, "Assign Armada"),
      hasFilter: !!availableStatuses?.totalNeedAssignVehicle,
      count: availableStatuses?.totalNeedAssignVehicle || 0,
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="flex items-center gap-2">
          <h3 className="w-[80px] text-xs font-bold">
            {t("DaftarPesananAktif.title", {}, "Daftar Pesanan Aktif")}
          </h3>
          <Onboarding
            hasShownOnboarding={hasShownOnboarding}
            onOnboardingShown={onOnboardingShown}
          />
        </div>
        <div className="flex w-full items-center gap-3">
          {/* Status Filter Pills */}
          <div className="flex flex-1 items-center gap-2">
            {filterConfig.map(
              (filter) =>
                filter.hasFilter && (
                  <div key={filter.key} className="relative">
                    <button
                      onClick={() =>
                        setSelectedFilter(
                          selectedFilter === filter.key ? null : filter.key
                        )
                      }
                      className={cn(
                        "flex items-center gap-1 rounded-2xl border border-primary-700 bg-white px-3 py-1.5 text-[10px] font-semibold leading-[130%] text-primary-700 transition-colors",
                        selectedFilter === filter.key && "bg-primary-50"
                      )}
                    >
                      <span>{filter.label}</span>
                      {filter.count > 0 && (
                        <span>
                          ({filter.count > 99 ? "99+" : filter.count})
                        </span>
                      )}
                    </button>
                    {filter.count > 0 && (
                      <NotificationDot
                        position="absolute"
                        positionClasses="right-[1px] top-[-1px]"
                        size="md"
                        color="red"
                        animated={true}
                      />
                    )}
                  </div>
                )
            )}
          </div>
          <Search
            placeholder={t(
              "DaftarPesananAktif.searchPlaceholder",
              {},
              "Cari Pesanan"
            )}
            onSearch={handleSearch}
            onFocus={() => {
              if (!isExpanded) {
                onToggleExpand();
              }
            }}
            containerClassName="h-8 w-[180px]"
            inputClassName="text-xs"
            disabled={totalActiveOrders === 0}
            autoSearch={false}
            debounceTime={0}
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
      </div>
      {/* Content */}
      {isExpanded && (
        <>
          <AlertPerubahanLokasi
            ordersWithChanges={ordersWithLocationChanges}
            isFiltered={isFilteredByLocationChange}
            onViewOrders={handleViewOrdersWithChanges}
            onBackToDefault={handleBackToDefault}
            onClose={handleCloseLocationChangeAlert}
            isVisible={isLocationChangeAlertVisible}
          />

          <div className="flex-1 overflow-hidden">
            {/* Check if there are no active orders */}
            {!isLoading && totalActiveOrders === 0 ? (
              <div className="flex h-full items-center justify-center p-4">
                <DataNotFound className="h-full gap-y-5 pb-10" type="data">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-center text-base font-semibold leading-tight text-neutral-600">
                      {t(
                        "DaftarPesananAktif.emptyOrderList",
                        {},
                        "Oops, daftar pesananmu masih kosong"
                      )}
                    </p>
                    <p className="text-center text-xs font-medium leading-tight text-neutral-600">
                      {t(
                        "DaftarPesananAktif.waitForNewRequests",
                        {},
                        "Mohon bersabar untuk menanti permintaan baru"
                      )}
                    </p>
                  </div>
                </DataNotFound>
              </div>
            ) : (
              <div className="h-full border-0">
                <Table
                  data={orders}
                  columns={columns}
                  loading={isLoading}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  emptyComponent={
                    searchValue && searchValue.length > 2 ? (
                      <SearchNotFound
                        searchTerm={searchValue}
                        className="py-0"
                      />
                    ) : (
                      renderEmptyState()
                    )
                  }
                  // Infinite scroll props
                  enableInfiniteScroll={true}
                  isLoadingMore={isLoadingMore}
                  hasNextPage={hasNextPage}
                  loadMore={loadMore}
                  loadingMoreComponent={
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary-700"></div>
                      <span className="text-sm text-gray-600">
                        {t(
                          "DaftarPesananAktif.loadingMore",
                          {},
                          "Memuat lebih banyak..."
                        )}
                      </span>
                    </div>
                  }
                  endOfResultsComponent={
                    <span className="text-sm text-gray-400">
                      {t(
                        "DaftarPesananAktif.endOfResults",
                        {},
                        "Semua data telah ditampilkan"
                      )}
                    </span>
                  }
                  scrollThreshold={0.8}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Assign Armada Wrapper - handles all armada assignment modals */}
      <AssignArmadaWrapper
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

      {/* Respond Change Modal */}
      <RespondChangeModal
        isOpen={respondChangeModalOpen}
        onClose={() => {
          setRespondChangeModalOpen(false);
          setSelectedOrderForChange(null);
        }}
        orderData={selectedOrderForChange}
      />

      {/* View Change Modal (Read-only) */}
      <RespondChangeModal
        isOpen={viewChangeModalOpen}
        onClose={() => {
          setViewChangeModalOpen(false);
          setSelectedOrderForViewChange(null);
        }}
        orderData={selectedOrderForViewChange}
        hideActionButton={true}
      />

      {/* Batalkan Armada Modal */}
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

      {/* Lihat Armada Modal */}
      <LihatArmadaModal
        isOpen={lihatArmadaModalOpen}
        onClose={() => {
          setLihatArmadaModalOpen(false);
          setSelectedOrderForViewFleet(null);
        }}
        orderData={selectedOrderForViewFleet}
      />

      {/* Alasan Pembatalan Modal */}
      <AlasanPembatalanModal
        isOpen={alasanPembatalanModalOpen}
        onClose={() => {
          setAlasanPembatalanModalOpen(false);
          setSelectedOrderForAlasan(null);
        }}
        order={selectedOrderForAlasan}
        onConfirm={handleCancelOrderWithReason}
      />

      {/* Pilih Armada Batalkan Modal */}
      <PilihArmadaBatalkanModal
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
    </div>
  );
};

export default DaftarPesananAktif;

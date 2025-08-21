"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
import { useGetActiveOrders } from "@/services/Transporter/monitoring/daftar-pesanan-active/getActiveOrders";
import { useGetActiveOrdersCount } from "@/services/Transporter/monitoring/daftar-pesanan-active/getActiveOrdersCount";
import { formatMuatTime } from "@/utils/Transporter/dateTimeUtils";
import {
  ORDER_ACTIONS,
  ORDER_STATUS,
  getOrderStatusActions,
  getOrderStatusBadge,
} from "@/utils/Transporter/orderStatus";

import Onboarding from "../Onboarding/Onboarding";
import AlertPerubahanLokasi from "./components/AlertPerubahanLokasi";

const DaftarPesananAktif = ({
  onToggleExpand,
  isExpanded,
  onViewFleetStatus,
  onTrackFleet,
  hasShownOnboarding,
  onOnboardingShown,
}) => {
  const { t } = useTranslation();
  const { data: activeOrdersCount } = useGetActiveOrdersCount();
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState({});
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
  const router = useRouter();

  // Map filter keys to lowercase status values for API
  const getFilterStatus = (filterKey) => {
    const statusMap = {
      NEED_CHANGE_RESPONSE: "need_change_response",
      NEED_CONFIRMATION_READY: "need_confirmation_ready",
      NEED_ASSIGN_VEHICLE: "need_assign_vehicle",
    };
    return statusMap[filterKey] || null;
  };

  const { data, isLoading } = useGetActiveOrders({
    search: searchValue,
    status: getFilterStatus(selectedFilter),
    ...sortConfig,
  });

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
        const { dateLabel, timeRange, dateColor } = formatMuatTime(row);
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
            titleClassName: "text-xxs font-semibold",
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
          <span className="line-clamp-1 break-all text-xs font-bold">
            {row.truckType.name}
          </span>
          <span className="line-clamp-1 break-all text-xs font-medium">
            <span className="text-neutral-600">
              {t("DaftarPesananAktif.carrierLabel", {}, "Carrier")} :
            </span>{" "}
            {row.carrierTruck.name}
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
                  onClick={() => console.log("View SOS Details", row.sosStatus)}
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
        const statusBadge = getOrderStatusBadge(row.orderStatus);
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
                ? `${statusBadge.label} : ${row.truckCount || 0} Unit`
                : statusBadge.label}
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
        const config = getOrderStatusActions(row.orderStatus, row);

        // If status has dropdown actions
        if (config) {
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
                className={cn("mr-1 mt-0", config.width)}
                side="left"
              >
                {config.actions.map((actionItem, index) => (
                  <SimpleDropdownItem
                    key={index}
                    onClick={() => handleActionClick(actionItem.type, row)}
                    className={cn(
                      "flex h-8 items-center",
                      actionItem.isError &&
                        "text-error-400 hover:text-error-500"
                    )}
                  >
                    {actionItem.label}
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
              {t(
                "DaftarPesananAktif.noActiveOrders",
                {},
                "Belum ada pesanan aktif"
              )}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {t(
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

  const orders = data?.orders || [];
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
            onSearch={(value) => {
              console.log("🔍 Search triggered with value:", value);
              console.log("🔍 Value length:", value.length);
              console.log("🔍 Setting search value to:", value);
              setSearchValue(value);
              // Search functionality is implemented via useGetActiveOrders hook
              // which automatically refetches data when searchValue changes
            }}
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
              <AlertPerubahanLokasi />
              <Table
                data={orders}
                columns={columns}
                loading={isLoading}
                onSort={handleSort}
                sortConfig={sortConfig}
                emptyComponent={
                  searchValue && searchValue.length > 2 ? (
                    <SearchNotFound searchTerm={searchValue} className="py-0" />
                  ) : (
                    renderEmptyState()
                  )
                }
              />
            </div>
          )}
        </div>
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

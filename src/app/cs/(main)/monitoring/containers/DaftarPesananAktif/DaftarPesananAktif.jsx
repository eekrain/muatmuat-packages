"use client";

import { useState } from "react";

import DataNotFound from "@/components/DataNotFound/DataNotFound";
import FormDropdown from "@/components/Form/Dropdown";
import IconComponent from "@/components/IconComponent/IconComponent";
import NotificationDot from "@/components/NotificationDot/NotificationDot";
import Search from "@/components/Search/Search";
import { cn } from "@/lib/utils";
import { useGetActiveOrders } from "@/services/Transporter/monitoring/daftar-pesanan-active/getActiveOrders";
import { useGetActiveOrdersCount } from "@/services/Transporter/monitoring/daftar-pesanan-active/getActiveOrdersCount";
import { ORDER_ACTIONS } from "@/utils/Transporter/orderStatus";

import Onboarding from "../Onboarding/Onboarding";
import AssignArmadaModal from "./components/AssignArmadaModal";
import ConfirmReadyModal from "./components/ConfirmReadyModal";
import DaftarPesananAktifListItem from "./components/DaftarPesananAktifListItem";
import RespondChangeModal from "./components/RespondChangeModal";

const DaftarPesananAktif = ({
  onToggleExpand,
  isExpanded,
  onViewFleetStatus,
  hasShownOnboarding,
  onOnboardingShown,
}) => {
  const { data: activeOrdersCount } = useGetActiveOrdersCount();
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("");
  const [selectedGroupBy, setSelectedGroupBy] = useState("BY_PESANAN");
  const [selectedSort, setSelectedSort] = useState("WAKTU_MUAT_TERDEKAT");
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [assignArmadaModalOpen, setAssignArmadaModalOpen] = useState(false);
  const [selectedOrderForArmada, setSelectedOrderForArmada] = useState(null);
  const [confirmReadyModalOpen, setConfirmReadyModalOpen] = useState(false);
  const [selectedOrderForConfirm, setSelectedOrderForConfirm] = useState(null);
  const [respondChangeModalOpen, setRespondChangeModalOpen] = useState(false);
  const [selectedOrderForChange, setSelectedOrderForChange] = useState(null);

  // Map filter keys to lowercase status values for API
  const getFilterStatus = () => {
    if (!selectedStatusFilter) return null;

    const statusMap = {
      NEED_CHANGE_RESPONSE: "need_change_response",
      NEED_CONFIRMATION_READY: "need_confirmation_ready",
      NEED_ASSIGN_VEHICLE: "need_assign_vehicle",
    };
    return statusMap[selectedStatusFilter] || null;
  };

  const { data, isLoading } = useGetActiveOrders({
    search: searchValue,
    status: getFilterStatus(),
  });

  // Handle action button clicks based on action type
  const handleActionClick = (actionType, row) => {
    switch (actionType) {
      case ORDER_ACTIONS.TRACK_FLEET.type:
        // TODO: Implement fleet tracking navigation
        break;
      case ORDER_ACTIONS.VIEW_FLEET.type:
        // TODO: Implement view fleet
        break;
      case ORDER_ACTIONS.VIEW_ORDER_DETAIL.type:
        // TODO: Implement view order detail
        break;
      case ORDER_ACTIONS.DETAIL_ARMADA.type:
        // TODO: Implement detail armada
        break;
      case ORDER_ACTIONS.CANCEL_ORDER.type:
        // TODO: Implement cancel order
        break;
      case ORDER_ACTIONS.ASSIGN_FLEET.type:
        setSelectedOrderForArmada(row);
        setAssignArmadaModalOpen(true);
        break;
      case ORDER_ACTIONS.CHANGE_UNIT_COUNT.type:
        // TODO: Implement change unit count
        break;
      case ORDER_ACTIONS.RESPOND_CHANGE.type:
        setSelectedOrderForChange(row);
        setRespondChangeModalOpen(true);
        setOpenDropdowns((prev) => ({ ...prev, [row.id]: false }));
        break;
      case ORDER_ACTIONS.CANCEL_FLEET.type:
        // TODO: Implement cancel fleet
        break;
      case ORDER_ACTIONS.CONFIRM_READY.type:
        setSelectedOrderForConfirm(row);
        setConfirmReadyModalOpen(true);
        setOpenDropdowns((prev) => ({ ...prev, [row.id]: false }));
        break;
      default:
        // TODO: Handle unknown action
        break;
    }
  };

  const orders = data?.orders || [];
  const totalActiveOrders = activeOrdersCount?.totalActiveOrders || 0;
  const availableStatuses = data?.availableStatuses || {};

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

    return [{ value: "", label: "Semua Status (Default)" }, ...urgentStatuses];
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
        <div className="flex w-full items-center gap-3">
          {/* Filter Dropdowns */}
          <div className="flex flex-1 items-center gap-3">
            {/* Status Urgent Dropdown */}
            <div className="relative">
              <div className="relative">
                <FormDropdown
                  value={selectedStatusFilter}
                  onChange={setSelectedStatusFilter}
                  placeholder={`Status Urgent (${getStatusUrgentCount() > 99 ? "99+" : getStatusUrgentCount()})`}
                  options={getStatusOptions()}
                  className="w-[130px]"
                  searchable={false}
                />
                {getStatusUrgentCount() > 0 && (
                  <NotificationDot
                    position="absolute"
                    positionClasses="right-[1px] top-[-1px]"
                    size="md"
                    color="red"
                    animated={true}
                  />
                )}
              </div>
            </div>

            {/* Group By Dropdown */}
            <FormDropdown
              value={selectedGroupBy}
              onChange={setSelectedGroupBy}
              placeholder="By Pesanan"
              options={groupByOptions}
              className="w-[104px]"
              searchable={false}
            />

            {/* Sort Dropdown */}
            <FormDropdown
              value={selectedSort}
              onChange={setSelectedSort}
              placeholder="Waktu M..."
              options={sortOptions}
              className="w-[120px]"
              searchable={false}
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
            disabled={totalActiveOrders === 0}
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
              ) : orders.length === 0 ? (
                <div className="flex h-full items-center justify-center p-4">
                  <div className="text-center">
                    <p className="text-base font-semibold text-neutral-600">
                      Belum ada pesanan aktif
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Pesanan aktif akan muncul di sini
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  {orders.map((order) => (
                    <DaftarPesananAktifListItem
                      key={order.id}
                      row={order}
                      isOpen={openDropdowns[order.id]}
                      onToggleDropdown={(id, isOpen) =>
                        setOpenDropdowns((prev) => ({ ...prev, [id]: isOpen }))
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

      {/* Respond Change Modal */}
      <RespondChangeModal
        isOpen={respondChangeModalOpen}
        onClose={() => {
          setRespondChangeModalOpen(false);
          setSelectedOrderForChange(null);
        }}
        orderData={selectedOrderForChange}
      />
    </div>
  );
};

export default DaftarPesananAktif;

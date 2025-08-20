"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ChevronDown } from "lucide-react";
import { MoreVertical } from "lucide-react";

import TruncatedTooltip from "@/app/transporter/(main)/dashboard/real-time/components/TruncatedTooltip";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

import {
  ORDER_STATUS,
  statusDisplayMap,
  useGetActionItems,
  useLoadingTime,
} from "../helpers/pesananCard.helpers";
import BadgeOrderType from "./BadgeOrderType";
import CancelFleetModal from "./CancelFleetModal";
import CancelReasonModal from "./CancelReasonModal";
import CargoInfo from "./CargoInfo";
import ContactModal from "./ContactModal";
import FleetListModal from "./FleetListModal";
import MuatBongkarStepperWithModal from "./MuatBongkarStepperWithModal";
import OrderChangeInfoModal from "./OrderChangeInfoModal";

const PesananCard = ({ order, userRole, viewMode = "default" }) => {
  const { t } = useTranslation();

  const [modalState, setModalState] = useState({
    contact: false,
    changeInfo: false,
    fleetList: false,
    cancelFleet: false,
    cancelOrderReason: false,
    cancelFleetReason: false,
    permissionDeniedTitle: null,
    confirmCancelOrder: false,
    confirmCancelFleet: false,
  });

  const [modalData, setModalData] = useState({
    contactId: null,
    changeDetails: null,
    fleetList: [],
    fleetToCancel: [],
  });

  const [isLoading, setIsLoading] = useState(false);

  const openModal = (modalName) =>
    setModalState((prev) => ({ ...prev, [modalName]: true }));
  const closeModal = (modalName) =>
    setModalState((prev) => ({ ...prev, [modalName]: false }));

  const { dateLabel, timeRange, dateColor } = useLoadingTime(
    order.loadingSchedule
  );

  const handleOpenChangeInfoModal = async () => {
    openModal("changeInfo");
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/cs/orders/${order.id}/changes`);
      const result = await response.json();
      setModalData((prev) => ({ ...prev, changeDetails: result.Data }));
    } catch (error) {
      console.error("Failed to fetch change details", error);
      setModalData((prev) => ({ ...prev, changeDetails: null }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewFleet = async () => {
    openModal("fleetList");
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/cs/orders/${order.id}/vehicles`);
      const result = await res.json();
      setModalData((prev) => ({ ...prev, fleetList: result.Data || [] }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelFleet = () => {
    if (userRole !== "GM") {
      setModalState((prev) => ({
        ...prev,
        permissionDeniedTitle: "Batalkan Armada",
      }));
      return;
    }
    openModal("confirmCancelFleet");
  };

  const proceedToSelectFleetToCancel = async () => {
    closeModal("confirmCancelFleet");
    openModal("cancelFleet");
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/cs/orders/${order.id}/vehicles`);
      const result = await res.json();
      setModalData((prev) => ({ ...prev, fleetList: result.Data || [] }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = () => {
    if (userRole !== "GM") {
      setModalState((prev) => ({
        ...prev,
        permissionDeniedTitle: "Batalkan Pesanan",
      }));
      return;
    }
    openModal("confirmCancelOrder");
  };

  const handleViewCancellationReason = () => {
    console.log("OPEN MODAL VIEW CANCELLATION ###BELUMMM");
  };

  const actionItems = useGetActionItems({
    order,
    userRole,
    onViewChange: handleOpenChangeInfoModal,
    onViewFleet: handleViewFleet,
    onCancelFleet: handleCancelFleet,
    onCancelOrder: handleCancelOrder,
    onViewCancellationReason: handleViewCancellationReason,
  });

  const handleActionClick = (action) => {
    if (action.onClick) {
      action.onClick();
      return;
    }
    if (action.disabled) {
      toast.error(
        t(
          "pesananCard.toastPermissionDenied",
          {},
          "Aksi ini hanya dapat dilakukan oleh GM."
        )
      );
      return;
    }
    if (action.isLink) {
      window.open(action.href, "_blank");
    } else {
      toast.success(`${action.label} diklik!`);
    }
  };

  const handleOpenContactModal = (contactId) => {
    setModalData((prev) => ({ ...prev, contactId }));
    openModal("contact");
  };

  const multiStatusMemo = useMemo(() => {
    if (
      order.unitStatuses &&
      Array.isArray(order.unitStatuses) &&
      order.unitStatuses.length > 1
    ) {
      const statusCounts = order.unitStatuses.reduce((acc, unit) => {
        acc[unit.status] = (acc[unit.status] || 0) + 1;
        return acc;
      }, {});
      const uniqueStatuses = Object.keys(statusCounts);
      if (uniqueStatuses.length > 1) {
        const dominantStatus = uniqueStatuses.sort(
          (a, b) => statusCounts[b] - statusCounts[a]
        )[0];
        return {
          hasMultiple: true,
          dominantStatus: dominantStatus,
          dominantStatusUnitCount: statusCounts[dominantStatus],
        };
      }
    }
    return { hasMultiple: false };
  }, [order.unitStatuses]);

  const statusInfo = statusDisplayMap[order.orderStatus] || {
    text: order.orderStatus,
    variant: "primary",
  };

  return (
    <>
      <div className="relative z-0 flex w-full flex-col items-start border-b border-neutral-400 bg-white last:rounded-b-xl last:border-none">
        {viewMode === "default" && (
          <div className="flex w-full flex-row items-center justify-between border-t border-neutral-400 bg-neutral-100 py-3">
            <div className="flex w-full flex-row items-center gap-1">
              {/* Transporter Section */}
              <div className="flex w-full items-center gap-2 border-r border-neutral-400 px-4">
                <span className="shrink-0 text-xs font-medium text-neutral-600">
                  {t("pesananCard.labelTransporter", {}, "Transporter :")}
                </span>
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muat-parts-non-500">
                  <span className="text-xs font-bold text-white">
                    {order.transporter.name.charAt(0)}
                  </span>
                </div>
                {/* FIXED TOOLTIP USAGE */}
                <TruncatedTooltip
                  text={order.transporter.name}
                  lineClamp={1}
                  className="line-clamp-1 flex-grow text-xs font-semibold text-black"
                />
                <div className="border-l border-neutral-400 py-1 pl-2">
                  <Button
                    variant="link"
                    onClick={() => handleOpenContactModal(order.transporter.id)}
                    iconLeft={
                      <IconComponent
                        src="/icons/ic-contact-phone.svg"
                        className="h-4 w-4"
                      />
                    }
                    className="flex items-center gap-1 p-0 text-xs font-medium text-primary-700 hover:text-primary-800"
                  >
                    {t("pesananCard.contact", {}, "Hubungi")}
                  </Button>
                </div>
              </div>

              {/* Shipper Section */}
              <div className="flex w-full items-center gap-2 border-l border-neutral-400 px-4">
                <span className="shrink-0 text-xs font-medium text-neutral-600">
                  {t("pesananCard.labelShipper", {}, "Shipper :")}
                </span>
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-700">
                  <span className="text-xs font-bold text-white">
                    {order.shipper.name.charAt(0)}
                  </span>
                </div>
                {/* FIXED TOOLTIP USAGE */}
                <TruncatedTooltip
                  text={order.shipper.name}
                  lineClamp={1}
                  className="line-clamp-1 flex-grow text-xs font-semibold text-black"
                />
                <div className="border-l border-neutral-400 py-1 pl-2">
                  <Button
                    variant="link"
                    onClick={() => handleOpenContactModal(order.shipper.id)}
                    iconLeft={
                      <IconComponent
                        src="/icons/ic-contact-phone.svg"
                        className="h-4 w-4"
                      />
                    }
                    className="flex items-center gap-1 p-0 text-xs font-medium text-primary-700 hover:text-primary-800"
                  >
                    {t("pesananCard.contact", {}, "Hubungi")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex w-full shrink-0 items-start gap-4 p-4">
          {/* Order Code & Type */}
          <div className="grid w-full grid-cols-2">
            <div className="flex">
              <div className="flex w-full max-w-[120px] flex-col gap-2.5">
                <div className="line-clamp-1 flex items-center truncate text-xxs font-semibold">
                  {/* CORRECT TOOLTIP USAGE (default icon trigger) */}
                  {order.orderStatus === ORDER_STATUS.MENUNGGU_KONFIRMASI && (
                    <InfoTooltip
                      side="right"
                      appearance={{
                        iconClassName: "text-primary-700 mr-[2px] size-[18px]",
                      }}
                    >
                      <p className="max-w-[312px]">
                        {t(
                          "pesananCard.tooltipWaitingConfirmation",
                          {},
                          "Armada telah tercatat untuk pesanan ini, shipper perlu membayar pesanan ini agar pesanan dapat terkonfirmasi."
                        )}
                      </p>
                    </InfoTooltip>
                  )}
                  {order.orderStatus === ORDER_STATUS.PERLU_KONFIRMASI_SIAP && (
                    <InfoTooltip
                      icon="/icons/warning20.svg"
                      side="right"
                      appearance={{
                        iconClassName: "text-error-400 mr-[2px] size-[18px]",
                      }}
                    >
                      <p className="max-w-[312px]">
                        {t(
                          "pesananCard.tooltipNeedConfirmation",
                          {},
                          "Pesanan belum di konfirmasi siap, transporter perlu segera melakukan pengecekan kesiapan armada dan konfirmasi siap sebelum waktu muat."
                        )}
                      </p>
                    </InfoTooltip>
                  )}
                  {order.orderStatus ===
                    ORDER_STATUS.PERLU_RESPON_PERUBAHAN && (
                    <InfoTooltip
                      icon="/icons/warning20.svg"
                      side="right"
                      appearance={{
                        iconClassName: "text-warning-900 mr-[2px] size-[18px]",
                      }}
                    >
                      <p className="max-w-[312px]">
                        {t(
                          "pesananCard.tooltipNeedResponse",
                          {},
                          "Terdapat perubahan pesanan dari shipper, transporter perlu segera memberi respon."
                        )}
                      </p>
                    </InfoTooltip>
                  )}
                  {order.orderStatus === ORDER_STATUS.PERLU_ASSIGN_ARMADA && (
                    <InfoTooltip
                      icon="/icons/warning20.svg"
                      side="right"
                      appearance={{
                        iconClassName: "text-warning-900 mr-[2px] size-[18px]",
                      }}
                    >
                      <p className="max-w-[312px]">
                        {t(
                          "pesananCard.tooltipNeedAssign",
                          {},
                          "Belum ada armada yang ditugaskan untuk pesanan ini, transporter perlu segera menugaskan armada sebelum waktu muat."
                        )}
                      </p>
                    </InfoTooltip>
                  )}
                  <Link href={`/daftar-pesanan/${order.id}`} target="_blank">
                    <span className="text-xs font-medium text-primary-700 hover:cursor-pointer hover:text-primary-800">
                      {order.orderCode}
                    </span>
                  </Link>
                </div>
                <BadgeOrderType type={order.orderType} />
              </div>

              {/* Waktu Muat */}
              <div className="flex w-[216px] shrink-0 flex-col gap-1">
                <span className={`text-xs font-semibold ${dateColor}`}>
                  {dateLabel}
                </span>
                <span className="text-xxs font-medium">{timeRange}</span>
              </div>

              {/* Rute Muat & Bongkar */}
              <div className="flex w-[160px] shrink-0">
                <MuatBongkarStepperWithModal
                  pickupLocations={order.pickupLocations}
                  dropoffLocations={order.dropoffLocations}
                  appearance={{ titleClassName: "font-semibold" }}
                />
              </div>
            </div>
            <div
              className={cn(
                "flex justify-between",
                viewMode === "default" && "gap-6"
              )}
            >
              <div className="ml-12 mr-3 flex w-[316px] flex-col gap-1">
                <TruncatedTooltip
                  text={order.truckType.name}
                  lineClamp={1}
                  className="text-xs font-bold"
                />

                <TruncatedTooltip
                  text={order.carrierTruck.name}
                  className="text-xs font-medium text-neutral-900"
                  lineClamp={1}
                />

                <div className="mt-1 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <IconComponent
                      src="/icons/monitoring/daftar-pesanan-aktif/truck.svg"
                      className="h-4 w-4 text-gray-600"
                    />
                    <span className="text-xxs font-medium">
                      {order.truckCount} Unit
                    </span>
                  </div>
                  <span className="text-xxs text-gray-400">•</span>
                  <CargoInfo
                    cargoItems={order.cargoItems}
                    totalWeight={order.totalWeight}
                    weightUnit={order.weightUnit}
                  />
                </div>
                {order.sosStatus?.hasSos && order.sosStatus?.sosCount > 0 && (
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex h-[14px] items-center gap-1 rounded bg-error-400 px-1">
                      <span className="text-[8px] font-bold leading-[130%] text-white">
                        {t("pesananCard.labelSOS", {}, "SOS")} :{" "}
                        {order.sosStatus.sosCount} Unit
                      </span>
                    </div>
                    <Link
                      href="/monitoring?tab=sos"
                      target="_blank"
                      className="text-xs font-medium text-primary-700 no-underline hover:text-primary-800"
                    >
                      {t("pesananCard.viewSOS", {}, "Lihat SOS")}
                    </Link>
                  </div>
                )}
              </div>
              {multiStatusMemo.hasMultiple ? (
                <div
                  className={cn(
                    "flex flex-col items-center",
                    viewMode !== "default" && "ml-16"
                  )}
                >
                  <BadgeStatusPesanan
                    variant={
                      statusDisplayMap[multiStatusMemo.dominantStatus]
                        ?.variant || "primary"
                    }
                    className="!h-fit w-[120px] w-full !items-center !justify-center py-1 !text-center"
                  >
                    {statusDisplayMap[multiStatusMemo.dominantStatus]?.text ||
                      multiStatusMemo.dominantStatus}{" "}
                    : <br />
                    {multiStatusMemo.dominantStatusUnitCount} Unit
                  </BadgeStatusPesanan>
                  <Link
                    href={`/daftar-pesanan/${order.id}/lacak-armada`}
                    target="_blank"
                  >
                    <span className="mt-1 cursor-pointer text-xs font-medium text-primary-700 hover:text-primary-800">
                      {t(
                        "pesananCard.viewOtherStatus",
                        {},
                        "Lihat Status Lainnya"
                      )}
                    </span>
                  </Link>
                </div>
              ) : (
                <div className={cn("flex flex-col gap-2")}>
                  <BadgeStatusPesanan
                    variant={statusInfo.variant}
                    className={cn(
                      "!h-fit w-[120px] !items-center !justify-center py-1 !text-center"
                    )}
                  >
                    {statusInfo.text}
                  </BadgeStatusPesanan>
                  {order.orderStatus.includes("DIBATALKAN") && (
                    <Button
                      variant="link"
                      onClick={handleViewCancellationReason}
                      className="p-0 text-xs font-medium text-primary-700 hover:text-primary-800"
                    >
                      {t(
                        "pesananCard.viewCancellationReason",
                        {},
                        "Alasan Pembatalan"
                      )}
                    </Button>
                  )}
                </div>
              )}

              {/* Status & Actions */}
              <div className="flex w-fit flex-col items-end gap-2">
                <SimpleDropdown>
                  <SimpleDropdownTrigger asChild>
                    {viewMode !== "default" ? (
                      <button className="rounded-md p-1 hover:bg-neutral-100">
                        <MoreVertical className="h-5 w-5 text-neutral-900" />
                      </button>
                    ) : (
                      <button className="flex h-8 flex-row items-center justify-between gap-2 rounded-md border border-neutral-400 bg-white px-3 py-2 shadow-sm transition-colors duration-150 hover:border-primary-700 hover:bg-gray-50 focus:outline-none">
                        <span className="text-xs font-medium leading-tight text-black">
                          {t("pesananCard.action", {}, "Aksi")}
                        </span>
                        <ChevronDown className="h-3 w-3 text-neutral-700" />
                      </button>
                    )}
                  </SimpleDropdownTrigger>
                  <SimpleDropdownContent
                    className="w-fit -space-y-1 border-2"
                    align="end"
                  >
                    {actionItems.map((action, index) => (
                      <SimpleDropdownItem
                        key={index}
                        onClick={() => handleActionClick(action)}
                        disabled={action.disabled}
                        className={action.isDestructive ? "text-error-500" : ""}
                      >
                        {action.label}
                      </SimpleDropdownItem>
                    ))}
                  </SimpleDropdownContent>
                </SimpleDropdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={modalState.contact}
        onClose={() => closeModal("contact")}
        contactId={modalData.contactId}
        useMockData={true}
      />
      <OrderChangeInfoModal
        isOpen={modalState.changeInfo}
        onClose={() => closeModal("changeInfo")}
        changeDetails={modalData.changeDetails}
        isLoading={isLoading}
        onHubungi={() => {
          closeModal("changeInfo");
          handleOpenContactModal(order.transporter.id);
        }}
      />
      <FleetListModal
        isOpen={modalState.fleetList}
        onClose={() => closeModal("fleetList")}
        vehicles={modalData.fleetList}
        isLoading={isLoading}
      />
      <CancelFleetModal
        isOpen={modalState.cancelFleet}
        onClose={() => closeModal("cancelFleet")}
        vehicles={modalData.fleetList}
        isLoading={isLoading}
        onSubmit={(fleetIds) => {
          setModalData((prev) => ({ ...prev, fleetToCancel: fleetIds }));
          closeModal("cancelFleet");
          openModal("cancelFleetReason");
        }}
      />
      <CancelReasonModal
        isOpen={modalState.cancelFleetReason}
        onClose={() => closeModal("cancelFleetReason")}
        onSubmit={(reason) => {
          toast.success(
            `Berhasil membatalkan ${modalData.fleetToCancel.length} armada dari pesanan ${order.orderCode} - ${order.transporter.name}`
          );
          closeModal("cancelFleetReason");
        }}
        title="Masukkan Alasan Pembatalan"
        placeholder="Masukkan alasan pembatalan"
      />
      <ConfirmationModal
        isOpen={modalState.confirmCancelOrder}
        setIsOpen={(val) => !val && closeModal("confirmCancelOrder")}
        title={{ text: "Batalkan Pesanan" }}
        description={{
          text: `Apakah kamu yakin ingin membatalkan pesanan ${order.orderCode}?`,
        }}
        cancel={{
          text: "Kembali",
          classname:
            "bg-[--muat-trans-primary-400] text-neutral-900 hover:bg-[--muat-trans-primary-500] !border-none",
        }}
        confirm={{
          text: "Ya, Batalkan",
          onClick: () => {
            closeModal("confirmCancelOrder");
            toast.success(
              `Berhasil membatalkan pesanan ${order.orderCode} - ${order.transporter.name}`
            );
          },
          classname:
            "border border-[--muat-trans-secondary-900] bg-neutral-50 text-[--muat-trans-secondary-900] hover:bg-[--muat-trans-secondary-50]",
        }}
      />
      <ConfirmationModal
        isOpen={modalState.confirmCancelFleet}
        setIsOpen={(val) => !val && closeModal("confirmCancelFleet")}
        title={{ text: "Batalkan Armada" }}
        description={{
          text: `Apakah kamu yakin ingin membatalkan armada dari pesanan ${order.orderCode}?`,
        }}
        cancel={{
          text: "Kembali",
          classname:
            "bg-[--muat-trans-primary-400] text-neutral-900 hover:bg-[--muat-trans-primary-500] !border-none",
        }}
        confirm={{
          text: "Ya, Batalkan",
          onClick: proceedToSelectFleetToCancel,
          classname:
            "border border-[--muat-trans-secondary-900] bg-neutral-50 text-[--muat-trans-secondary-900] hover:bg-[--muat-trans-secondary-50]",
        }}
      />
      <ConfirmationModal
        isOpen={!!modalState.permissionDeniedTitle}
        setIsOpen={() =>
          setModalState((prev) => ({ ...prev, permissionDeniedTitle: null }))
        }
        title={{ text: modalState.permissionDeniedTitle || "" }}
        description={{
          text: "Maaf, kamu belum memiliki akses. Pembatalan Armada maupun pesanan hanya bisa dilakukan oleh akses sebagai GM.",
        }}
        withCancel={false}
        confirm={{ text: "Oke" }}
      />
    </>
  );
};

export default PesananCard;

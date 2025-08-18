"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ChevronDown } from "lucide-react";

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
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";

import BadgeOrderType from "./BadgeOrderType";
import ContactModal from "./ContactModal";
import MuatBongkarStepperWithModal from "./MuatBongkarStepperWithModal";
import OrderChangeInfoModal from "./OrderChangeInfoModal";

const ORDER_STATUS = {
  MENUNGGU_KONFIRMASI: "MENUNGGU_KONFIRMASI",
  ARMADA_DIJADWALKAN: "ARMADA_DIJADWALKAN",
  PERLU_ASSIGN_ARMADA: "PERLU_ASSIGN_ARMADA",
  PERLU_KONFIRMASI_SIAP: "PERLU_KONFIRMASI_SIAP",
  PERLU_RESPON_PERUBAHAN: "PERLU_RESPON_PERUBAHAN",
  PROSES_MUAT: "PROSES_MUAT",
  PROSES_BONGKAR: "PROSES_BONGKAR",
  DOKUMEN_SEDANG_DISIAPKAN: "DOKUMEN_SEDANG_DISIAPKAN",
  PROSES_PENGIRIMAN_DOKUMEN: "PROSES_PENGIRIMAN_DOKUMEN",
};

const statusDisplayMap = {
  [ORDER_STATUS.MENUNGGU_KONFIRMASI]: {
    text: "Menunggu Konfirmasi",
    variant: "primary",
  },
  [ORDER_STATUS.ARMADA_DIJADWALKAN]: {
    text: "Armada Dijadwalkan",
    variant: "primary",
  },
  [ORDER_STATUS.PERLU_ASSIGN_ARMADA]: {
    text: "Perlu Assign Armada",
    variant: "warning",
  },
  [ORDER_STATUS.PERLU_KONFIRMASI_SIAP]: {
    text: "Perlu Konfirmasi Siap",
    variant: "error",
  },
  [ORDER_STATUS.PERLU_RESPON_PERUBAHAN]: {
    text: "Perlu Respon Perubahan",
    variant: "warning",
  },
  [ORDER_STATUS.PROSES_MUAT]: { text: "Proses Muat", variant: "primary" },
  [ORDER_STATUS.PROSES_BONGKAR]: { text: "Proses Bongkar", variant: "primary" },
  [ORDER_STATUS.DOKUMEN_SEDANG_DISIAPKAN]: {
    text: "Dokumen Sedang Disiapkan",
    variant: "primary",
  },
  [ORDER_STATUS.PROSES_PENGIRIMAN_DOKUMEN]: {
    text: "Proses Pengiriman Dokumen",
    variant: "primary",
  },
};

// Helper to get action items
const getActionItems = ({ order, userRole, t, onViewChange }) => {
  const actions = [];
  const canCancelOrder = userRole === "GM";
  const hasMultipleUnits = order.truckCount > 1;

  switch (order.orderStatus) {
    case ORDER_STATUS.MENUNGGU_KONFIRMASI:
      actions.push({
        label: t("pesananCard.actionViewFleet", {}, "Lihat Armada"),
      });
      actions.push({
        label: t("pesananCard.actionViewDetail", {}, "Detail Pesanan"),
        isLink: true,
        href: `/daftar-pesanan/${order.id}`,
      });
      if (hasMultipleUnits) {
        actions.push({
          label: t("pesananCard.actionCancelFleet", {}, "Batalkan Armada"),
          isDestructive: true,
        });
      }
      actions.push({
        label: t("pesananCard.actionCancelOrder", {}, "Batalkan Pesanan"),
        isDestructive: true,
        disabled: !canCancelOrder,
      });
      break;
    case ORDER_STATUS.ARMADA_DIJADWALKAN:
      actions.push({
        label: t("pesananCard.actionViewFleet", {}, "Lihat Armada"),
      });
      actions.push({
        label: t("pesananCard.actionViewDetail", {}, "Detail Pesanan"),
        isLink: true,
        href: `/daftar-pesanan/${order.id}`,
      });
      if (order.orderType === "Terjadwal") {
        actions.push({
          label: t("pesananCard.actionCancelFleet", {}, "Batalkan Armada"),
          isDestructive: true,
        });
        actions.push({
          label: t("pesananCard.actionCancelOrder", {}, "Batalkan Pesanan"),
          isDestructive: true,
          disabled: !canCancelOrder,
        });
      }
      break;
    case ORDER_STATUS.PERLU_ASSIGN_ARMADA:
      actions.push({
        label: t("pesananCard.actionViewDetail", {}, "Detail Pesanan"),
        isLink: true,
        href: `/daftar-pesanan/${order.id}`,
      });
      if (hasMultipleUnits) {
        actions.push({
          label: t("pesananCard.actionCancelFleet", {}, "Batalkan Armada"),
          isDestructive: true,
        });
      }
      actions.push({
        label: t("pesananCard.actionCancelOrder", {}, "Batalkan Pesanan"),
        isDestructive: true,
        disabled: !canCancelOrder,
      });
      break;
    case ORDER_STATUS.PERLU_KONFIRMASI_SIAP:
    case ORDER_STATUS.PERLU_RESPON_PERUBAHAN:
      actions.push({
        label: t("pesananCard.actionViewChange", {}, "Lihat Perubahan"),
        onClick: onViewChange,
      });
      actions.push({
        label: t("pesananCard.actionTrackFleet", {}, "Lacak Armada"),
      });
      actions.push({
        label: t("pesananCard.actionViewFleet", {}, "Lihat Armada"),
      });
      actions.push({
        label: t("pesananCard.actionViewDetail", {}, "Detail Pesanan"),
        isLink: true,
        href: `/daftar-pesanan/${order.id}`,
      });
      actions.push({
        label: t("pesananCard.actionCancelOrder", {}, "Batalkan Pesanan"),
        isDestructive: true,
        disabled: !canCancelOrder,
      });
      break;
    case ORDER_STATUS.PROSES_MUAT:
      actions.push({
        label: t("pesananCard.actionTrackFleet", {}, "Lacak Armada"),
      });
      actions.push({
        label: t("pesananCard.actionViewFleet", {}, "Lihat Armada"),
      });
      actions.push({
        label: t("pesananCard.actionViewDetail", {}, "Detail Pesanan"),
        isLink: true,
        href: `/daftar-pesanan/${order.id}`,
      });
      actions.push({
        label: t("pesananCard.actionCancelFleet", {}, "Batalkan Armada"),
        isDestructive: true,
      });
      actions.push({
        label: t("pesananCard.actionCancelOrder", {}, "Batalkan Pesanan"),
        isDestructive: true,
        disabled: !canCancelOrder,
      });
      break;
    case ORDER_STATUS.PROSES_BONGKAR:
      actions.push({
        label: t("pesananCard.actionTrackFleet", {}, "Lacak Armada"),
      });
      actions.push({
        label: t("pesananCard.actionViewFleet", {}, "Lihat Armada"),
      });
      actions.push({
        label: t("pesananCard.actionViewDetail", {}, "Detail Pesanan"),
        isLink: true,
        href: `/daftar-pesanan/${order.id}`,
      });
      break;
    case ORDER_STATUS.DOKUMEN_SEDANG_DISIAPKAN:
      actions.push({
        label: t("pesananCard.actionUploadArchive", {}, "Unggah Dokumen Arsip"),
      });
      actions.push({
        label: t("pesananCard.actionUploadReceipt", {}, "Unggah Resi"),
      });
      actions.push({
        label: t("pesananCard.actionViewFleet", {}, "Lihat Armada"),
      });
      actions.push({
        label: t("pesananCard.actionViewDetail", {}, "Detail Pesanan"),
        isLink: true,
        href: `/daftar-pesanan/${order.id}`,
      });
      break;
    case ORDER_STATUS.PROSES_PENGIRIMAN_DOKUMEN:
      actions.push({
        label: t("pesananCard.actionViewArchive", {}, "Lihat Dokumen Arsip"),
      });
      actions.push({
        label: t("pesananCard.actionViewReceipt", {}, "Lihat Resi Pengiriman"),
      });
      actions.push({
        label: t("pesananCard.actionViewFleet", {}, "Lihat Armada"),
      });
      actions.push({
        label: t("pesananCard.actionViewDetail", {}, "Detail Pesanan"),
        isLink: true,
        href: `/daftar-pesanan/${order.id}`,
      });
      break;
    default:
      actions.push({
        label: t("pesananCard.actionViewDetail", {}, "Detail Pesanan"),
        isLink: true,
        href: `/daftar-pesanan/${order.id}`,
      });
  }
  return actions;
};

// Helper for date formatting
const useLoadingTime = (schedule) => {
  const { t } = useTranslation();
  return useMemo(() => {
    const now = new Date();
    const startDate = new Date(schedule.startDate);
    const endDate = schedule.endDate ? new Date(schedule.endDate) : null;

    const startOfDay = (date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.ceil(
      (startOfDay(startDate) - startOfDay(now)) / (1000 * 60 * 60 * 24)
    );

    let dateLabel = t(
      "pesananCard.dateLabelOver5Days",
      {},
      "Muat >5 Hari Lagi"
    );
    let dateColor = "text-primary-700";

    if (diffDays <= 0) {
      dateLabel = t("pesananCard.dateLabelToday", {}, "Muat Hari Ini");
      dateColor = "text-success-700";
    } else if (diffDays === 1) {
      dateLabel = t("pesananCard.dateLabelTomorrow", {}, "Muat Besok");
      dateColor = "text-success-700";
    } else if (diffDays <= 5) {
      dateLabel = t(
        "pesananCard.dateLabelWithin5Days",
        { days: diffDays },
        `Muat ${diffDays} Hari Lagi`
      );
      dateColor = "text-warning-700";
    }

    const fullDateTimeOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    };
    const timeOnlyOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    };

    const formatterFull = new Intl.DateTimeFormat("id-ID", fullDateTimeOptions);
    const formatterTime = new Intl.DateTimeFormat("id-ID", timeOnlyOptions);

    let timeRange = `${formatterFull.format(startDate)} WIB`;

    if (endDate) {
      const isSameDay =
        startOfDay(startDate).getTime() === startOfDay(endDate).getTime();
      const endFormatted = isSameDay
        ? formatterTime.format(endDate)
        : formatterFull.format(endDate);
      timeRange = `${formatterFull.format(startDate)} WIB s/d ${endFormatted} WIB`;
    }

    return { dateLabel, timeRange, dateColor };
  }, [schedule, t]);
};

const PesananCard = ({ order, userRole, className }) => {
  const { t } = useTranslation();
  const { dateLabel, timeRange, dateColor } = useLoadingTime(
    order.loadingSchedule
  );
  const statusInfo = statusDisplayMap[order.orderStatus] || {
    text: order.orderStatus,
    variant: "primary",
  };

  const [isChangeInfoModalOpen, setIsChangeInfoModalOpen] = useState(false);
  const [changeDetails, setChangeDetails] = useState(null);
  const [isLoadingChange, setIsLoadingChange] = useState(false);

  const [isHubungiModalOpen, setIsHubungiModalOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);

  const handleOpenContactModal = (contactId) => {
    setSelectedContactId(contactId);
    setIsHubungiModalOpen(true);
  };

  const handleOpenChangeInfoModal = async () => {
    setIsChangeInfoModalOpen(true);
    setIsLoadingChange(true);
    try {
      const response = await fetch(`/api/v1/cs/orders/${order.id}/changes`);
      const result = await response.json();
      setChangeDetails(result.Data);
    } catch (error) {
      console.error("Failed to fetch change details", error);
      setChangeDetails(null);
    } finally {
      setIsLoadingChange(false);
    }
  };

  const actionItems = getActionItems({
    order,
    userRole,
    t,
    onViewChange: handleOpenChangeInfoModal,
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

  const cargoItems = order.cargoItems || [];
  const firstCargoItem = cargoItems.length > 0 ? cargoItems[0] : null;
  const otherCargoItems = cargoItems.length > 1 ? cargoItems.slice(1) : [];
  const otherCargoItemsCount = otherCargoItems.length;

  const renderCargoTooltipContent = () => (
    <div>
      <p className="mb-[12px] text-sm font-medium text-neutral-900">
        {t("pesananCard.cargoInfoTitle", {}, "Informasi Muatan")}
      </p>
      <ol className="ml-1 list-inside list-decimal text-sm text-neutral-900">
        {otherCargoItems.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ol>
    </div>
  );

  const handleOpenHubungiModal = (contactId) => {
    setSelectedContactId(contactId);
    setIsHubungiModalOpen(true);
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

  return (
    <>
      <div className="relative z-0 flex w-full flex-col items-start border-b border-neutral-400 bg-white shadow-sm">
        {/* Header Section */}
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
                  onClick={() => handleOpenHubungiModal(order.transporter.id)}
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
                  onClick={() => handleOpenHubungiModal(order.shipper.id)}
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
            <div className="flex justify-between">
              {/* Armada */}
              <div className="ml-12 mr-3 flex w-[316px] flex-col gap-1">
                {/* FIXED TOOLTIP USAGE */}
                <TruncatedTooltip
                  text={order.truckType.name}
                  lineClamp={1}
                  className="text-xs font-bold"
                />
                {/* FIXED TOOLTIP USAGE */}

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
                  <div className="flex items-center gap-1">
                    <IconComponent
                      src="/icons/monitoring/daftar-pesanan-aktif/scales.svg"
                      className="h-4 w-4 text-gray-600"
                    />
                    <span className="text-xxs font-medium">
                      {firstCargoItem && <span>{firstCargoItem.name}</span>}
                      {otherCargoItemsCount > 0 && (
                        <InfoTooltip
                          trigger={
                            <span className="cursor-pointer text-primary-700 hover:text-primary-800">
                              , +{otherCargoItemsCount}{" "}
                              {t("pesananCard.cargoOthers", {}, "lainnya")}
                            </span>
                          }
                          side="top"
                          align="center"
                        >
                          {renderCargoTooltipContent()}
                        </InfoTooltip>
                      )}{" "}
                      ({order.totalWeight} {order.weightUnit})
                    </span>
                  </div>
                </div>
                {order.sosStatus?.hasSos && order.sosStatus?.sosCount > 0 && (
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex h-[14px] items-center gap-1 rounded bg-error-400 px-1">
                      <span className="text-[8px] font-bold leading-[130%] text-white">
                        {t("pesananCard.labelSOS", {}, "SOS")} :{" "}
                        {order.sosStatus.sosCount} Unit
                      </span>
                    </div>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs font-medium"
                    >
                      {t("pesananCard.viewSOS", {}, "Lihat SOS")}
                    </Button>
                  </div>
                )}
              </div>
              {multiStatusMemo.hasMultiple ? (
                <div className="flex flex-col items-center">
                  <BadgeStatusPesanan
                    variant={
                      statusDisplayMap[multiStatusMemo.dominantStatus]
                        ?.variant || "primary"
                    }
                    className="!h-fit w-full max-w-[120px] !items-center !justify-center py-1 !text-center"
                  >
                    {statusDisplayMap[multiStatusMemo.dominantStatus]?.text ||
                      multiStatusMemo.dominantStatus}{" "}
                    : <br />
                    {multiStatusMemo.dominantStatusUnitCount} Unit
                  </BadgeStatusPesanan>
                  <Link
                    href={`/daftar-pesanan/${order.id}/status`}
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
                <BadgeStatusPesanan
                  variant={statusInfo.variant}
                  className="!h-fit w-full max-w-[120px] !items-center !justify-center py-1 !text-center"
                >
                  {statusInfo.text}
                </BadgeStatusPesanan>
              )}
              {/* Status & Actions */}
              <div className="flex w-fit flex-col items-end gap-2">
                <SimpleDropdown>
                  <SimpleDropdownTrigger asChild>
                    <button className="flex h-8 flex-row items-center justify-between gap-2 rounded-md border border-neutral-400 bg-white px-3 py-2 shadow-sm transition-colors duration-150 hover:border-primary-700 hover:bg-gray-50 focus:outline-none">
                      <span className="text-xs font-medium leading-tight text-black">
                        {t("pesananCard.action", {}, "Aksi")}
                      </span>
                      <ChevronDown className="h-3 w-3 text-neutral-700" />
                    </button>
                  </SimpleDropdownTrigger>
                  <SimpleDropdownContent className="w-[180px]" align="end">
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
        isOpen={isHubungiModalOpen}
        onClose={() => setIsHubungiModalOpen(false)}
        contactId={selectedContactId}
        useMockData={true} // Ganti ke false saat integrasi
      />
      <OrderChangeInfoModal
        isOpen={isChangeInfoModalOpen}
        onClose={() => setIsChangeInfoModalOpen(false)}
        changeDetails={changeDetails}
        isLoading={isLoadingChange}
        onHubungi={() => {
          setIsChangeInfoModalOpen(false);
          handleOpenContactModal(order.transporter.id);
        }}
      />
    </>
  );
};

export default PesananCard;

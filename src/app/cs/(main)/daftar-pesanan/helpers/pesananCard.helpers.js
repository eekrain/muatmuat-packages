import { useMemo } from "react";

import { format } from "date-fns";
import { id } from "date-fns/locale";

import { useTranslation } from "@/hooks/use-translation";

// Constants
export const ORDER_STATUS = {
  MENUNGGU_KONFIRMASI: "MENUNGGU_KONFIRMASI",
  ARMADA_DIJADWALKAN: "ARMADA_DIJADWALKAN",
  PERLU_ASSIGN_ARMADA: "PERLU_ASSIGN_ARMADA",
  PERLU_KONFIRMASI_SIAP: "PERLU_KONFIRMASI_SIAP",
  PERLU_RESPON_PERUBAHAN: "PERLU_RESPON_PERUBAHAN",
  PROSES_MUAT: "PROSES_MUAT",
  PROSES_BONGKAR: "PROSES_BONGKAR",
  DOKUMEN_SEDANG_DISIAPKAN: "DOKUMEN_SEDANG_DISIAPKAN",
  PROSES_PENGIRIMAN_DOKUMEN: "PROSES_PENGIRIMAN_DOKUMEN",
  SELESAI: "SELESAI",
  DIBATALKAN_SHIPPER: "DIBATALKAN_SHIPPER",
  DIBATALKAN_TRANSPORTER: "DIBATALKAN_TRANSPORTER",
  DIBATALKAN_SISTEM: "DIBATALKAN_SISTEM",
};

export const statusDisplayMap = {
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
  [ORDER_STATUS.SELESAI]: { text: "Selesai", variant: "success" },
  [ORDER_STATUS.DIBATALKAN_SHIPPER]: {
    text: "Dibatalkan Shipper",
    variant: "error",
  },
  [ORDER_STATUS.DIBATALKAN_TRANSPORTER]: {
    text: "Dibatalkan Transporter",
    variant: "error",
  },
  [ORDER_STATUS.DIBATALKAN_SISTEM]: {
    text: "Dibatalkan Sistem",
    variant: "error",
  },
};

// Helper Hooks and Functions
export const useGetActionItems = ({
  order,
  userRole,
  onViewChange,
  onViewFleet,
  onCancelFleet,
  onCancelOrder,
  onViewCancellationReason,
  onUploadArchive,
  onViewArchive,
}) => {
  const { t } = useTranslation();
  return useMemo(() => {
    const actions = [];
    const canCancel = userRole === "GM";
    const hasMultipleUnits = order.truckCount > 1;

    switch (order.orderStatus) {
      case ORDER_STATUS.MENUNGGU_KONFIRMASI:
        actions.push({
          label: t("pesananCard.actionViewFleet", {}, "Lihat Armada"),
          onClick: onViewFleet,
        });
        actions.push({
          label: t("pesananCard.actionViewDetail", {}, "Detail Pesanan"),
          isLink: true,
          href: `/daftar-pesanan/${order.id}`,
        });
        actions.push({
          label: t("pesananCard.actionCancelOrder", {}, "Batalkan Pesanan"),
          isDestructive: true,
          onClick: onCancelOrder,
          disabled: !canCancel,
        });
        break;
      case ORDER_STATUS.ARMADA_DIJADWALKAN:
        actions.push({
          label: t("pesananCard.actionViewFleet", {}, "Lihat Armada"),
          onClick: onViewFleet,
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
            onClick: onCancelFleet,
          });
        }
        actions.push({
          label: t("pesananCard.actionCancelOrder", {}, "Batalkan Pesanan"),
          isDestructive: true,
          onClick: onCancelOrder,
          disabled: !canCancel,
        });
        break;
      case ORDER_STATUS.PERLU_ASSIGN_ARMADA:
        actions.push({
          label: t("pesananCard.actionViewDetail", {}, "Detail Pesanan"),
          isLink: true,
          href: `/daftar-pesanan/${order.id}`,
        });
        actions.push({
          label: t("pesananCard.actionCancelOrder", {}, "Batalkan Pesanan"),
          isDestructive: true,
          onClick: onCancelOrder,
          disabled: !canCancel,
        });
        break;
      case ORDER_STATUS.PERLU_RESPON_PERUBAHAN:
        actions.push({
          label: t("pesananCard.actionViewChange", {}, "Lihat Perubahan"),
          onClick: onViewChange,
        });
        actions.push({
          label: t("pesananCard.actionTrackFleet", {}, "Lacak Armada"),
          isLink: true,
          href: `/daftar-pesanan/${order.id}/lacak-armada`,
        });
        actions.push({
          label: t("pesananCard.actionViewFleet", {}, "Lihat Armada"),
          onClick: onViewFleet,
        });
        actions.push({
          label: t("pesananCard.actionViewDetail", {}, "Detail Pesanan"),
          isLink: true,
          href: `/daftar-pesanan/${order.id}`,
        });
        actions.push({
          label: t("pesananCard.actionCancelOrder", {}, "Batalkan Pesanan"),
          isDestructive: true,
          onClick: onCancelOrder,
          disabled: !canCancel,
        });
        break;
      case ORDER_STATUS.PERLU_KONFIRMASI_SIAP:
        actions.push({
          label: t("pesananCard.actionViewFleet", {}, "Lihat Armada"),
          onClick: onViewFleet,
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
            onClick: onCancelFleet,
          });
        }
        actions.push({
          label: t("pesananCard.actionCancelOrder", {}, "Batalkan Pesanan"),
          isDestructive: true,
          onClick: onCancelOrder,
          disabled: !canCancel,
        });
        break;
      case ORDER_STATUS.PROSES_MUAT:
        actions.push({
          label: t("pesananCard.actionTrackFleet", {}, "Lacak Armada"),
          isLink: true,
          href: `/daftar-pesanan/${order.id}/lacak-armada`,
        });
        actions.push({
          label: t("pesananCard.actionViewFleet", {}, "Lihat Armada"),
          onClick: onViewFleet,
        });
        actions.push({
          label: t("pesananCard.actionViewDetail", {}, "Detail Pesanan"),
          isLink: true,
          href: `/daftar-pesanan/${order.id}`,
        });
        actions.push({
          label: t("pesananCard.actionCancelFleet", {}, "Batalkan Armada"),
          isDestructive: true,
          onClick: onCancelFleet,
        });
        actions.push({
          label: t("pesananCard.actionCancelOrder", {}, "Batalkan Pesanan"),
          isDestructive: true,
          onClick: onCancelOrder,
          disabled: !canCancel,
        });
        break;
      case ORDER_STATUS.PROSES_BONGKAR:
        actions.push({
          label: t("pesananCard.actionTrackFleet", {}, "Lacak Armada"),
          isLink: true,
          href: `/daftar-pesanan/${order.id}/lacak-armada`,
        });
        actions.push({
          label: t("pesananCard.actionViewFleet", {}, "Lihat Armada"),
          onClick: onViewFleet,
        });
        actions.push({
          label: t("pesananCard.actionViewDetail", {}, "Detail Pesanan"),
          isLink: true,
          href: `/daftar-pesanan/${order.id}`,
        });
        break;
      case ORDER_STATUS.DOKUMEN_SEDANG_DISIAPKAN:
        if (order.hasDocumentsUploaded) {
          actions.push({
            label: t(
              "pesananCard.actionViewArchive",
              {},
              "Lihat Dokumen Arsip"
            ),
            onClick: onViewArchive,
          });
        } else {
          actions.push({
            label: t(
              "pesananCard.actionUploadArchive",
              {},
              "Unggah Dokumen Arsip"
            ),
            onClick: onUploadArchive,
          });
        }
        if (order.hasReceiptUploaded) {
          actions.push({
            label: t(
              "pesananCard.actionViewReceipt",
              {},
              "Lihat Resi Pengiriman"
            ),
          });
        } else {
          actions.push({
            label: t("pesananCard.actionUploadReceipt", {}, "Unggah Resi"),
          });
        }
        actions.push({
          label: t("pesananCard.actionViewFleet", {}, "Lihat Armada"),
          onClick: onViewFleet,
        });
        actions.push({
          label: t("pesananCard.actionViewDetail", {}, "Detail Pesanan"),
          isLink: true,
          href: `/daftar-pesanan/${order.id}`,
        });
        break;
      case ORDER_STATUS.PROSES_PENGIRIMAN_DOKUMEN:
        if (order.hasDocumentsUploaded) {
          actions.push({
            label: t(
              "pesananCard.actionViewArchive",
              {},
              "Lihat Dokumen Arsip"
            ),
            onClick: onViewArchive,
          });
        } else {
          actions.push({
            label: t(
              "pesananCard.actionUploadArchive",
              {},
              "Unggah Dokumen Arsip"
            ),
            onClick: onUploadArchive,
          });
        }
        actions.push({
          label: t(
            "pesananCard.actionViewReceipt",
            {},
            "Lihat Resi Pengiriman"
          ),
        });
        actions.push({
          label: t("pesananCard.actionViewFleet", {}, "Lihat Armada"),
          onClick: onViewFleet,
        });
        actions.push({
          label: t("pesananCard.actionViewDetail", {}, "Detail Pesanan"),
          isLink: true,
          href: `/daftar-pesanan/${order.id}`,
        });
        break;
      case ORDER_STATUS.SELESAI:
        if (order.hasDocumentsUploaded) {
          actions.push({
            label: t(
              "pesananCard.actionUploadArchive",
              {},
              "Unggah Dokumen Arsip"
            ),
            onClick: onUploadArchive,
          });
        }
        actions.push({
          label: t(
            "pesananCard.actionViewReceipt",
            {},
            "Lihat Resi Pengiriman"
          ),
        });
        actions.push({
          label: t("pesananCard.actionViewDetail", {}, "Detail Pesanan"),
          isLink: true,
          href: `/cs/daftar-pesanan/${order.id}`,
        });
        break;
      case ORDER_STATUS.DIBATALKAN_SHIPPER:
      case ORDER_STATUS.DIBATALKAN_TRANSPORTER:
      case ORDER_STATUS.DIBATALKAN_SISTEM:
        actions.push({
          label: t(
            "pesananCard.actionCancellationReason",
            {},
            "Alasan Pembatalan"
          ),
          onClick: onViewCancellationReason,
        });
        actions.push({
          label: t("pesananCard.actionViewDetail", {}, "Detail Pesanan"),
          isLink: true,
          href: `/cs/daftar-pesanan/${order.id}`,
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
  }, [
    userRole,
    order.truckCount,
    order.orderStatus,
    order.id,
    order.hasDocumentsUploaded,
    order.hasReceiptUploaded,
    t,
    onViewFleet,
    onCancelOrder,
    onViewChange,
    onCancelFleet,
    onViewCancellationReason,
    onViewArchive,
    onUploadArchive,
  ]);
};

export const useLoadingTime = (schedule) => {
  const { t } = useTranslation();
  return useMemo(() => {
    if (!schedule || !schedule.startDate) {
      return { dateLabel: "-", timeRange: "-", dateColor: "text-neutral-900" };
    }
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

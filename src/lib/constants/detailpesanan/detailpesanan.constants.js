import { OrderStatusEnum } from "./detailpesanan.enum";

export const ALL_ORDER_STATUS = [
  {
    label: "Mempersiapkan Armada",
    status: OrderStatusEnum.SEARCHING_FLEET,
    icon: "/icons/stepper-fleet-searching.svg",
    variant: "primary",
  },
  {
    label: "Menunggu Pembayaran",
    status: OrderStatusEnum.PENDING_PAYMENT,
    icon: "",
    variant: "primary",
  },
  {
    label: "Pesanan Terkonfirmasi",
    status: OrderStatusEnum.CONFIRMED,
    icon: "/icons/stepper-scheduled.svg",
    variant: "primary",
  },
  {
    label: "Proses Muat",
    status: OrderStatusEnum.LOADING_PROCESS,
    icon: "/icons/stepper-box.svg",
    variant: "primary",
  },
  {
    label: "Proses Bongkar",
    status: OrderStatusEnum.UNLOADING_PROCESS,
    icon: "/icons/stepper-box-opened.svg",
    variant: "primary",
  },
  {
    label: "Dokumen Sedang Disiapkan",
    status: OrderStatusEnum.DOCUMENT_PREPARATION,
    icon: "/icons/stepper-document-preparing.svg",
    variant: "primary",
  },
  {
    label: "Proses Pengiriman Dokumen",
    status: OrderStatusEnum.DOCUMENT_SHIPPING,
    icon: "/icons/stepper-document-sending.svg",
    variant: "primary",
  },
  {
    label: "Selesai",
    status: OrderStatusEnum.COMPLETED,
    icon: "/icons/stepper-done.svg",
    variant: "primary",
  },
];

export const ORDER_STATUS_TIMELINE_WITHOUT_ADDITIONAL_SERVICE = [
  ...ALL_ORDER_STATUS.slice(2, 5),
  ALL_ORDER_STATUS[7],
];

export const ORDER_STATUS_TIMELINE_WITH_ADDITIONAL_SERVICE = [
  ...ALL_ORDER_STATUS.slice(2),
];

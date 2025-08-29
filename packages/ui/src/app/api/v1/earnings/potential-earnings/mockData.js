// app/api/v1/earnings/potential-earnings/mockData.js

export const baseEarnings = [
  {
    earningId: "EARN-2025-001",
    orderId: "ORD-2025-001234",
    orderNumber: "MT25A001A",
    potentialAmount: 800000,
    status: "waiting_confirmation",
    statusTooltip:
      "Armada kamu telah tercatat untuk pesanan ini, harap menunggu maks. 1 jam untuk konfirmasi dari Shipper.",
  },
  {
    earningId: "EARN-2025-002",
    orderId: "ORD-2025-001235",
    orderNumber: "MT25A002A",
    potentialAmount: 1500000,
    status: "confirmed",
    statusTooltip: "Pesanan telah dikonfirmasi.",
  },
  {
    earningId: "EARN-2025-003",
    orderId: "ORD-2025-001236",
    orderNumber: "MT25A003A",
    potentialAmount: 280000000,
    status: "scheduled",
    statusTooltip: "Armada telah dijadwalkan.",
  },
  {
    earningId: "EARN-2025-004",
    orderId: "ORD-2025-001237",
    orderNumber: "MT25A004A",
    potentialAmount: 80000000,
    status: "need_assignment",
    statusTooltip: "Pesanan ini perlu assign armada.",
  },
  {
    earningId: "EARN-2025-005",
    orderId: "ORD-2025-001238",
    orderNumber: "MT25A005A",
    potentialAmount: 99000000,
    status: "need_response",
    statusTooltip: "Ada permintaan perubahan yang perlu direspon.",
  },
  {
    earningId: "EARN-2025-006",
    orderId: "ORD-2025-001239",
    orderNumber: "MT25A006A",
    potentialAmount: 34200000,
    status: "need_confirmation",
    statusTooltip: "Pesanan ini perlu dikonfirmasi kesiapannya.",
  },
  {
    earningId: "EARN-2025-007",
    orderId: "ORD-2025-001240",
    orderNumber: "MT25A007A",
    potentialAmount: 31093222,
    status: "loading",
    statusTooltip: "Proses muat sedang berlangsung.",
  },
  {
    earningId: "EARN-2025-008",
    orderId: "ORD-2025-001241",
    orderNumber: "MT25A008A",
    potentialAmount: 800000,
    status: "unloading",
    statusTooltip: "Proses bongkar sedang berlangsung.",
  },
  {
    earningId: "EARN-2025-009",
    orderId: "ORD-2025-001242",
    orderNumber: "MT25A009A",
    potentialAmount: 800000,
    status: "document_preparation",
    statusTooltip: "Dokumen pengiriman sedang disiapkan.",
  },
  {
    earningId: "EARN-2025-010",
    orderId: "ORD-2025-001243",
    orderNumber: "MT25A010A",
    potentialAmount: 800000,
    status: "document_delivery",
    statusTooltip: "Dokumen pengiriman sedang dalam perjalanan.",
  },
];

export const successShell = {
  Message: { Code: 200, Text: "Potential earnings retrieved successfully" },
  Data: {},
  Type: "POTENTIAL_EARNINGS_LIST",
};

export const serverErrorResponse = {
  Message: { Code: 500, Text: "Internal Server Error" },
  Data: {
    errors: [{ field: "general", message: "An unexpected error occurred." }],
  },
  Type: "INTERNAL_SERVER_ERROR",
};

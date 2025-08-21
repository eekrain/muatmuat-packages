import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockUrgentIssueCount = {
  data: {
    Message: {
      Code: 200,
      Text: "Successfully retrieved urgent issue count",
    },
    Data: {
      new: 6,
      processing: 7,
      completed: 17,
      total: 30,
      activeTotal: 13,
    },
    Type: "URGENT_ISSUE_COUNT",
  },
};

export const mockUrgentIssueList = {
  data: {
    Message: {
      Code: 200,
      Text: "Successfully retrieved urgent issue list",
    },
    Data: {
      items: [
        // NEW STATUS - 6 items
        {
          id: "ui-new-001",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Armada Tidak Bergerak Menuju Lokasi",
          status: "NEW",
          statusName: "Baru",
          description:
            'Armada belum bergerak menuju lokasi. Driver belum melakukan update status ke "Menuju Lokasi Muat" padahal estimasi waktu tiba sudah melebihi jadwal muat dalam 30 menit',
          orderId: "order-new-001",
          orderCode: "MT25A002A",
          vehicleId: "vehicle-new-001",
          vehiclePlateNumber: "L 1111 AA",
          estimatedTime: "30 menit lagi",
          detectedAt: "2025-01-14T08:30:00Z",
          processedAt: null,
          completedAt: null,
          location: {
            latitude: -7.2575,
            longitude: 112.7521,
          },
        },
        {
          id: "ui-new-002",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "NEW",
          statusName: "Baru",
          description:
            'Armada belum bergerak menuju lokasi. Driver belum melakukan update status ke "Menuju Lokasi Muat" padahal estimasi waktu tiba sudah melebihi jadwal muat dalam 30 menit',
          orderId: "order-new-002",
          orderCode: "MT25A002B",
          vehicleId: "vehicle-new-002",
          vehiclePlateNumber: "B 2222 BB",
          estimatedTime: "25 menit lagi",
          detectedAt: "2025-01-14T08:25:00Z",
          processedAt: null,
          completedAt: null,
          location: {
            latitude: -6.914744,
            longitude: 107.60981,
          },
        },
        {
          id: "ui-new-003",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "NEW",
          statusName: "Baru",
          description:
            'Armada belum bergerak menuju lokasi. Driver belum melakukan update status ke "Menuju Lokasi Muat" padahal estimasi waktu tiba sudah melebihi jadwal muat dalam 30 menit',
          orderId: "order-new-003",
          orderCode: "MT25A002C",
          vehicleId: "vehicle-new-003",
          vehiclePlateNumber: "C 3333 CC",
          estimatedTime: "20 menit lagi",
          detectedAt: "2025-01-14T08:20:00Z",
          processedAt: null,
          completedAt: null,
          location: {
            latitude: -6.2088,
            longitude: 106.8456,
          },
        },
        {
          id: "ui-new-004",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "NEW",
          statusName: "Baru",
          description:
            'Armada belum bergerak menuju lokasi. Driver belum melakukan update status ke "Menuju Lokasi Muat" padahal estimasi waktu tiba sudah melebihi jadwal muat dalam 30 menit',
          orderId: "order-new-004",
          orderCode: "MT25A002D",
          vehicleId: "vehicle-new-004",
          vehiclePlateNumber: "D 4444 DD",
          estimatedTime: "15 menit lagi",
          detectedAt: "2025-01-14T08:15:00Z",
          processedAt: null,
          completedAt: null,
          location: {
            latitude: -7.7971,
            longitude: 110.3708,
          },
        },
        {
          id: "ui-new-005",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "NEW",
          statusName: "Baru",
          description:
            'Armada belum bergerak menuju lokasi. Driver belum melakukan update status ke "Menuju Lokasi Muat" padahal estimasi waktu tiba sudah melebihi jadwal muat dalam 30 menit',
          orderId: "order-new-005",
          orderCode: "MT25A002E",
          vehicleId: "vehicle-new-005",
          vehiclePlateNumber: "E 5555 EE",
          estimatedTime: "10 menit lagi",
          detectedAt: "2025-01-14T08:10:00Z",
          processedAt: null,
          completedAt: null,
          location: {
            latitude: -6.9175,
            longitude: 107.6191,
          },
        },
        {
          id: "ui-new-006",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "NEW",
          statusName: "Baru",
          description:
            'Armada belum bergerak menuju lokasi. Driver belum melakukan update status ke "Menuju Lokasi Muat" padahal estimasi waktu tiba sudah melebihi jadwal muat dalam 30 menit',
          orderId: "order-new-006",
          orderCode: "MT25A002F",
          vehicleId: "vehicle-new-006",
          vehiclePlateNumber: "F 6666 FF",
          estimatedTime: "5 menit lagi",
          detectedAt: "2025-01-14T08:05:00Z",
          processedAt: null,
          completedAt: null,
          location: {
            latitude: -7.2575,
            longitude: 112.7521,
          },
        },

        // PROCESSING STATUS - 7 items
        {
          id: "ui-processing-001",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "PROCESSING",
          statusName: "Diproses",
          description:
            "Armada sudah bergerak namun estimasi waktu tiba masih melebihi jadwal muat.",
          orderId: "order-processing-001",
          orderCode: "MT25A003A",
          vehicleId: "vehicle-processing-001",
          vehiclePlateNumber: "G 7777 GG",
          estimatedTime: "5 menit lagi",
          detectedAt: "2025-01-14T09:30:00Z",
          processedAt: "2025-01-14T09:35:00Z",
          completedAt: null,
          location: {
            latitude: -6.2088,
            longitude: 106.8456,
          },
        },
        {
          id: "ui-processing-002",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "PROCESSING",
          statusName: "Diproses",
          description:
            "Armada sudah bergerak namun estimasi waktu tiba masih melebihi jadwal muat.",
          orderId: "order-processing-002",
          orderCode: "MT25A003B",
          vehicleId: "vehicle-processing-002",
          vehiclePlateNumber: "H 8888 HH",
          estimatedTime: "8 menit lagi",
          detectedAt: "2025-01-14T09:25:00Z",
          processedAt: "2025-01-14T09:30:00Z",
          completedAt: null,
          location: {
            latitude: -7.7971,
            longitude: 110.3708,
          },
        },
        {
          id: "ui-processing-003",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "PROCESSING",
          statusName: "Diproses",
          description:
            "Armada sudah bergerak namun estimasi waktu tiba masih melebihi jadwal muat.",
          orderId: "order-processing-003",
          orderCode: "MT25A003C",
          vehicleId: "vehicle-processing-003",
          vehiclePlateNumber: "I 9999 II",
          estimatedTime: "12 menit lagi",
          detectedAt: "2025-01-14T09:20:00Z",
          processedAt: "2025-01-14T09:25:00Z",
          completedAt: null,
          location: {
            latitude: -6.9175,
            longitude: 107.6191,
          },
        },
        {
          id: "ui-processing-004",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "PROCESSING",
          statusName: "Diproses",
          description:
            "Armada sudah bergerak namun estimasi waktu tiba masih melebihi jadwal muat.",
          orderId: "order-processing-004",
          orderCode: "MT25A003D",
          vehicleId: "vehicle-processing-004",
          vehiclePlateNumber: "J 0000 JJ",
          estimatedTime: "15 menit lagi",
          detectedAt: "2025-01-14T09:15:00Z",
          processedAt: "2025-01-14T09:20:00Z",
          completedAt: null,
          location: {
            latitude: -7.2575,
            longitude: 112.7521,
          },
        },
        {
          id: "ui-processing-005",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "PROCESSING",
          statusName: "Diproses",
          description:
            "Armada sudah bergerak namun estimasi waktu tiba masih melebihi jadwal muat.",
          orderId: "order-processing-005",
          orderCode: "MT25A003E",
          vehicleId: "vehicle-processing-005",
          vehiclePlateNumber: "K 1111 KK",
          estimatedTime: "18 menit lagi",
          detectedAt: "2025-01-14T09:10:00Z",
          processedAt: "2025-01-14T09:15:00Z",
          completedAt: null,
          location: {
            latitude: -6.914744,
            longitude: 107.60981,
          },
        },
        {
          id: "ui-processing-006",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "PROCESSING",
          statusName: "Diproses",
          description:
            "Armada sudah bergerak namun estimasi waktu tiba masih melebihi jadwal muat.",
          orderId: "order-processing-006",
          orderCode: "MT25A003F",
          vehicleId: "vehicle-processing-006",
          vehiclePlateNumber: "L 2222 LL",
          estimatedTime: "20 menit lagi",
          detectedAt: "2025-01-14T09:05:00Z",
          processedAt: "2025-01-14T09:10:00Z",
          completedAt: null,
          location: {
            latitude: -6.2088,
            longitude: 106.8456,
          },
        },
        {
          id: "ui-processing-007",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "PROCESSING",
          statusName: "Diproses",
          description:
            "Armada sudah bergerak namun estimasi waktu tiba masih melebihi jadwal muat.",
          orderId: "order-processing-007",
          orderCode: "MT25A003G",
          vehicleId: "vehicle-processing-007",
          vehiclePlateNumber: "M 3333 MM",
          estimatedTime: "22 menit lagi",
          detectedAt: "2025-01-14T09:00:00Z",
          processedAt: "2025-01-14T09:05:00Z",
          completedAt: null,
          location: {
            latitude: -7.7971,
            longitude: 110.3708,
          },
        },

        // COMPLETED STATUS - 17 items
        {
          id: "ui-completed-001",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-completed-001",
          orderCode: "MT25A004A",
          vehicleId: "vehicle-completed-001",
          vehiclePlateNumber: "N 4444 NN",
          estimatedTime: "Selesai",
          detectedAt: "2025-01-13T08:30:00Z",
          processedAt: "2025-01-13T09:00:00Z",
          completedAt: "2025-01-13T10:00:00Z",
          location: {
            latitude: -6.914744,
            longitude: 107.60981,
          },
        },
        {
          id: "ui-completed-002",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-completed-002",
          orderCode: "MT25A004B",
          vehicleId: "vehicle-completed-002",
          vehiclePlateNumber: "O 5555 OO",
          estimatedTime: "Selesai",
          detectedAt: "2025-01-12T08:30:00Z",
          processedAt: "2025-01-12T09:00:00Z",
          completedAt: "2025-01-12T10:00:00Z",
          location: {
            latitude: -6.2088,
            longitude: 106.8456,
          },
        },
        {
          id: "ui-completed-003",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-completed-003",
          orderCode: "MT25A004C",
          vehicleId: "vehicle-completed-003",
          vehiclePlateNumber: "P 6666 PP",
          estimatedTime: "Selesai",
          detectedAt: "2025-01-11T08:30:00Z",
          processedAt: "2025-01-11T09:00:00Z",
          completedAt: "2025-01-11T10:00:00Z",
          location: {
            latitude: -7.7971,
            longitude: 110.3708,
          },
        },
        {
          id: "ui-completed-004",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-completed-004",
          orderCode: "MT25A004D",
          vehicleId: "vehicle-completed-004",
          vehiclePlateNumber: "Q 7777 QQ",
          estimatedTime: "Selesai",
          detectedAt: "2025-01-10T08:30:00Z",
          processedAt: "2025-01-10T09:00:00Z",
          completedAt: "2025-01-10T10:00:00Z",
          location: {
            latitude: -6.9175,
            longitude: 107.6191,
          },
        },
        {
          id: "ui-completed-005",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-completed-005",
          orderCode: "MT25A004E",
          vehicleId: "vehicle-completed-005",
          vehiclePlateNumber: "R 8888 RR",
          estimatedTime: "Selesai",
          detectedAt: "2025-01-09T08:30:00Z",
          processedAt: "2025-01-09T09:00:00Z",
          completedAt: "2025-01-09T10:00:00Z",
          location: {
            latitude: -7.2575,
            longitude: 112.7521,
          },
        },
        {
          id: "ui-completed-006",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-completed-006",
          orderCode: "MT25A004F",
          vehicleId: "vehicle-completed-006",
          vehiclePlateNumber: "S 9999 SS",
          estimatedTime: "Selesai",
          detectedAt: "2025-01-08T08:30:00Z",
          processedAt: "2025-01-08T09:00:00Z",
          completedAt: "2025-01-08T10:00:00Z",
          location: {
            latitude: -6.914744,
            longitude: 107.60981,
          },
        },
        {
          id: "ui-completed-007",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-completed-007",
          orderCode: "MT25A004G",
          vehicleId: "vehicle-completed-007",
          vehiclePlateNumber: "T 0000 TT",
          estimatedTime: "Selesai",
          detectedAt: "2025-01-07T08:30:00Z",
          processedAt: "2025-01-07T09:00:00Z",
          completedAt: "2025-01-07T10:00:00Z",
          location: {
            latitude: -6.2088,
            longitude: 106.8456,
          },
        },
        {
          id: "ui-completed-008",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-completed-008",
          orderCode: "MT25A004H",
          vehicleId: "vehicle-completed-008",
          vehiclePlateNumber: "U 1111 UU",
          estimatedTime: "Selesai",
          detectedAt: "2025-01-06T08:30:00Z",
          processedAt: "2025-01-06T09:00:00Z",
          completedAt: "2025-01-06T10:00:00Z",
          location: {
            latitude: -7.7971,
            longitude: 110.3708,
          },
        },
        {
          id: "ui-completed-009",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-completed-009",
          orderCode: "MT25A004I",
          vehicleId: "vehicle-completed-009",
          vehiclePlateNumber: "V 2222 VV",
          estimatedTime: "Selesai",
          detectedAt: "2025-01-05T08:30:00Z",
          processedAt: "2025-01-05T09:00:00Z",
          completedAt: "2025-01-05T10:00:00Z",
          location: {
            latitude: -6.9175,
            longitude: 107.6191,
          },
        },
        {
          id: "ui-completed-010",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-completed-010",
          orderCode: "MT25A004J",
          vehicleId: "vehicle-completed-010",
          vehiclePlateNumber: "W 3333 WW",
          estimatedTime: "Selesai",
          detectedAt: "2025-01-04T08:30:00Z",
          processedAt: "2025-01-04T09:00:00Z",
          completedAt: "2025-01-04T10:00:00Z",
          location: {
            latitude: -7.2575,
            longitude: 112.7521,
          },
        },
        {
          id: "ui-completed-011",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-completed-011",
          orderCode: "MT25A004K",
          vehicleId: "vehicle-completed-011",
          vehiclePlateNumber: "X 4444 XX",
          estimatedTime: "Selesai",
          detectedAt: "2025-01-03T08:30:00Z",
          processedAt: "2025-01-03T09:00:00Z",
          completedAt: "2025-01-03T10:00:00Z",
          location: {
            latitude: -6.914744,
            longitude: 107.60981,
          },
        },
        {
          id: "ui-completed-012",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-completed-012",
          orderCode: "MT25A004L",
          vehicleId: "vehicle-completed-012",
          vehiclePlateNumber: "Y 5555 YY",
          estimatedTime: "Selesai",
          detectedAt: "2025-01-02T08:30:00Z",
          processedAt: "2025-01-02T09:00:00Z",
          completedAt: "2025-01-02T10:00:00Z",
          location: {
            latitude: -6.2088,
            longitude: 106.8456,
          },
        },
        {
          id: "ui-completed-013",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-completed-013",
          orderCode: "MT25A004M",
          vehicleId: "vehicle-completed-013",
          vehiclePlateNumber: "Z 6666 ZZ",
          estimatedTime: "Selesai",
          detectedAt: "2025-01-01T08:30:00Z",
          processedAt: "2025-01-01T09:00:00Z",
          completedAt: "2025-01-01T10:00:00Z",
          location: {
            latitude: -7.7971,
            longitude: 110.3708,
          },
        },
        {
          id: "ui-completed-014",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-completed-014",
          orderCode: "MT25A004N",
          vehicleId: "vehicle-completed-014",
          vehiclePlateNumber: "AA 7777 AA",
          estimatedTime: "Selesai",
          detectedAt: "2024-12-31T08:30:00Z",
          processedAt: "2024-12-31T09:00:00Z",
          completedAt: "2024-12-31T10:00:00Z",
          location: {
            latitude: -6.9175,
            longitude: 107.6191,
          },
        },
        {
          id: "ui-completed-015",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-completed-015",
          orderCode: "MT25A004O",
          vehicleId: "vehicle-completed-015",
          vehiclePlateNumber: "BB 8888 BB",
          estimatedTime: "Selesai",
          detectedAt: "2024-12-30T08:30:00Z",
          processedAt: "2024-12-30T09:00:00Z",
          completedAt: "2024-12-30T10:00:00Z",
          location: {
            latitude: -7.2575,
            longitude: 112.7521,
          },
        },
        {
          id: "ui-completed-016",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-completed-016",
          orderCode: "MT25A004P",
          vehicleId: "vehicle-completed-016",
          vehiclePlateNumber: "CC 9999 CC",
          estimatedTime: "Selesai",
          detectedAt: "2024-12-29T08:30:00Z",
          processedAt: "2024-12-29T09:00:00Z",
          completedAt: "2024-12-29T10:00:00Z",
          location: {
            latitude: -6.914744,
            longitude: 107.60981,
          },
        },
        {
          id: "ui-completed-017",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-completed-017",
          orderCode: "MT25A004Q",
          vehicleId: "vehicle-completed-017",
          vehiclePlateNumber: "DD 0000 DD",
          estimatedTime: "Selesai",
          detectedAt: "2024-12-28T08:30:00Z",
          processedAt: "2024-12-28T09:00:00Z",
          completedAt: "2024-12-28T10:00:00Z",
          location: {
            latitude: -6.2088,
            longitude: 106.8456,
          },
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 30,
        totalPages: 3,
        hasNext: false,
        hasPrev: false,
      },
    },
    Type: "URGENT_ISSUE_LIST",
  },
};

export const mockUrgentIssueCountError = {
  data: {
    Message: {
      Code: 400,
      Text: "Invalid status parameter",
    },
    Data: {
      errors: [
        {
          field: "status",
          message: "Status must be one of: new, processing, completed, all",
        },
      ],
    },
    Type: "URGENT_ISSUE_COUNT_ERROR",
  },
};

export const mockUrgentIssueListError = {
  data: {
    Message: {
      Code: 400,
      Text: "Invalid request parameters",
    },
    Data: {
      errors: [
        {
          field: "status",
          message: "Status must be one of: new, processing, completed",
        },
      ],
    },
    Type: "URGENT_ISSUE_LIST_ERROR",
  },
};

export const getUrgentIssueCount = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();

  let result;
  if (useMockData) {
    const status = searchParams.get("status");
    if (status && !["NEW", "PROCESSING", "COMPLETED", "all"].includes(status)) {
      result = mockUrgentIssueCountError;
    } else {
      // Hitung count berdasarkan status yang diminta
      const allItems = mockUrgentIssueList.data.Data.items;
      const newCount = allItems.filter((item) => item.status === "NEW").length;
      const processingCount = allItems.filter(
        (item) => item.status === "PROCESSING"
      ).length;
      const completedCount = allItems.filter(
        (item) => item.status === "COMPLETED"
      ).length;

      result = {
        ...mockUrgentIssueCount,
        data: {
          ...mockUrgentIssueCount.data,
          Data: {
            new: newCount,
            processing: processingCount,
            completed: completedCount,
            total: newCount + processingCount + completedCount,
            activeTotal: newCount + processingCount,
          },
        },
      };
    }
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`/v1/urgent-issues/count${query}`);
  }

  return {
    count: result?.data?.Data || {},
    message: result?.data?.Message,
    type: result?.data?.Type,
    raw: result,
  };
};

export const useGetUrgentIssueCount = (params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const { data, error, isLoading } = useSWR(
    `getUrgentIssueCount/${paramsString}`,
    getUrgentIssueCount
  );
  return {
    count: data?.count || {},
    message: data?.message,
    type: data?.type,
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};

export const getUrgentIssueList = async (cacheKey) => {
  const parts = cacheKey?.split("/") || [];
  const status = parts[1];
  const params = parts[2];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();

  let result;
  if (useMockData) {
    // Simulasi delay loading
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 detik delay

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    if (status && !["NEW", "PROCESSING", "COMPLETED", "all"].includes(status)) {
      result = mockUrgentIssueListError;
    } else {
      // Filter mock data berdasarkan status yang diminta
      const filteredItems = mockUrgentIssueList.data.Data.items.filter(
        (item) => {
          if (!status || status === "all") return true; // Jika tidak ada status atau "all", return semua
          return item.status === status;
        }
      );

      // Implementasi pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = filteredItems.slice(startIndex, endIndex);
      const totalItems = filteredItems.length;
      const totalPages = Math.ceil(totalItems / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      result = {
        ...mockUrgentIssueList,
        data: {
          ...mockUrgentIssueList.data,
          Data: {
            ...mockUrgentIssueList.data.Data,
            items: paginatedItems,
            pagination: {
              page,
              limit,
              total: totalItems,
              totalPages,
              hasNext,
              hasPrev,
            },
          },
        },
      };
    }
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`/v1/urgent-issues${query}`);
  }

  return {
    items: result?.data?.Data?.items || [],
    pagination: result?.data?.Data?.pagination || {},
    message: result?.data?.Message,
    type: result?.data?.Type,
    raw: result,
  };
};

export const useGetUrgentIssueList = (params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const status = params?.status || "all";
  const { data, error, isLoading } = useSWR(
    `getUrgentIssueList/${status}/${paramsString}`,
    getUrgentIssueList
  );
  return {
    items: data?.items || [],
    pagination: data?.pagination || {},
    message: data?.message,
    type: data?.type,
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};

// Update Status
export const successProcessingResponse = {
  Message: {
    Code: 200,
    Text: "Urgent issue status updated successfully",
  },
  Data: {
    id: "ui-001",
    status: "PROCESSING",
    statusName: "Proses",
    updatedAt: "2025-01-14T08:35:00Z",
    processedAt: "2025-01-14T08:35:00Z",
  },
  Type: "URGENT_ISSUE_STATUS_UPDATE",
};

export const successCompletedResponse = {
  Message: {
    Code: 200,
    Text: "Urgent issue status updated successfully",
  },
  Data: {
    id: "ui-001",
    status: "COMPLETED",
    statusName: "Selesai",
    updatedAt: "2025-01-14T09:00:00Z",
    completedAt: "2025-01-14T09:00:00Z",
  },
  Type: "URGENT_ISSUE_STATUS_UPDATE",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Invalid status transition",
  },
  Data: {
    errors: [
      {
        field: "status",
        message: "Cannot change status from COMPLETED to PROCESSING",
      },
    ],
  },
  Type: "URGENT_ISSUE_STATUS_UPDATE_ERROR",
};

export const serverErrorResponse = {
  Message: {
    Code: 500,
    Text: "Internal Server Error",
  },
  Data: {
    errors: [
      {
        field: "general",
        message: "Terjadi kesalahan pada sistem kami",
      },
    ],
  },
  Type: "INTERNAL_SERVER_ERROR",
};

export const updateUrgentIssueStatus = async (cacheKey) => {
  const [_, urgentIssueId, params] = cacheKey?.split("/") || [];
  const bodyParams = params ? JSON.parse(decodeURIComponent(params)) : {};

  let result;
  if (useMockData) {
    if (bodyParams.status === "PROCESSING") {
      result = { data: successProcessingResponse };
    } else if (bodyParams.status === "COMPLETED") {
      result = { data: successCompletedResponse };
    } else {
      result = { data: errorResponse };
    }
  } else {
    result = await fetcherMuatrans.patch(
      `/v1/urgent-issues/${urgentIssueId}/status`,
      bodyParams
    );
  }

  return {
    data: result?.data?.Data,
    message: result?.data?.Message,
    type: result?.data?.Type,
    raw: result,
  };
};

export const useUpdateUrgentIssueStatus = (urgentIssueId, bodyParams) => {
  const paramsString = bodyParams ? JSON.stringify(bodyParams) : "";
  const { data, error, isLoading } = useSWR(
    urgentIssueId
      ? `updateUrgentIssueStatus/${urgentIssueId}/${encodeURIComponent(paramsString)}`
      : null,
    updateUrgentIssueStatus
  );

  return {
    data: data?.data,
    message: data?.message,
    type: data?.type,
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};

import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

export const mockUrgentIssueCount = {
  data: {
    Message: {
      Code: 200,
      Text: "Successfully retrieved urgent issue count",
    },
    Data: {
      new: 7,
      processing: 50,
      completed: 1,
      total: 7,
      activeTotal: 15,
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
        {
          id: "ui-001",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "NEW",
          statusName: "Baru",
          description:
            'Armada belum bergerak menuju lokasi. Driver belum melakukan update status ke "Menuju Lokasi Muat" padahal estimasi waktu tiba sudah melebihi jadwal muat dalam 30 menit',
          orderId: "order-001",
          orderCode: "MT25A002A",
          vehicleId: "vehicle-001",
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
          id: "ui-002",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "PROCESSING",
          statusName: "Diproses",
          description:
            "Armada sudah bergerak namun estimasi waktu tiba masih melebihi jadwal muat.",
          orderId: "order-002",
          orderCode: "MT25A002B",
          vehicleId: "vehicle-002",
          vehiclePlateNumber: "B 2222 BB",
          estimatedTime: "15 menit lagi",
          detectedAt: "2025-01-14T09:00:00Z",
          processedAt: "2025-01-14T09:10:00Z",
          completedAt: null,
          location: {
            latitude: -6.2,
            longitude: 106.816666,
          },
        },
        {
          id: "ui-003",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-003",
          orderCode: "MT25A002C",
          vehicleId: "vehicle-003",
          vehiclePlateNumber: "D 3333 CC",
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
          id: "ui-004",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-003",
          orderCode: "MT25A002C",
          vehicleId: "vehicle-003",
          vehiclePlateNumber: "D 3333 CC",
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
          id: "ui-005",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-003",
          orderCode: "MT25A002C",
          vehicleId: "vehicle-003",
          vehiclePlateNumber: "D 3333 CC",
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
          id: "ui-006",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-003",
          orderCode: "MT25A002C",
          vehicleId: "vehicle-003",
          vehiclePlateNumber: "D 3333 CC",
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
          id: "ui-007",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-003",
          orderCode: "MT25A002C",
          vehicleId: "vehicle-003",
          vehiclePlateNumber: "D 3333 CC",
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
          id: "ui-008",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-003",
          orderCode: "MT25A002C",
          vehicleId: "vehicle-003",
          vehiclePlateNumber: "D 3333 CC",
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
          id: "ui-009",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-003",
          orderCode: "MT25A002C",
          vehicleId: "vehicle-003",
          vehiclePlateNumber: "D 3333 CC",
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
          id: "ui-010",
          type: "POTENTIAL_DRIVER_LATE",
          typeName: "Potensi Driver Terlambat",
          status: "COMPLETED",
          statusName: "Selesai",
          description:
            "Laporan sudah dikonfirmasi dan driver telah melakukan update status.",
          orderId: "order-003",
          orderCode: "MT25A002C",
          vehicleId: "vehicle-003",
          vehiclePlateNumber: "D 3333 CC",
          estimatedTime: "Selesai",
          detectedAt: "2025-01-13T08:30:00Z",
          processedAt: "2025-01-13T09:00:00Z",
          completedAt: "2025-01-13T10:00:00Z",
          location: {
            latitude: -6.914744,
            longitude: 107.60981,
          },
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 3,
        totalPages: 1,
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
      result = mockUrgentIssueCount;
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
  const params = cacheKey?.split("/")?.[1];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();

  let result;
  if (useMockData) {
    const status = searchParams.get("status");
    if (status && !["NEW", "PROCESSING", "COMPLETED"].includes(status)) {
      result = mockUrgentIssueListError;
    } else {
      result = mockUrgentIssueList;
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
  const { data, error, isLoading } = useSWR(
    `getUrgentIssueList/${paramsString}`,
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

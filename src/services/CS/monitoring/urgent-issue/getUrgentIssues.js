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
      new: 150,
      processing: 50,
      completed: 1,
      total: 2,
      activeTotal: 15,
    },
    Type: "URGENT_ISSUE_COUNT",
  },
};

export const mockUrgentIssueList = {
  success: true,
  data: [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      order_id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      orderCode: "MT32343",
      countdown: 2000, // in seconds
      transporter: {
        id: "tr001",
        name: "CV Moga Jaya Abadi",
        logo: "https://api.muatrans.com/logos/tr001.png",
        phone: "021-12345678",
      },
      orderLocations: {
        pickupLocations: [
          {
            id: "ploc001",
            sequence: 1,
            latitude: -6.1751,
            longitude: 106.865,
            district: "Gambir",
            city: "Jakarta Pusat",
          },
        ],
        dropoffLocations: [
          {
            id: "dloc001",
            sequence: 1,
            latitude: -6.2297,
            longitude: 106.6894,
            district: "Tangerang",
            city: "Kota Tangerang",
          },
        ],
      },
      issues: [
        {
          vehicle: {
            id: "vh001",
            plate_number: "B 1234 XYZ",
            driver_name: "Ahmad Supardi",
            location: {
              latitude: -6.2088,
              longitude: 106.8456,
              address: "Jl. Sudirman No. 1, Jakarta",
            },
            polylineEncode: "encoded_polyline_string_here",
          },
          issue_type: "POTENTIAL_DRIVER_LATE", // POTENTIAL_DRIVER_LATE, FLEET_NOT_MOVING, FLEET_NOT_READY
          status: "NEW",
          description: "sudah harus sampai di lokasi muat dalam waktu 15 menit",
          detected_at: "2025-01-15T09:15:00Z",
          processed_at: null,
          rejection_count: 2,
          contact_attempts: 3,
          last_contact_at: "2025-01-15T10:00:00Z",
          has_rejection_history: true,
        },
        {
          vehicle: {
            id: "vh002",
            plate_number: "B 1234 ABC",
            driver_name: "Ahmad Supardi",
            location: {
              latitude: -6.2088,
              longitude: 106.8456,
              address: "Jl. Sudirman No. 1, Jakarta",
            },
            polylineEncode: "encoded_polyline_string_here",
          },
          issue_type: "FLEET_NOT_MOVING", // POTENTIAL_DRIVER_LATE, FLEET_NOT_MOVING, FLEET_NOT_READY
          status: "NEW",
          description: "sudah harus sampai di lokasi muat dalam waktu 15 menit",
          detected_at: "2025-01-15T09:15:00Z",
          processed_at: null,
          rejection_count: 2,
          contact_attempts: 3,
          last_contact_at: "2025-01-15T10:00:00Z",
          has_rejection_history: true,
        },
        {
          vehicle: {
            id: "vh003",
            plate_number: "B 1234 IND",
            driver_name: "Ahmad Supardi",
            location: {
              latitude: -6.2088,
              longitude: 106.8456,
              address: "Jl. Sudirman No. 1, Jakarta",
            },
            polylineEncode: "encoded_polyline_string_here",
          },
          issue_type: "FLEET_NOT_READY", // POTENTIAL_DRIVER_LATE, FLEET_NOT_MOVING, FLEET_NOT_READY
          status: "NEW",
          description: "sudah harus sampai di lokasi muat dalam waktu 15 menit",
          detected_at: "2025-01-15T09:15:00Z",
          processed_at: null,
          rejection_count: 2,
          contact_attempts: 3,
          last_contact_at: "2025-01-15T10:00:00Z",
          has_rejection_history: true,
        },
      ],
    },
    {
      id: "123e4567-e89b-12d3-a456-426614174002",
      order_id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      orderCode: "MT32343",
      countdown: 2000, // in seconds
      transporter: {
        id: "tr001",
        name: "PT Siba Surya",
        logo: "https://api.muatrans.com/logos/tr001.png",
        phone: "021-12345678",
      },
      orderLocations: {
        pickupLocations: [
          {
            id: "ploc001",
            sequence: 1,
            latitude: -6.1751,
            longitude: 106.865,
            district: "Gambir",
            city: "Jakarta Pusat",
          },
        ],
        dropoffLocations: [
          {
            id: "dloc001",
            sequence: 1,
            latitude: -6.2297,
            longitude: 106.6894,
            district: "Tangerang",
            city: "Kota Tangerang",
          },
        ],
      },
      issues: [
        {
          vehicle: {
            id: "vh001",
            plate_number: "B 1234 XYZ",
            driver_name: "Ahmad Supardi",
            location: {
              latitude: -6.2088,
              longitude: 106.8456,
              address: "Jl. Sudirman No. 1, Jakarta",
            },
            polylineEncode: "encoded_polyline_string_here",
          },
          issue_type: "FLEET_NOT_MOVING", // POTENTIAL_DRIVER_LATE, FLEET_NOT_MOVING, FLEET_NOT_READY
          status: "NEW",
          description:
            "Armada B 1234 XYZ sudah harus sampai di lokasi muat dalam waktu 15 menit",
          detected_at: "2025-01-15T09:15:00Z",
          processed_at: null,
          rejection_count: 2,
          contact_attempts: 3,
          last_contact_at: "2025-01-15T10:00:00Z",
          has_rejection_history: true,
        },
        {
          vehicle: {
            id: "vh002",
            plate_number: "B 1234 ABC",
            driver_name: "Ahmad Supardi",
            location: {
              latitude: -6.2088,
              longitude: 106.8456,
              address: "Jl. Sudirman No. 1, Jakarta",
            },
            polylineEncode: "encoded_polyline_string_here",
          },
          issue_type: "FLEET_NOT_MOVING", // POTENTIAL_DRIVER_LATE, FLEET_NOT_MOVING, FLEET_NOT_READY
          status: "NEW",
          description:
            "Armada B 1234 XYZ sudah harus sampai di lokasi muat dalam waktu 15 menit",
          detected_at: "2025-01-15T09:15:00Z",
          processed_at: null,
          rejection_count: 2,
          contact_attempts: 3,
          last_contact_at: "2025-01-15T10:00:00Z",
          has_rejection_history: true,
        },
        {
          vehicle: {
            id: "vh003",
            plate_number: "B 1234 IND",
            driver_name: "Ahmad Supardi",
            location: {
              latitude: -6.2088,
              longitude: 106.8456,
              address: "Jl. Sudirman No. 1, Jakarta",
            },
            polylineEncode: "encoded_polyline_string_here",
          },
          issue_type: "FLEET_NOT_READY", // POTENTIAL_DRIVER_LATE, FLEET_NOT_MOVING, FLEET_NOT_READY
          status: "NEW",
          description:
            "Armada B 1234 XYZ sudah harus sampai di lokasi muat dalam waktu 15 menit",
          detected_at: "2025-01-15T09:15:00Z",
          processed_at: null,
          rejection_count: 2,
          contact_attempts: 3,
          last_contact_at: "2025-01-15T10:00:00Z",
          has_rejection_history: true,
        },
      ],
    },
    {
      id: "123e4567-e89b-12d3-a456-426614174003",
      order_id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      orderCode: "MT32343",
      countdown: 2000, // in seconds
      transporter: {
        id: "tr001",
        name: "PT Batavia Prosperindo Angkut Teknologi Indonesi Trans Tbk",
        logo: "https://api.muatrans.com/logos/tr001.png",
        phone: "021-12345678",
      },
      orderLocations: {
        pickupLocations: [
          {
            id: "ploc001",
            sequence: 1,
            latitude: -6.1751,
            longitude: 106.865,
            district: "Gambir",
            city: "Jakarta Pusat",
          },
        ],
        dropoffLocations: [
          {
            id: "dloc001",
            sequence: 1,
            latitude: -6.2297,
            longitude: 106.6894,
            district: "Tangerang",
            city: "Kota Tangerang",
          },
        ],
      },
      issues: [
        {
          vehicle: {
            id: "vh001",
            plate_number: "B 1234 XYZ",
            driver_name: "Ahmad Supardi",
            location: {
              latitude: -6.2088,
              longitude: 106.8456,
              address: "Jl. Sudirman No. 1, Jakarta",
            },
            polylineEncode: "encoded_polyline_string_here",
          },
          issue_type: "FLEET_NOT_READY", // POTENTIAL_DRIVER_LATE, FLEET_NOT_MOVING, FLEET_NOT_READY
          status: "NEW",
          description: "sudah harus sampai di lokasi muat dalam waktu 15 menit",
          detected_at: "2025-01-15T09:15:00Z",
          processed_at: null,
          rejection_count: 2,
          contact_attempts: 3,
          last_contact_at: "2025-01-15T10:00:00Z",
          has_rejection_history: true,
        },
        {
          vehicle: {
            id: "vh002",
            plate_number: "B 1234 ABC",
            driver_name: "Ahmad Supardi",
            location: {
              latitude: -6.2088,
              longitude: 106.8456,
              address: "Jl. Sudirman No. 1, Jakarta",
            },
            polylineEncode: "encoded_polyline_string_here",
          },
          issue_type: "FLEET_NOT_MOVING", // POTENTIAL_DRIVER_LATE, FLEET_NOT_MOVING, FLEET_NOT_READY
          status: "NEW",
          description: "sudah harus sampai di lokasi muat dalam waktu 15 menit",
          detected_at: "2025-01-15T09:15:00Z",
          processed_at: null,
          rejection_count: 2,
          contact_attempts: 3,
          last_contact_at: "2025-01-15T10:00:00Z",
          has_rejection_history: true,
        },
        {
          vehicle: {
            id: "vh003",
            plate_number: "B 1234 IND",
            driver_name: "Ahmad Supardi",
            location: {
              latitude: -6.2088,
              longitude: 106.8456,
              address: "Jl. Sudirman No. 1, Jakarta",
            },
            polylineEncode: "encoded_polyline_string_here",
          },
          issue_type: "FLEET_NOT_READY", // POTENTIAL_DRIVER_LATE, FLEET_NOT_MOVING, FLEET_NOT_READY
          status: "NEW",
          description:
            "Armada B 1234 XYZ sudah harus sampai di lokasi muat dalam waktu 15 menit",
          detected_at: "2025-01-15T09:15:00Z",
          processed_at: null,
          rejection_count: 2,
          contact_attempts: 3,
          last_contact_at: "2025-01-15T10:00:00Z",
          has_rejection_history: true,
        },
      ],
    },
    // You can add more items here to simulate a full list
  ],
  pagination: {
    total: 15,
    page: 1,
    limit: 10,
    total_pages: 2,
    has_next: true,
    has_prev: false,
  },
  meta: {
    overdue_count: 3,
    overdue_issues: ["123e4567-e89b-12d3-a456-426614174000", "uuid2", "uuid3"],
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
    if (status && !["new", "processing", "completed", "all"].includes(status)) {
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

export const getUrgentIssueList = async (cacheKey) => {
  const params = cacheKey?.split("/")?.[1];
  const searchParams = params
    ? new URLSearchParams(params)
    : new URLSearchParams();

  let result;
  if (useMockData) {
    const status = searchParams.get("status");
    if (status && !["new", "processing", "completed"].includes(status)) {
      result = mockUrgentIssueListError;
    } else {
      // Filter mock data berdasarkan status yang diminta
      const filteredItems = mockUrgentIssueList.data.filter((item) => {
        if (!status) return true;
        // Cek status pada issues[0].status
        const issueStatus =
          item.issues && item.issues[0] ? item.issues[0].status : undefined;
        return (
          issueStatus && issueStatus.toLowerCase() === status.toLowerCase()
        );
      });

      result = {
        ...mockUrgentIssueList,
        data: {
          items: filteredItems,
          pagination: {
            total: filteredItems.length,
            page: 1,
            limit: 10,
            total_pages: 1,
            has_next: false,
            has_prev: false,
          },
          meta: mockUrgentIssueList.meta || {},
        },
      };
    }
  } else {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    result = await fetcherMuatrans.get(`/v1/urgent-issues${query}`);
  }

  return {
    items: result?.data?.items || [],
    pagination: result?.data?.pagination || {},
    meta: result?.data?.meta || {},
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

export const useGetUrgentIssueList = (params) => {
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const { data, error, isLoading } = useSWR(
    `getUrgentIssueList/${paramsString}`,
    getUrgentIssueList
  );
  return {
    items: data?.items || [],
    pagination: data?.pagination || {},
    meta: data?.meta || {},
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

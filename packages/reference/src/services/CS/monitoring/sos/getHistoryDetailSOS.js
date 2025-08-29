import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockSOSHistoryDetail = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS history detail retrieved successfully",
    },
    Data: {
      id: "hist123e4567-e89b-12d3-a456-426614174000",
      sosStatus: "RESOLVED",
      sosTime: "2025-08-03T08:30:00Z",
      resolvedAt: "2025-08-03T10:45:00Z",
      resolutionDuration: "2 jam 15 menit",
      resolvedTimeRelative: "1 hari lalu",
      acknowledgedAt: "2025-08-03T08:35:00Z",
      acknowledgedByUser: {
        id: "user123",
        fullName: "CS Operator - Ahmad",
        role: "CS_OPERATOR",
      },
      description: "Ban bocor di kilometer 27 tol Jakarta-Cikampek",
      resolution: "Ban diganti dengan ban cadangan, perjalanan dilanjutkan",
      escalationLevel: 1,
      wasUrgent: false,
      transporter: {
        id: "trans123",
        companyName: "PT ABC Transport",
        logoUrl: "https://cdn.example.com/logos/abc-transport.png",
        companyPhoneNumber: "02112345678",
        emergencyContactName: "John Smith",
        emergencyContactPhone: "08987654321",
      },
      fleet: {
        id: "fleet456",
        licensePlate: "B1234CD",
        vehicleType: "Truk Fuso",
        carrierType: "Box Aluminium",
        imageUrl: "https://cdn.example.com/vehicles/fleet456.jpg",
      },
      driver: {
        id: "driver789",
        fullName: "John Doe",
        phoneNumber: "08123456789",
        whatsappNumber: "628123456789",
      },
      sosCategory: {
        id: "cat002",
        categoryName: "Ban",
        description: "Masalah terkait ban kendaraan",
      },
      location: {
        sosLatitude: -6.234567,
        sosLongitude: 106.876543,
        lastAddress: "Jalan Gatot Subroto km 27, Jakarta Selatan",
      },
      order: {
        id: "order123",
        orderNumber: "ORD-20250803-001",
        status: "COMPLETED",
        pickupLocation: "Jakarta",
        deliveryLocation: "Karawang",
        completedAt: "2025-08-03T18:00:00Z",
      },
      photoEvidence: [
        {
          id: "photo1",
          originalFileName: "ban_bocor_evidence.jpg",
          thumbnailUrl: "https://cdn.example.com/sos/thumb/photo1.jpg",
          mediumUrl: "https://cdn.example.com/sos/medium/photo1.jpg",
          photoUrl: "https://cdn.example.com/sos/original/photo1.jpg",
          imageWidth: 1920,
          imageHeight: 1080,
          fileSize: 524288,
          mimeType: "image/jpeg",
          description: "Ban bocor sebelum diganti",
        },
        {
          id: "photo2",
          originalFileName: "ban_sudah_diganti.jpg",
          thumbnailUrl: "https://cdn.example.com/sos/thumb/photo2.jpg",
          mediumUrl: "https://cdn.example.com/sos/medium/photo2.jpg",
          photoUrl: "https://cdn.example.com/sos/original/photo2.jpg",
          imageWidth: 1920,
          imageHeight: 1080,
          fileSize: 612352,
          mimeType: "image/jpeg",
          description: "Ban sudah diganti dan siap melanjutkan perjalanan",
        },
      ],
      statusHistory: [
        {
          id: "hist1",
          previousStatus: null,
          newStatus: "OPEN",
          changedAt: "2025-08-03T08:30:00Z",
          changeReason: "Initial SOS report created",
          changedByUser: {
            id: "system",
            fullName: "System Auto",
          },
        },
        {
          id: "hist2",
          previousStatus: "OPEN",
          newStatus: "IN_PROGRESS",
          changedAt: "2025-08-03T08:35:00Z",
          changeReason: "CS acknowledged and started handling",
          changedByUser: {
            id: "user123",
            fullName: "CS Operator - Ahmad",
          },
        },
        {
          id: "hist3",
          previousStatus: "IN_PROGRESS",
          newStatus: "RESOLVED",
          changedAt: "2025-08-03T10:45:00Z",
          changeReason: "Issue resolved, ban successfully replaced",
          changedByUser: {
            id: "user123",
            fullName: "CS Operator - Ahmad",
          },
        },
      ],
    },
    Type: "SOS_HISTORY_DETAIL",
  },
};

export const mockSOSHistoryDetailUrgent = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS history detail retrieved successfully",
    },
    Data: {
      id: "hist456e7890-e12b-34c5-d678-901234567890",
      sosStatus: "RESOLVED",
      sosTime: "2025-08-02T14:20:00Z",
      resolvedAt: "2025-08-02T16:30:00Z",
      resolutionDuration: "2 jam 10 menit",
      resolvedTimeRelative: "2 hari lalu",
      acknowledgedAt: "2025-08-02T14:25:00Z",
      acknowledgedByUser: {
        id: "user456",
        fullName: "CS Supervisor - Sarah",
        role: "CS_SUPERVISOR",
      },
      description: "Kecelakaan serius di tol km 23, sopir terluka",
      resolution: "Sopir dibawa ke rumah sakit, kendaraan ditarik ke bengkel",
      escalationLevel: 3,
      wasUrgent: true,
      transporter: {
        id: "trans456",
        companyName: "PT XYZ Logistics",
        logoUrl: "https://cdn.example.com/logos/xyz-logistics.png",
        companyPhoneNumber: "02187654321",
        emergencyContactName: "Jane Smith",
        emergencyContactPhone: "08765432109",
      },
      fleet: {
        id: "fleet789",
        licensePlate: "B5678EF",
        vehicleType: "Colt Diesel",
        carrierType: "Box Kayu",
        imageUrl: "https://cdn.example.com/vehicles/fleet789.jpg",
      },
      driver: {
        id: "driver012",
        fullName: "Jane Smith",
        phoneNumber: "08987654321",
        whatsappNumber: "628987654321",
      },
      sosCategory: {
        id: "cat003",
        categoryName: "Kecelakaan",
        description: "Kecelakaan kendaraan",
      },
      location: {
        sosLatitude: -6.345678,
        sosLongitude: 106.765432,
        lastAddress: "Jalan Thamrin km 23, Jakarta Pusat",
      },
      order: {
        id: "order456",
        orderNumber: "ORD-20250802-002",
        status: "CANCELLED",
        pickupLocation: "Jakarta",
        deliveryLocation: "Surabaya",
        completedAt: null,
      },
      photoEvidence: [
        {
          id: "photo3",
          originalFileName: "accident_evidence_1.jpg",
          thumbnailUrl: "https://cdn.example.com/sos/thumb/photo3.jpg",
          mediumUrl: "https://cdn.example.com/sos/medium/photo3.jpg",
          photoUrl: "https://cdn.example.com/sos/original/photo3.jpg",
          imageWidth: 1920,
          imageHeight: 1080,
          fileSize: 1048576,
          mimeType: "image/jpeg",
          description: "Kondisi kendaraan setelah kecelakaan",
        },
      ],
      statusHistory: [
        {
          id: "hist4",
          previousStatus: null,
          newStatus: "OPEN",
          changedAt: "2025-08-02T14:20:00Z",
          changeReason: "Emergency SOS report created",
          changedByUser: {
            id: "system",
            fullName: "System Auto",
          },
        },
        {
          id: "hist5",
          previousStatus: "OPEN",
          newStatus: "IN_PROGRESS",
          changedAt: "2025-08-02T14:25:00Z",
          changeReason: "Emergency response team dispatched",
          changedByUser: {
            id: "user456",
            fullName: "CS Supervisor - Sarah",
          },
        },
        {
          id: "hist6",
          previousStatus: "IN_PROGRESS",
          newStatus: "RESOLVED",
          changedAt: "2025-08-02T16:30:00Z",
          changeReason: "Emergency situation resolved, driver safe",
          changedByUser: {
            id: "user456",
            fullName: "CS Supervisor - Sarah",
          },
        },
      ],
    },
    Type: "SOS_HISTORY_DETAIL",
  },
};

export const mockSOSHistoryDetailNotFound = {
  data: {
    Message: {
      Code: 404,
      Text: "SOS history detail not found",
    },
    Data: {
      errors: [
        {
          field: "id",
          message: "SOS history with specified ID does not exist",
        },
      ],
    },
    Type: "SOS_HISTORY_DETAIL_ERROR",
  },
};

export const getHistoryDetailSOS = async (historyId, params = {}) => {
  if (!historyId) {
    return {
      data: {
        Message: {
          Code: 400,
          Text: "SOS History ID is required",
        },
        Data: {
          errors: [
            {
              field: "historyId",
              message: "SOS History ID parameter is missing",
            },
          ],
        },
        Type: "SOS_HISTORY_DETAIL_ERROR",
      },
      raw: null,
    };
  }

  let result;

  if (useMockData) {
    // Simulate different scenarios based on history ID
    if (historyId === "hist123e4567-e89b-12d3-a456-426614174000") {
      result = mockSOSHistoryDetail.data;
    } else if (historyId === "hist456e7890-e12b-34c5-d678-901234567890") {
      result = mockSOSHistoryDetailUrgent.data;
    } else {
      result = mockSOSHistoryDetailNotFound.data;
    }
  } else {
    try {
      result = await fetcherMuatrans.get(`/v1/cs/sos/history/${historyId}`, {
        params,
      });
    } catch (error) {
      // Handle error response
      if (error.response?.status === 404) {
        return {
          data: mockSOSHistoryDetailNotFound.data,
          raw: error.response,
        };
      }

      return {
        data: {
          Message: {
            Code: error.response?.status || 500,
            Text:
              error.response?.data?.Message?.Text ||
              "Failed to retrieve SOS history detail",
          },
          Data: {
            errors: [
              {
                field: "system",
                message: "Internal server error occurred",
              },
            ],
          },
          Type: "SOS_HISTORY_DETAIL_ERROR",
        },
        raw: error.response,
      };
    }
  }

  return {
    data: result?.data || {},
    raw: result,
  };
};

export const useGetHistoryDetailSOS = (historyId, params = {}) => {
  const { data, error, isLoading, mutate } = useSWR(
    historyId ? [`getHistoryDetailSOS`, historyId, params] : null,
    () => getHistoryDetailSOS(historyId, params),
    {
      refreshInterval: 60000, // Refresh every 1 minute for history detail
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
    mutate, // Expose mutate for manual refresh
  };
};

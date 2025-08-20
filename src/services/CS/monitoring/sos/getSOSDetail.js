import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockSOSDetailData = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS detail retrieved successfully",
    },
    Data: {
      id: "123e4567-e89b-12d3-a456-426614174000",
      sosStatus: "OPEN",
      isUrgent: false,
      escalationLevel: 1,
      sosTime: "2025-08-04T10:30:00Z",
      responseDeadline: "2025-08-04T12:30:00Z",
      acknowledgedAt: null,
      acknowledgedByUserID: null,
      description: "Mesin mati mendadak saat di jalan tol",
      transporter: {
        id: "trans123",
        companyName: "PT ABC Transport",
        logoUrl: "https://cdn.example.com/logos/abc-transport.png",
        companyPhoneNumber: "02112345678",
        emergencyContactName: "John Smith",
        emergencyContactPhone: "08987654321",
        whatsappBusinessNumber: "628987654321",
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
        id: "cat001",
        categoryName: "Mesin",
        description: "Masalah terkait mesin kendaraan",
      },
      location: {
        sosLatitude: -6.123456,
        sosLongitude: 106.789123,
        lastAddress: "Jalan Sudirman No. 123, Jakarta Pusat",
      },
      order: {
        id: "order123",
        orderNumber: "ORD-20250804-001",
        status: "IN_PROGRESS",
        pickupLocation: "Jakarta",
        deliveryLocation: "Bandung",
        estimatedArrival: "2025-08-04T18:00:00Z",
      },
      photoEvidence: [
        {
          id: "photo1",
          originalFileName: "sos_evidence_1.jpg",
          thumbnailUrl: "https://cdn.example.com/sos/thumb/photo1.jpg",
          mediumUrl: "https://cdn.example.com/sos/medium/photo1.jpg",
          photoUrl: "https://cdn.example.com/sos/original/photo1.jpg",
          imageWidth: 1920,
          imageHeight: 1080,
          fileSize: 524288,
          mimeType: "image/jpeg",
          description: "Mesin dalam kondisi mati",
        },
        {
          id: "photo2",
          originalFileName: "sos_evidence_2.jpg",
          thumbnailUrl: "https://cdn.example.com/sos/thumb/photo2.jpg",
          mediumUrl: "https://cdn.example.com/sos/medium/photo2.jpg",
          photoUrl: "https://cdn.example.com/sos/original/photo2.jpg",
          imageWidth: 1920,
          imageHeight: 1080,
          fileSize: 786432,
          mimeType: "image/jpeg",
          description: "Kondisi jalan tol saat kejadian",
        },
      ],
      countdownMinutes: -45,
      statusHistory: [
        {
          id: "hist1",
          previousStatus: null,
          newStatus: "OPEN",
          changedAt: "2025-08-04T10:30:00Z",
          changeReason: "Initial SOS report created",
        },
        {
          id: "hist2",
          previousStatus: "OPEN",
          newStatus: "ACKNOWLEDGED",
          changedAt: "2025-08-04T10:35:00Z",
          changeReason: "SOS acknowledged by CS team",
        },
      ],
    },
    Type: "SOS_DETAIL",
  },
};

export const mockSOSDetailUrgent = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS detail retrieved successfully",
    },
    Data: {
      id: "456e7890-e89b-12d3-a456-426614174001",
      sosStatus: "IN_PROGRESS",
      isUrgent: true,
      escalationLevel: 3,
      sosTime: "2025-08-04T09:15:00Z",
      responseDeadline: "2025-08-04T11:15:00Z",
      acknowledgedAt: "2025-08-04T09:20:00Z",
      acknowledgedByUserID: "user123",
      description: "Kecelakaan serius di tol km 23, sopir terluka",
      transporter: {
        id: "trans456",
        companyName: "PT XYZ Logistics",
        logoUrl: "https://cdn.example.com/logos/xyz-logistics.png",
        companyPhoneNumber: "02187654321",
        emergencyContactName: "Jane Smith",
        emergencyContactPhone: "08987654321",
        whatsappBusinessNumber: "628987654321",
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
        id: "cat002",
        categoryName: "Kecelakaan",
        description: "Kecelakaan kendaraan",
      },
      location: {
        sosLatitude: -6.234567,
        sosLongitude: 106.890234,
        lastAddress: "Jalan Thamrin No. 456, Jakarta Pusat",
      },
      order: {
        id: "order456",
        orderNumber: "ORD-20250804-002",
        status: "ON_HOLD",
        pickupLocation: "Jakarta",
        deliveryLocation: "Surabaya",
        estimatedArrival: "2025-08-05T10:00:00Z",
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
      countdownMinutes: 30,
      statusHistory: [
        {
          id: "hist3",
          previousStatus: null,
          newStatus: "OPEN",
          changedAt: "2025-08-04T09:15:00Z",
          changeReason: "Emergency SOS report created",
        },
        {
          id: "hist4",
          previousStatus: "OPEN",
          newStatus: "IN_PROGRESS",
          changedAt: "2025-08-04T09:20:00Z",
          changeReason: "Emergency response team dispatched",
        },
      ],
    },
    Type: "SOS_DETAIL",
  },
};

export const mockSOSDetailNotFound = {
  data: {
    Message: {
      Code: 404,
      Text: "SOS report not found",
    },
    Data: {
      errors: [
        {
          field: "id",
          message: "SOS with specified ID does not exist",
        },
      ],
    },
    Type: "SOS_DETAIL_ERROR",
  },
};

export const getSOSDetail = async (id, params = {}) => {
  if (!id) {
    return {
      data: {
        Message: {
          Code: 400,
          Text: "SOS ID is required",
        },
        Data: {
          errors: [
            {
              field: "id",
              message: "SOS ID parameter is missing",
            },
          ],
        },
        Type: "SOS_DETAIL_ERROR",
      },
      raw: null,
    };
  }

  let result;

  if (useMockData) {
    // Simulate different scenarios based on ID
    if (id === "123e4567-e89b-12d3-a456-426614174000") {
      result = mockSOSDetailData.data;
    } else if (id === "456e7890-e89b-12d3-a456-426614174001") {
      result = mockSOSDetailUrgent.data;
    } else {
      result = mockSOSDetailNotFound.data;
    }
  } else {
    try {
      result = await fetcherMuatrans.get(`/v1/cs/sos/${id}`, {
        params,
      });
    } catch (error) {
      // Handle error response
      if (error.response?.status === 404) {
        return {
          data: mockSOSDetailNotFound.data,
          raw: error.response,
        };
      }

      return {
        data: {
          Message: {
            Code: error.response?.status || 500,
            Text:
              error.response?.data?.Message?.Text ||
              "Failed to retrieve SOS detail",
          },
          Data: {
            errors: [
              {
                field: "system",
                message: "Internal server error occurred",
              },
            ],
          },
          Type: "SOS_DETAIL_ERROR",
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

export const useGetSOSDetail = (id, params = {}) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? [`getSOSDetail`, id, params] : null,
    () => getSOSDetail(id, params),
    {
      refreshInterval: 30000, // Refresh every 30 seconds for real-time updates
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

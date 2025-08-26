import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

export const mockSOSDetailData = {
  Message: {
    Code: 200,
    Text: "Detail SOS berhasil diambil",
  },
  Data: {
    sosDetail: {
      sosId: "456e7890-e89b-12d3-a456-426614174001",
      description: "Ban pecah di jalan tol, memerlukan bantuan segera",
      sosTime: "2025-08-05T14:30:00Z",
      status: "RESOLVED",
      resolution: "Bantuan teknis telah diberikan, ban sudah diganti",
      resolvedAt: "2025-08-05T16:15:00Z",
      location: {
        latitude: -6.2088,
        longitude: 106.8456,
        address: "Jalan Tol Jakarta-Cikampek KM 15, Jakarta Timur",
        isLocationAccurate: true,
      },
      category: {
        categoryId: "cat-123-456",
        categoryCode: "VEHICLE_BREAKDOWN",
        categoryName: "Kerusakan Kendaraan",
        priorityLevel: "HIGH",
        iconUrl: "https://example.com/icons/vehicle-breakdown.png",
        colorCode: "#FF6B6B",
      },
      fleetInfo: {
        fleetId: "fleet-789-012",
        licensePlate: "B 1234 XYZ",
        driverName: "Ahmad Sudrajat",
        driverPhone: "+62812345678901",
      },
      transporterInfo: {
        transporterId: "trans-345-678",
        companyName: "PT Angkutan Jaya",
        phoneNumber: "+62215551234",
      },
      photoEvidence: [
        {
          photoId: "photo-001-abc",
          photoUrl: "https://example.com/photos/sos-evidence-1.jpg",
          description: "Kondisi ban yang pecah",
          uploadedAt: "2025-08-05T14:45:00Z",
        },
        {
          photoId: "photo-002-def",
          photoUrl: "https://example.com/photos/sos-evidence-2.jpg",
          description: "Lokasi kejadian dari sisi jalan",
          uploadedAt: "2025-08-05T14:50:00Z",
        },
      ],
      timeline: [
        {
          timestamp: "2025-08-05T14:30:00Z",
          event: "SOS Dilaporkan",
          description: "Driver melaporkan kondisi SOS",
          status: "OPEN",
        },
        {
          timestamp: "2025-08-05T14:35:00Z",
          event: "Tim Respons Dihubungi",
          description: "Operator CS menghubungi tim respons darurat",
          status: "IN_PROGRESS",
        },
        {
          timestamp: "2025-08-05T15:20:00Z",
          event: "Tim Bantuan Tiba",
          description: "Tim bantuan teknis tiba di lokasi",
          status: "IN_PROGRESS",
        },
        {
          timestamp: "2025-08-05T16:15:00Z",
          event: "Masalah Teratasi",
          description:
            "Ban sudah diganti, kendaraan siap melanjutkan perjalanan",
          status: "RESOLVED",
        },
      ],
    },
  },
  Type: "SOS_DETAIL_SUCCESS",
};

export const mockSOSDetailUrgent = {
  Message: {
    Code: 200,
    Text: "Detail SOS berhasil diambil",
  },
  Data: {
    sosDetail: {
      sosId: "789e0123-e89b-12d3-a456-426614174002",
      description: "Mesin overheating, asap keluar dari kap mesin",
      sosTime: "2025-08-05T10:15:00Z",
      status: "OPEN",
      resolution: null,
      resolvedAt: null,
      location: {
        latitude: -6.3751,
        longitude: 106.865,
        address: "Jalan Raya Bogor KM 25, Depok",
        isLocationAccurate: true,
      },
      category: {
        categoryId: "cat-456-789",
        categoryCode: "ENGINE_PROBLEM",
        categoryName: "Masalah Mesin",
        priorityLevel: "CRITICAL",
        iconUrl: "https://example.com/icons/engine-problem.png",
        colorCode: "#DC143C",
      },
      fleetInfo: {
        fleetId: "fleet-012-345",
        licensePlate: "B 5678 ABC",
        driverName: "Budi Santoso",
        driverPhone: "+62812345678902",
      },
      transporterInfo: {
        transporterId: "trans-678-901",
        companyName: "CV Transportasi Mandiri",
        phoneNumber: "+62215551235",
      },
      photoEvidence: [
        {
          photoId: "photo-003-ghi",
          photoUrl: "https://example.com/photos/sos-evidence-3.jpg",
          description: "Asap keluar dari kap mesin",
          uploadedAt: "2025-08-05T10:20:00Z",
        },
      ],
      timeline: [
        {
          timestamp: "2025-08-05T10:15:00Z",
          event: "SOS Dilaporkan",
          description: "Driver melaporkan mesin overheating",
          status: "OPEN",
        },
        {
          timestamp: "2025-08-05T10:18:00Z",
          event: "Konfirmasi Diterima",
          description: "Operator CS mengkonfirmasi penerimaan laporan",
          status: "OPEN",
        },
      ],
    },
  },
  Type: "SOS_DETAIL_SUCCESS",
};

export const mockSOSDetailNotFound = {
  Message: {
    Code: 404,
    Text: "Detail SOS tidak ditemukan",
  },
  Type: "SOS_DETAIL_NOT_FOUND",
};

export const getSOSDetail = async (orderId, sosId, params = {}) => {
  if (!orderId || !sosId) {
    return {
      data: {
        Message: {
          Code: 400,
          Text: "Parameter orderId dan sosId wajib disediakan",
        },
        Data: {
          errors: [
            {
              field: "orderId",
              message: "Order ID parameter is missing",
            },
            {
              field: "sosId",
              message: "SOS ID parameter is missing",
            },
          ],
        },
        Type: "SOS_DETAIL_BAD_REQUEST",
      },
      raw: null,
    };
  }

  let result;

  if (useMockData) {
    // Use the new mock endpoint structure
    try {
      const response = await fetch(`/api/v1/cs/orders/${orderId}/sos/${sosId}`);
      result = await response.json();
    } catch (error) {
      result = mockSOSDetailNotFound.data;
    }
  } else {
    try {
      result = await fetcherMuatrans.get(
        `/v1/cs/orders/${orderId}/sos/${sosId}`,
        {
          params,
        }
      );
    } catch (error) {
      // Handle error response
      if (error.response?.status === 404) {
        return {
          data: {
            Message: {
              Code: 404,
              Text: "Detail SOS tidak ditemukan",
            },
            Type: "SOS_DETAIL_NOT_FOUND",
          },
          raw: error.response,
        };
      }

      return {
        data: {
          Message: {
            Code: error.response?.status || 500,
            Text:
              error.response?.data?.Message?.Text || "Terjadi kesalahan server",
          },
          Type: "SOS_DETAIL_ERROR",
        },
        raw: error.response,
      };
    }
  }

  return {
    data: result || {},
    raw: result,
  };
};

export const useGetSOSDetail = (orderId, sosId, params = {}, options = {}) => {
  const {
    enableRefresh = true,
    refreshInterval = 30000,
    revalidateOnFocus = false, // Changed to false to prevent excessive calls
    revalidateOnReconnect = true,
    errorRetryCount = 2, // Reduced from 3 to prevent excessive retries
    errorRetryInterval = 5000,
  } = options;

  const { data, error, isLoading, mutate } = useSWR(
    orderId && sosId ? [`getSOSDetail`, orderId, sosId, params] : null,
    () => getSOSDetail(orderId, sosId, params),
    {
      refreshInterval: enableRefresh ? refreshInterval : 0,
      revalidateOnFocus,
      revalidateOnReconnect,
      errorRetryCount,
      errorRetryInterval,
      // Add dedupingInterval to prevent duplicate requests
      dedupingInterval: 5000,
      // Add focusThrottleInterval to prevent excessive focus revalidation
      focusThrottleInterval: 10000,
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

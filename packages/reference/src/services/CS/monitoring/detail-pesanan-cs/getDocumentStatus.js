import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

const mockApiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Status dokumen berhasil diambil",
    },
    Data: {
      documentStatus: {
        overallStatus: "SHIPPING",
        isPrepared: true,
        isShipped: true,
        isReceived: false,
        preparedAt: "2025-08-05T10:00:00Z",
        shippedAt: "2025-08-05T14:30:00Z",
        receivedAt: null,
      },
      shipments: [
        {
          shipmentId: "550e8400-e29b-41d4-a716-446655440001",
          trackingNumber: "TRK123456789",
          courier: "JNE Express",
          status: "In Transit",
          sentAt: "2025-08-05T14:30:00Z",
          notes: "Package in transit to destination",
          receipt: {
            receiptNumber: "RCP-2025080501",
            receiptCourier: "JNE Express",
            receiptImage: "https://example.com/receipt/rcp-2025080501.jpg",
            issuedAt: "2025-08-05T14:45:00Z",
            estimatedDeliveryDate: "2025-08-07",
          },
          photos: [
            {
              photoId: "550e8400-e29b-41d4-a716-446655440002",
              photoUrl: "https://example.com/photos/shipment1.jpg",
              description: "Package ready for shipping",
              uploadedAt: "2025-08-05T14:35:00Z",
            },
          ],
        },
      ],
      additionalService: {
        serviceId: "550e8400-e29b-41d4-a716-446655440004",
        serviceName: "Pengiriman Dokumen",
        serviceFee: 25000.0,
        deliveryAddress:
          "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220",
        specialInstructions:
          "Harap konfirmasi terlebih dahulu sebelum pengiriman",
      },
    },
    Type: "DOCUMENT_STATUS_SUCCESS",
  },
};

export const getDocumentStatus = async (cacheKey) => {
  if (useMockData) {
    return mockApiResult.data.Data;
  }
  const result = await fetcherMuatrans.get(cacheKey);
  return result?.data?.Data || {};
};

export const useGetDocumentStatus = (orderId, params = {}, options = {}) => {
  const queryParams = new URLSearchParams(params).toString();

  const cacheKey = orderId
    ? `/v1/cs/orders/${orderId}/document-status${queryParams ? `?${queryParams}` : ""}`
    : null;

  return useSWR(cacheKey, getDocumentStatus, options);
};

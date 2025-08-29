// /api/v1/orders/{orderId}/old-driver/{driverId}
import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

const apiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Driver status definitions retrieved successfully",
    },
    Data: {
      driverId: "uuid-driver-1",
      name: "Ahmad Rahman",
      phoneNumber: "081234567891",
      profileImage: "https://example.com/driver1.jpg",
      statusDriver: "MENUJU_LOKASI_MUAT_1",
      statusTitle: "Menuju Lokasi Muat 1",
      licensePlate: "B 1234 CD",
      estimatedArrival: "raw date",
      statusDefinitions: [
        {
          mappedOrderStatus: "PROSES_BONGKAR",
          children: [
            {
              statusCode: "MENUJU_LOKASI_MUAT_1",
              statusName: "Menuju Lokasi Muat 1",
              date: "raw date",
              requiresQRScan: false,
              requiresPhoto: false,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },
          ],
        },
        {
          mappedOrderStatus: "PROSES_MUAT",
          children: [
            {
              statusCode: "MENUJU_LOKASI_MUAT_1",
              statusName: "Menuju Lokasi Muat 1",
              date: "raw date",
              requiresQRScan: false,
              requiresPhoto: false,
              photoEvidences: {
                packages: [],
                pods: [],
              },
            },
          ],
        },
        {
          mappedOrderStatus: "DOCUMENT_DELIVERY",
          children: [],
          shippingEvidence: {
            date: "2025-02-08T09:00:00Z",
            photo: [
              "/img/muatan1.png",
              "/img/muatan2.png",
              "/img/muatan3.png",
              "/img/muatan4.png",
            ],
            noted:
              "Kami informasikan bahwa dokumen telah kami kirim dan saat ini sudah diterima oleh Bapak Ervin Sudjatmiko. Mohon konfirmasi apabila ada hal yang perlu ditindaklanjuti lebih lanjut. Kami siap membantu apabila dibutuhkan klarifikasi atau kelengkapan tambahan. Terima kasih atas perhatian dan kerja samanya.",
          },
        },
      ],
    },
    Type: "DRIVER_STATUS_DEFINITIONS",
  },
};

// Fetcher function for old driver detail
export const fetcherStatusDriver = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];
  const driverId = cacheKey.split("/")[2];

  let result;
  if (useMockData) {
    result = apiResult;
  } else {
    result = await fetcherMuatrans.get(`/v1/orders/status-driver`, {
      params: { orderId: orderId, driverId: driverId },
    });
  }
  return result?.data?.Data || null;
};

// SWR hook for old driver detail
export const useStatusDriver = (orderId, driverId) =>
  useSWR(
    orderId && driverId ? `statusDriver/${orderId}/${driverId}` : null,
    fetcherStatusDriver
  );

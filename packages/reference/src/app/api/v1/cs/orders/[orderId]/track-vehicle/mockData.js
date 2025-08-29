export const trackingData = {
  MT25201: {
    orderCode: "MT25MULTI",
    vehicles: [
      {
        id: "AE 1111 LBA",
        licensePlate: "AE 1111 LBA",
        driverName: "Noel Gallagher",
        status: "Proses Muat",
        statusVariant: "primary",
        icon: "/img/monitoring/truck/blue.png", // Menggunakan ikon dari monitoring
        position: { lat: -7.2891, lng: 112.7351 },
        heading: 45,
        transporterName: "PT Batavia Prospe...",
        timeline: {
          statusDefinitions: [
            {
              mappedOrderStatus: "LOADING",
              date: "2024-09-12T12:00:00Z",
              children: [
                {
                  statusCode: "SEDANG_MUAT",
                  statusName: "Sedang Muat",
                  date: "2024-09-12T12:00:00Z",
                  requiresPhoto: false,
                },
              ],
            },
          ],
        },
      },
      {
        id: "AE 3333 LBA",
        licensePlate: "AE 3333 LBA",
        driverName: "Muhammad Rizky...",
        status: "Menuju ke Lokasi Bongkar",
        statusVariant: "primary",
        icon: "/img/monitoring/truck/blue.png",
        position: { lat: -7.2952, lng: 112.7588 },
        heading: 120,
        transporterName: "PT. Truk Jaya Selalu",
        timeline: {
          statusDefinitions: [
            {
              mappedOrderStatus: "LOADING",
              date: "2024-09-12T12:00:00Z",
              children: [
                {
                  statusCode: "SEDANG_MUAT",
                  statusName: "Sedang Muat",
                  date: "2024-09-12T12:00:00Z",
                  requiresPhoto: false,
                },
                {
                  statusCode: "ANTRI_DI_LOKASI_MUAT",
                  statusName: "Antri di Lokasi Muat",
                  date: "2024-09-12T11:30:00Z",
                  requiresPhoto: false,
                },
                {
                  statusCode: "TIBA_DI_LOKASI_MUAT",
                  statusName: "Tiba di Lokasi Muat",
                  date: "2024-09-12T11:00:00Z",
                  requiresPhoto: false,
                },
                {
                  statusCode: "MENUJU_KE_LOKASI_MUAT",
                  statusName: "Menuju ke Lokasi Muat",
                  date: "2024-09-12T10:30:00Z",
                  requiresPhoto: false,
                },
              ],
            },
          ],
        },
      },
    ],
    pickupLocations: [{ lat: -7.287, lng: 112.739, label: "Lokasi Muat" }],
    dropoffLocations: [{ lat: -7.275, lng: 112.631, label: "Lokasi Bongkar" }],
    routePolyline: "encoded_polyline_string_here", // Polyline untuk rute
  },
};

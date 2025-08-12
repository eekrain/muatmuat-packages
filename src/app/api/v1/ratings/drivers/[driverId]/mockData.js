export const baseRatingHistory = [
  {
    id: "RATING_001",
    date: "2025-04-13T08:23:00Z",
    orderNumber: "MT25A001A",
    driverName: "Ahmad Maulana",
    armada: {
      name: "Colt Diesel Engkel",
      carrier: "Box",
      licensePlate: "L 1234 FF",
    },
    rating: 4.0,
    review:
      "Driver sangat ramah dan profesional. Pengiriman dilakukan tepat waktu dan kondisi paket tetap aman tanpa kerusakan. Komunikasi juga sangat baik, driver menghubungi sebelum tiba dan memastikan paket diterima langsung oleh penerima. Pelayanan yang memuaskan dan bisa diandalkan. Terima kasih atas kerja keras dan dedikasinya. Sangat direkomendasikan untuk pengiriman berikutnya!",
  },
  {
    id: "RATING_002",
    date: "2025-04-12T08:23:00Z",
    orderNumber: "MT25A001A",
    driverName: "Ahmad Maulana",
    armada: {
      name: "Tractor head 6 x 4 dan Semi Trailer",
      carrier: "Flatbed Container Jumbo 45 ft (3 As)",
      licensePlate: "L 1234 FF",
    },
    rating: 5.0,
    review: "Sangat cocok untuk truk dengan bak terbuka ya...",
  },
  {
    id: "RATING_003",
    date: "2025-04-11T08:23:00Z",
    orderNumber: "MT25A001A",
    driverName: "Ahmad Maulana",
    armada: {
      name: "Colt Diesel Double",
      carrier: "Bak Terbuka",
      licensePlate: "L 1234 FF",
    },
    rating: 5.0,
    review: "Sangat cocok untuk truk dengan bak terbuka ya...",
  },
  // Add more data for pagination and filtering
  {
    id: "RATING_004",
    date: "2025-03-20T11:00:00Z",
    orderNumber: "MT25A002B",
    driverName: "Ahmad Maulana",
    armada: {
      name: "Colt Diesel Engkel",
      carrier: "Box",
      licensePlate: "B 5678 AG",
    },
    rating: 3.5,
    review:
      "Pengiriman sedikit terlambat dari jadwal, tapi komunikasi dari driver cukup baik.",
  },
  {
    id: "RATING_005",
    date: "2025-02-15T14:30:00Z",
    orderNumber: "MT25A003C",
    driverName: "Ahmad Maulana",
    armada: {
      name: "Colt Diesel Double",
      carrier: "Bak Terbuka",
      licensePlate: "L 1234 FF",
    },
    rating: 4.8,
    review: "Luar biasa, sangat memuaskan.",
  },
  {
    id: "RATING_006",
    date: "2025-01-28T09:00:00Z",
    orderNumber: "MT25A001A",
    driverName: "Ahmad Maulana",
    armada: {
      name: "Colt Diesel Double",
      carrier: "Bak Terbuka",
      licensePlate: "L 1234 FF",
    },
    rating: 5.0,
    review: "Sangat cocok untuk truk dengan bak terbuka ya...",
  },
];

export const successShell = {
  Message: { Code: 200, Text: "Driver rating history retrieved successfully" },
  Data: {},
  Type: "DRIVER_RATING_HISTORY",
};

export const serverErrorResponse = {
  Message: { Code: 500, Text: "Internal Server Error" },
  Data: {
    errors: [{ field: "general", message: "An unexpected error occurred." }],
  },
  Type: "INTERNAL_SERVER_ERROR",
};

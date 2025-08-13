export const baseReviews = [
  {
    id: "REV_001",
    date: "2025-04-13T08:23:00Z",
    orderNumber: "MT25A001A",
    driver: { name: "Wahyu Widi Widayat", licensePlate: "L 1234 FF" },
    rating: 4.0,
    review:
      "Driver sangat ramah dan profesional. Pengiriman dilakukan tepat waktu dan kondisi paket tetap aman tanpa kerusakan. Komunikasi juga sangat baik, driver menghubungi sebelum tiba dan memastikan paket diterima langsung oleh penerima. Pelayanan yang memuaskan dan bisa diandalkan. Terima kasih atas kerja keras dan dedikasinya. Sangat direkomendasikan untuk pengiriman berikutnya!",
    status: "new",
  },
  {
    id: "REV_002",
    date: "2025-04-12T15:10:00Z",
    orderNumber: "MT25A002A",
    driver: {
      name: "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra Toldo Sasmita",
      licensePlate: "L 1234 FF",
    },
    rating: 5.0,
    review: "Driver sangat ramah dan profesional.",
    status: "new",
  },
  {
    id: "REV_003",
    date: "2025-04-11T18:45:00Z",
    orderNumber: "MT25A003A",
    driver: {
      name: "Daffa Toldo Dharmawan Muhammad",
      licensePlate: "L 1234 FF",
    },
    rating: 5.0,
    review: "Sangat cocok untuk truk dengan bak terbuka ya...",
    status: "new",
  },
  {
    id: "REV_004",
    date: "2025-04-10T12:00:00Z",
    orderNumber: "MT25A004A",
    driver: { name: "Wahyu Widi Widayat", licensePlate: "L 1234 FF" },
    rating: 4.5,
    review: "Layanan yang bagus, akan digunakan lagi.",
    status: "read",
  },
  {
    id: "REV_005",
    date: "2025-04-09T09:30:00Z",
    orderNumber: "MT25A005A",
    driver: {
      name: "Daffa Toldo Dharmawan Muhammad",
      licensePlate: "L 1234 FF",
    },
    rating: 3.0,
    review: "Ada sedikit keterlambatan, tapi secara keseluruhan oke.",
    status: "read",
  },
  {
    id: "REV_006",
    date: "2025-04-08T16:20:00Z",
    orderNumber: "MT25A006A",
    driver: { name: "Wahyu Widi Widayat", licensePlate: "L 1234 FF" },
    rating: 5.0,
    review: "Sempurna!",
    status: "read",
  },
];

export const successShell = {
  Message: { Code: 200, Text: "Reviews retrieved successfully" },
  Data: {},
  Type: "REVIEWS_LIST",
};

export const serverErrorResponse = {
  Message: { Code: 500, Text: "Internal Server Error" },
  Data: {
    errors: [{ field: "general", message: "An unexpected error occurred." }],
  },
  Type: "INTERNAL_SERVER_ERROR",
};

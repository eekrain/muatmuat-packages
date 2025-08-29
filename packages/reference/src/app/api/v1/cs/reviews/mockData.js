export const baseReviews = [
  {
    id: "REV_001",
    date: "2025-04-13T08:23:00Z",
    orderNumber: "MT25A001A",
    transporter: {
      id: "TPT_001",
      name: "PT. Logistik Cepat",
      logo: "/img/seller-logo.png",
    },
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
    transporter: {
      id: "TPT_001",
      name: "PT. Logistik Cepat",
      logo: "/img/seller-logo.png",
    },
    driver: {
      name: "Muhammad Rizky Ramadhani Pratama Setiawan",
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
    transporter: {
      id: "TPT_001",
      name: "PT. Logistik Cepat",
      logo: "/img/seller-logo.png",
    },
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
    date: "2025-04-11T15:20:00Z",
    orderNumber: "MT25A004A",
    transporter: {
      id: "TPT_006",
      name: "PT Mega Freight Services",
      logo: "/img/seller-logo.png",
    },
    driver: {
      name: "Daffa Toldo Dharmawan Muhammad",
      licensePlate: "L 1234 FF",
    },
    rating: 5.0,
    review: "Sangat cocok untuk truk dengan bak terbuka ya...",
    status: "new",
  },
  {
    id: "REV_005",
    date: "2025-04-10T11:00:00Z",
    orderNumber: "MT25A005A",
    transporter: {
      id: "TPT_001",
      name: "PT. Logistik Cepat",
      logo: "/img/seller-logo.png",
    },
    driver: {
      name: "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra Toldo Sasmita",
      licensePlate: "L 1234 FF",
    },
    rating: 5.0,
    review: "Sangat cocok untuk truk dengan bak terbuka ya...",
    status: "read",
  },
  {
    id: "REV_006",
    date: "2025-04-09T09:30:00Z",
    orderNumber: "MT25A006A",
    transporter: {
      id: "TPT_001",
      name: "PT. Logistik Cepat",
      logo: "/img/seller-logo.png",
    },
    driver: {
      name: "Daffa Toldo Dharmawan Muhammad",
      licensePlate: "L 1234 FF",
    },
    rating: 3.0,
    review: "Ada sedikit keterlambatan, tapi secara keseluruhan oke.",
    status: "read",
  },
  {
    id: "REV_007",
    date: "2025-04-08T16:20:00Z",
    orderNumber: "MT25A007A",
    transporter: {
      id: "TPT_006",
      name: "PT Mega Freight Services",
      logo: "/img/seller-logo.png",
    },
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

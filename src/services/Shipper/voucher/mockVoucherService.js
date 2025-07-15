// Mock data untuk testing voucher
const MOCK_VOUCHERS = [
  {
    id: "550e8400-e29b-41d4-a716-446655440070",
    code: "DISKON50K",
    name: "Diskon 50 Ribu",
    description: "Potongan Rp 50.000 untuk transaksi minimal Rp 1.000.000",
    discountType: "FIXED_AMOUNT",
    discountAmount: 50000,
    discountPercentage: null,
    minOrderAmount: 300000,
    maxDiscountAmount: 100000,
    validFrom: "2024-01-01T00:00:00Z",
    validTo: "2025-12-31T23:59:59Z",
    termsAndConditions:
      "1. Voucher berlaku untuk semua pengguna\\n2. Masa berlaku voucher sampai 31 Desember 2025\\n3. Minimum pembelian Rp 300.000",
    quota: 1000,
    usage: {
      globalPercentage: 35,
    },
    isOutOfStock: false,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440074",
    code: "DISKONPENGGUNABARU",
    name: "Diskon Pengguna Baru",
    description: "Potongan Rp 100.000 khusus untuk pengguna baru",
    discountType: "FIXED_AMOUNT",
    discountAmount: 100000,
    discountPercentage: null,
    minOrderAmount: 50000,
    maxDiscountAmount: 100000,
    validFrom: "2024-01-01T00:00:00Z",
    validTo: "2025-12-31T23:59:59Z",
    termsAndConditions:
      "1. Voucher berlaku untuk pengguna baru\\n2. Masa berlaku voucher sampai 31 Desember 2025\\n3. Minimum pembelian Rp 50.000",
    quota: 500,
    usage: {
      globalPercentage: 25,
    },
    isOutOfStock: false,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440071",
    code: "HEMAT20",
    name: "Hemat 20%",
    description: "Diskon 20% maksimal Rp 100.000",
    discountType: "PERCENTAGE",
    discountAmount: null,
    discountPercentage: 20,
    minOrderAmount: 50000,
    maxDiscountAmount: 100000,
    validFrom: "2024-01-01T00:00:00Z",
    validTo: "2025-12-31T23:59:59Z",
    termsAndConditions:
      "1. Voucher berlaku untuk semua pengguna\\n2. Masa berlaku voucher sampai 31 Desember 2025\\n3. Minimum pembelian Rp 50.000",
    quota: 500,
    usage: {
      globalPercentage: 80,
    },
    isOutOfStock: false,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440072",
    code: "GRATIS10K",
    name: "Gratis 10 Ribu",
    description: "Potongan Rp 10.000 untuk transaksi minimal Rp 50.000",
    discountType: "FIXED_AMOUNT",
    discountAmount: 10000,
    discountPercentage: null,
    minOrderAmount: 50000,
    maxDiscountAmount: 10000,
    validFrom: "2024-01-01T00:00:00Z",
    validTo: "2025-12-31T23:59:59Z",
    termsAndConditions:
      "1. Voucher berlaku untuk semua pengguna\\n2. Masa berlaku voucher sampai 31 Desember 2025\\n3. Minimum pembelian Rp 50.000",
    quota: 200,
    usage: {
      globalPercentage: 100,
    },
    isOutOfStock: true,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440073",
    code: "MURAH15",
    name: "Murah 15%",
    description: "Diskon 15% maksimal Rp 75.000",
    discountType: "PERCENTAGE",
    discountAmount: null,
    discountPercentage: 15,
    minOrderAmount: 25000,
    maxDiscountAmount: 75000,
    validFrom: "2024-01-01T00:00:00Z",
    validTo: "2025-12-31T23:59:59Z",
    termsAndConditions:
      "1. Voucher berlaku untuk semua pengguna\\n2. Masa berlaku voucher sampai 31 Desember 2025\\n3. Minimum pembelian Rp 25.000",
    quota: 750,
    usage: {
      globalPercentage: 45,
    },
    isOutOfStock: false,
  },
  // ===== VOUCHERS FOR RACE CONDITION TESTING =====
  {
    id: "550e8400-e29b-41d4-a716-446655440075",
    code: "FLASH25K",
    name: "Flash Sale 25K",
    description: "Potongan Rp 25.000 untuk transaksi minimal Rp 100.000",
    discountType: "FIXED_AMOUNT",
    discountAmount: 25000,
    discountPercentage: null,
    minOrderAmount: 100000,
    maxDiscountAmount: 25000,
    validFrom: "2024-01-01T00:00:00Z",
    validTo: "2025-12-31T23:59:59Z",
    termsAndConditions:
      "1. Voucher berlaku untuk semua pengguna\\n2. Masa berlaku voucher sampai 31 Desember 2025\\n3. Minimum pembelian Rp 100.000\\n4. Stok terbatas",
    quota: 100,
    usage: {
      globalPercentage: 95, // Hampir habis
    },
    isOutOfStock: false, // Terlihat available di client
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440076",
    code: "VIRAL30",
    name: "Viral 30%",
    description: "Diskon 30% maksimal Rp 150.000 - Limited Time!",
    discountType: "PERCENTAGE",
    discountAmount: null,
    discountPercentage: 30,
    minOrderAmount: 200000,
    maxDiscountAmount: 150000,
    validFrom: "2024-01-01T00:00:00Z",
    validTo: "2025-12-31T23:59:59Z",
    termsAndConditions:
      "1. Voucher berlaku untuk semua pengguna\\n2. Masa berlaku voucher sampai 31 Desember 2025\\n3. Minimum pembelian Rp 200.000\\n4. Kuota sangat terbatas",
    quota: 50,
    usage: {
      globalPercentage: 98, // Hampir habis
    },
    isOutOfStock: false, // Terlihat available di client
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440077",
    code: "HOKI88",
    name: "Hoki 88K",
    description: "Potongan Rp 88.000 untuk pembelian hari ini",
    discountType: "FIXED_AMOUNT",
    discountAmount: 88000,
    discountPercentage: null,
    minOrderAmount: 500000,
    maxDiscountAmount: 88000,
    validFrom: "2024-01-01T00:00:00Z",
    validTo: "2025-12-31T23:59:59Z",
    termsAndConditions:
      "1. Voucher berlaku untuk semua pengguna\\n2. Masa berlaku voucher sampai 31 Desember 2025\\n3. Minimum pembelian Rp 500.000\\n4. Hanya tersisa sedikit",
    quota: 25,
    usage: {
      globalPercentage: 96, // Hampir habis
    },
    isOutOfStock: false, // Terlihat available di client
  },
];

// Voucher IDs yang akan di-simulate habis di server-side (race condition)
const RACE_CONDITION_VOUCHER_IDS = [
  "550e8400-e29b-41d4-a716-446655440075", // FLASH25K
  "550e8400-e29b-41d4-a716-446655440076", // VIRAL30
  "550e8400-e29b-41d4-a716-446655440077", // HOKI88
];

/**
 * Mock service untuk mendapatkan daftar voucher yang tersedia
 * Mensimulasikan API GET /v1/orders/vouchers
 */
export const mockGetAvailableVouchers = async () => {
  // Simulasi delay network
  await new Promise((resolve) => setTimeout(resolve, 800));

  return MOCK_VOUCHERS;
};

/**
 * Mock service untuk memvalidasi voucher
 * Mensimulasikan API POST /v1/orders/vouchers/validate
 */
export const mockValidateVoucher = async ({ voucherId, totalAmount }) => {
  // Simulasi delay network
  await new Promise((resolve) => setTimeout(resolve, 500));

  const voucher = MOCK_VOUCHERS.find((v) => v.id === voucherId);

  if (!voucher) {
    return {
      voucherId,
      code: null,
      isValid: false,
      validationMessages: ["Voucher tidak ditemukan"],
    };
  }

  // Simulasi race condition - voucher habis di server meskipun terlihat available di client
  if (RACE_CONDITION_VOUCHER_IDS.includes(voucherId)) {
    return {
      voucherId,
      code: voucher.code,
      isValid: false,
      validationMessages: ["Kode voucher telah habis"],
    };
  }

  // Validasi minimum order amount
  if (totalAmount < voucher.minOrderAmount) {
    return {
      voucherId,
      code: voucher.code,
      isValid: false,
      validationMessages: [
        `Minimum transaksi untuk voucher ini adalah Rp ${voucher.minOrderAmount.toLocaleString("id-ID")}`,
      ],
    };
  }

  // Validasi stock
  if (voucher.isOutOfStock) {
    return {
      voucherId,
      code: voucher.code,
      isValid: false,
      validationMessages: ["Voucher sudah habis"],
    };
  }

  // Validasi tanggal
  const now = new Date();
  const validFrom = new Date(voucher.validFrom);
  const validTo = new Date(voucher.validTo);

  if (now < validFrom || now > validTo) {
    return {
      voucherId,
      code: voucher.code,
      isValid: false,
      validationMessages: ["Voucher sudah tidak berlaku"],
    };
  }

  // Voucher valid
  return {
    voucherId,
    code: voucher.code,
    isValid: true,
    validationMessages: [],
  };
};

// Export mock vouchers untuk testing
export { MOCK_VOUCHERS, RACE_CONDITION_VOUCHER_IDS };

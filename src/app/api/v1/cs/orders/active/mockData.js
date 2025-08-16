// This mock data is now fully consistent, with all order objects using the correct location structure.
export const activeOrdersData = {
  orders: [
    {
      id: "order-011",
      orderCode: "MT25A002A",
      orderType: "Terjadwal",
      orderStatus: "PROSES_PENGIRIMAN_DOKUMEN",
      shipper: {
        id: "shipper-001",
        name: "Agam Tunggal Jaya Agam Tunggal Jaya",
        contactNumber: "081234567890",
      },
      transporter: {
        id: "transporter-001",
        name: "PT Siba Surya PT Siba Surya PT Siba Surya",
        contactNumber: "087654321098",
      },
      loadingSchedule: {
        startDate: "2025-01-02T18:00:00Z",
        endDate: "2025-01-02T20:00:00Z",
      },
      pickupLocations: [
        {
          fullAddress: "Kota Surabaya, Kec. Tegalsari, Jawa Timur, 60261",
          sequence: 1,
        },
        {
          fullAddress: "Kota Sidoarjo, Kec. Waru, Jawa Timur, 61256",
          sequence: 2,
        },
      ],
      dropoffLocations: [
        {
          fullAddress: "Kota Pasuruan, Kec. Klojen, Jawa Timur, 67111",
          sequence: 1,
        },
        {
          fullAddress: "Kota Malang, Kec. Blimbing, Jawa Timur, 65125",
          sequence: 2,
        },
      ],
      truckType: { name: "Colt Diesel Double" },
      carrierTruck: { name: "Bak Terbuka" },
      truckCount: 1,
      totalWeight: 1000,
      weightUnit: "kg",
      cargoItems: [{ name: "Besi Baja" }, { name: "Batu Bata" }],
      sosStatus: { hasSos: false, sosCount: 0 },
    },
    {
      id: "order-002",
      orderCode: "MT25A002B",
      orderType: "Instan",
      orderStatus: "ARMADA_DIJADWALKAN",
      shipper: {
        id: "shipper-002",
        name: "Fernando Torres",
        contactNumber: "081234567891",
      },
      transporter: {
        id: "transporter-001",
        name: "PT Siba Surya",
        contactNumber: "087654321098",
      },
      loadingSchedule: { startDate: new Date().toISOString() },
      pickupLocations: [
        {
          fullAddress: "Kota Surabaya, Kec. Tegalsari, Jawa Timur, 60261",
          sequence: 1,
        },
      ],
      dropoffLocations: [
        {
          fullAddress: "Kota Pasuruan, Kec. Klojen, Jawa Timur, 67111",
          sequence: 1,
        },
      ],
      truckType: { name: "Colt Diesel Double" },
      carrierTruck: { name: "Bak Terbuka" },
      truckCount: 1,
      totalWeight: 1000,
      weightUnit: "kg",
      cargoItems: [{ name: "Besi" }],
      sosStatus: { hasSos: true, sosCount: 1 },
    },
    {
      id: "order-003",
      orderCode: "MT25A002C",
      orderType: "Terjadwal",
      orderStatus: "PERLU_ASSIGN_ARMADA",
      shipper: {
        id: "shipper-001",
        name: "Agam Tunggal Jaya",
        contactNumber: "081234567890",
      },
      transporter: {
        id: "transporter-002",
        name: "Orbital Dynamics Interstellar Freight & Terrestrial Cargo Solutions Corporation",
        contactNumber: "087654321098",
      },
      loadingSchedule: {
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      pickupLocations: [
        {
          fullAddress: "Kota Surabaya, Kec. Tegalsari, Jawa Timur, 60261",
          sequence: 1,
        },
      ],
      dropoffLocations: [
        {
          fullAddress: "Kota Pasuruan, Kec. Klojen, Jawa Timur, 67111",
          sequence: 1,
        },
      ],
      truckType: {
        name: "8x4 Tridem Multi-Axle Extra Heavy-Duty Long-Haul Truck",
      },
      carrierTruck: {
        name: "Multi-Axle Extendable Flatbed Carrier with Hydraulic Steering, Air Suspension System, and Twistlock Mounts for Oversized Industrial Freight Transport",
      },
      truckCount: 3,
      totalWeight: 2500,
      weightUnit: "kg",
      cargoItems: [
        { name: "Peralatan Rumah Tangga" },
        { name: "Besi Baja" },
        { name: "Batu Bata" },
        { name: "Karet Mentah" },
        { name: "Kerikil" },
        { name: "Makanan dan Minuman" },
        { name: "Kayu" },
        { name: "Bahan Mentah" },
      ],
      sosStatus: { hasSos: false, sosCount: 0 },
    },
    {
      id: "order-004",
      orderCode: "MT25A002D",
      orderType: "Terjadwal",
      orderStatus: "PERLU_RESPON_PERUBAHAN",
      shipper: {
        id: "shipper-003",
        name: "Shipper Tiga",
        contactNumber: "081234567892",
      },
      transporter: {
        id: "transporter-003",
        name: "Transporter Tiga",
        contactNumber: "087654321096",
      },
      loadingSchedule: {
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      pickupLocations: [
        { fullAddress: "Kota Malang, Jawa Timur, 65111", sequence: 1 },
      ],
      dropoffLocations: [
        { fullAddress: "Kota Batu, Jawa Timur, 65311", sequence: 1 },
      ],
      truckType: { name: "Tronton" },
      carrierTruck: { name: "Wing Box" },
      truckCount: 2,
      totalWeight: 5000,
      weightUnit: "kg",
      cargoItems: [{ name: "Pakaian" }],
      sosStatus: { hasSos: false, sosCount: 0 },
    },
    {
      id: "order-005",
      orderCode: "MT25A002E",
      orderType: "Terjadwal",
      orderStatus: "PERLU_KONFIRMASI_SIAP",
      shipper: {
        id: "shipper-004",
        name: "Shipper Empat",
        contactNumber: "081234567893",
      },
      transporter: {
        id: "transporter-004",
        name: "Transporter Empat",
        contactNumber: "087654321095",
      },
      loadingSchedule: {
        startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      pickupLocations: [
        { fullAddress: "Gresik, Jawa Timur, 61111", sequence: 1 },
      ],
      dropoffLocations: [
        { fullAddress: "Lamongan, Jawa Timur, 62211", sequence: 1 },
      ],
      truckType: { name: "Fuso" },
      carrierTruck: { name: "Flatbed" },
      truckCount: 1,
      totalWeight: 8000,
      weightUnit: "kg",
      cargoItems: [{ name: "Bahan Bangunan" }],
      sosStatus: { hasSos: false, sosCount: 0 },
    },
    {
      id: "order-001",
      orderCode: "MT25A002F",
      orderType: "Instan",
      orderStatus: "MENUNGGU_KONFIRMASI",
      shipper: {
        id: "shipper-002",
        name: "Fernando Torres",
        contactNumber: "081234567891",
      },
      transporter: {
        id: "transporter-001",
        name: "PT Siba Surya",
        contactNumber: "087654321098",
      },
      loadingSchedule: { startDate: new Date().toISOString() },
      pickupLocations: [
        { fullAddress: "Surabaya, Jawa Timur, 60111", sequence: 1 },
      ],
      dropoffLocations: [
        { fullAddress: "Pasuruan, Jawa Timur, 67111", sequence: 1 },
      ],
      truckType: { name: "Colt Diesel Double" },
      carrierTruck: { name: "Bak Terbuka" },
      truckCount: 1,
      totalWeight: 1000,
      weightUnit: "kg",
      cargoItems: [{ name: "Besi" }],
      sosStatus: { hasSos: false, sosCount: 0 },
    },
  ],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 6,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

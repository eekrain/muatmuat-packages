import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockActiveOrders = false;

// Get dynamic dates for testing different conditions
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
const threeDaysLater = new Date();
threeDaysLater.setDate(today.getDate() + 3);
const sevenDaysLater = new Date();
sevenDaysLater.setDate(today.getDate() + 7);

// Format date to ISO string with timezone
const formatDateForAPI = (date, hours = 8) => {
  const d = new Date(date);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString().replace("Z", "+07:00");
};

const apiResultActiveOrders = {
  Message: {
    Code: 200,
    Text: "Data pesanan aktif berhasil diambil",
  },
  Data: {
    orders: [
      // WAITING_CONFIRMATION_SHIPPER status
      {
        id: "dcdaf886-56d6-4d84-89d6-a21ec18d0bc1",
        orderCode: "MT25WAITCONF01",
        orderType: "SCHEDULED",
        loadTimeStart: formatDateForAPI(tomorrow, 8),
        loadTimeEnd: formatDateForAPI(tomorrow, 10),
        orderStatus: "WAITING_CONFIRMATION_SHIPPER",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Dukuh Kupang, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Solo, Kota Surakarta",
            city: "Kota Surakarta",
            province: "Jawa Tengah",
          },
        ],
        truckType: { id: "uuid", name: "Tronton" },
        carrierTruck: { id: "uuid", name: "Wing Box" },
        truckCount: 2,
        totalWeight: 14,
        weightUnit: "ton",
        assignedVehicles: [
          {
            id: "vehicle1",
            fleetId: "fleet1",
            licensePlate: "L 1234 AB",
            driverName: "Hendra Wijaya",
            driverPhone: "081234567111",
            driverStatus: "WAITING_CONFIRMATION",
          },
          {
            id: "vehicle2",
            fleetId: "fleet2",
            licensePlate: "L 5678 CD",
            driverName: "Irfan Maulana",
            driverPhone: "081234567222",
            driverStatus: "WAITING_CONFIRMATION",
          },
        ],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },

      // CONFIRMED status
      {
        id: "uuid2",
        orderCode: "MT25CONF02",
        orderType: "SCHEDULED",
        loadTimeStart: formatDateForAPI(tomorrow, 9),
        loadTimeEnd: formatDateForAPI(tomorrow, 12),
        orderStatus: "CONFIRMED",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Wonokromo, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Gubeng, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Fuso" },
        carrierTruck: { id: "uuid", name: "Box" },
        truckCount: 1,
        totalWeight: 8.5,
        weightUnit: "ton",
        assignedVehicles: [
          {
            id: "uuid",
            fleetId: "uuid",
            licensePlate: "L 9876 EF",
            driverName: "Budi Santoso",
            driverPhone: "081234567890",
            driverStatus: "CONFIRMED",
          },
        ],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },

      // NEED_ASSIGN_FLEET status
      {
        id: "uuid3",
        orderCode: "MT25ASSIGN03",
        orderType: "INSTANT",
        loadTimeStart: formatDateForAPI(tomorrow, 14),
        loadTimeEnd: formatDateForAPI(tomorrow, 18),
        orderStatus: "NEED_ASSIGN_FLEET",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Bubutan, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Lamongan, Kab. Lamongan",
            city: "Kab. Lamongan",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Colt Diesel Engkel" },
        carrierTruck: { id: "uuid", name: "Bak Terbuka" },
        truckCount: 2,
        totalWeight: 4,
        weightUnit: "ton",
        assignedVehicles: [],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },

      // NEED_CONFIRMATION_READY status
      {
        id: "uuid4",
        orderCode: "MT25READY04",
        orderType: "SCHEDULED",
        orderStatus: "NEED_CONFIRMATION_READY",
        loadTimeStart: formatDateForAPI(sevenDaysLater, 10),
        loadTimeEnd: formatDateForAPI(sevenDaysLater, 14),
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Sukolilo, Kota Surabaya",
            city: "Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Mojokerto, Kab. Mojokerto",
            city: "Mojokerto",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Fuso" },
        carrierTruck: { id: "uuid", name: "Wing Box" },
        truckCount: 3,
        totalWeight: 15,
        weightUnit: "ton",
        cargos: [
          "Peralatan Rumah Tangga",
          "Besi Baja",
          "Batu Bata",
          "Karet Mentah",
          "Kerikil",
          "Makanan dan Minuman",
          "Kayu",
          "Bahan Mentah",
        ],
        assignedVehicles: [
          {
            id: "vehicle1",
            fleetId: "fleet1",
            licensePlate: "L 1111 AA",
            driverName: "Noel Gallagher",
            driverPhone: "081234567890",
            driverStatus: "WAITING_LOADING_TIME",
            location: {
              currentLocation: "Surabaya",
              distanceFromPickup: "2,5",
            },
          },
          {
            id: "vehicle2",
            fleetId: "fleet2",
            licensePlate: "L 2222 BB",
            driverName: "Rizky Aditya",
            driverPhone: "081234567891",
            driverStatus: "ON_DUTY",
            location: {
              currentLocation: "Surabaya",
              distanceFromPickup: "5",
            },
          },
          {
            id: "vehicle3",
            fleetId: "fleet3",
            licensePlate: "L 3333 CC",
            driverName: "Dhani Putra",
            driverPhone: "081234567892",
            driverStatus: "READY_FOR_ORDER",
            location: {
              currentLocation: "Surabaya",
              distanceFromPickup: "10",
            },
          },
        ],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },

      // NEED_CHANGE_RESPONSE status
      {
        id: "uuid5",
        orderCode: "MT25CHANGE05",
        orderType: "SCHEDULED",
        loadTimeStart: formatDateForAPI(threeDaysLater, 7),
        loadTimeEnd: formatDateForAPI(threeDaysLater, 11),
        orderStatus: "NEED_CHANGE_RESPONSE",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Dukuh Pakis, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Tuban, Kab. Tuban",
            city: "Kab. Tuban",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Trailer" },
        carrierTruck: { id: "uuid", name: "Lowbed" },
        truckCount: 2,
        totalWeight: 25,
        weightUnit: "ton",
        assignedVehicles: [
          {
            id: "uuid",
            fleetId: "uuid",
            licensePlate: "L 4444 DD",
            driverName: "Eko Prasetyo",
            driverPhone: "081234567893",
            driverStatus: "ASSIGNED",
          },
          {
            id: "uuid",
            fleetId: "uuid",
            licensePlate: "L 4444 DD",
            driverName: "Eko Prasetyo",
            driverPhone: "081234567893",
            driverStatus: "ASSIGNED",
          },
        ],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: true,
      },
      {
        id: "uuid90",
        orderCode: "MT25CHANGE06",
        orderType: "INSTANT",
        loadTimeStart: formatDateForAPI(threeDaysLater, 7),
        loadTimeEnd: formatDateForAPI(threeDaysLater, 11),
        orderStatus: "NEED_CHANGE_RESPONSE",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Dukuh Pakis, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Tuban, Kab. Tuban",
            city: "Kab. Tuban",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Trailer" },
        carrierTruck: { id: "uuid", name: "Lowbed" },
        truckCount: 1,
        totalWeight: 25,
        weightUnit: "ton",
        assignedVehicles: [
          {
            id: "uuid",
            fleetId: "uuid",
            licensePlate: "L 4444 DD",
            driverName: "Eko Prasetyo",
            driverPhone: "081234567893",
            driverStatus: "ASSIGNED",
          },
        ],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: true,
      },

      // SCHEDULED_FLEET status
      {
        id: "uuid6",
        orderCode: "MT25SCHED06",
        orderType: "INSTANT",
        loadTimeStart: formatDateForAPI(threeDaysLater, 10),
        loadTimeEnd: formatDateForAPI(threeDaysLater, 14),
        orderStatus: "SCHEDULED_FLEET",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Sawahan, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Malang, Kab. Malang",
            city: "Kab. Malang",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Trailer" },
        carrierTruck: { id: "uuid", name: "Container" },
        truckCount: 1,
        totalWeight: 20,
        weightUnit: "ton",
        assignedVehicles: [
          {
            id: "uuid",
            fleetId: "uuid",
            licensePlate: "L 4567 CD",
            driverName: "Ahmad Subandi",
            driverPhone: "081234567892",
            driverStatus: "SCHEDULED",
          },
        ],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },

      // LOADING status with 1 unit
      {
        id: "uuid7",
        orderCode: "MT25LOAD07",
        orderType: "SCHEDULED",
        loadTimeStart: formatDateForAPI(today, 14),
        loadTimeEnd: formatDateForAPI(today, 16),
        orderStatus: "LOADING",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Tegalsari, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Klojen, Kab. Pasuruan",
            city: "Kab. Pasuruan",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Colt Diesel Engkel" },
        carrierTruck: { id: "uuid", name: "Box" },
        truckCount: 1, // Single unit - different actions
        totalWeight: 2.5,
        weightUnit: "ton",
        assignedVehicles: [
          {
            id: "uuid",
            fleetId: "uuid",
            licensePlate: "L 5555 EE",
            driverName: "Joko Widodo",
            driverPhone: "081234567894",
            driverStatus: "LOADING",
          },
        ],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },

      // LOADING status with multiple units (>1)
      {
        id: "uuid8",
        orderCode: "MT25LOADM08",
        orderType: "INSTANT",
        loadTimeStart: formatDateForAPI(today, 11),
        loadTimeEnd: formatDateForAPI(today, 13),
        orderStatus: "LOADING",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Jambangan, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Semarang, Kota Semarang",
            city: "Kota Semarang",
            province: "Jawa Tengah",
          },
        ],
        truckType: { id: "uuid", name: "Tronton" },
        carrierTruck: { id: "uuid", name: "Box" },
        truckCount: 4, // Multiple units - different actions
        totalWeight: 28,
        weightUnit: "ton",
        assignedVehicles: [
          {
            id: "vehicle1",
            fleetId: "fleet1",
            licensePlate: "L 5001 AA",
            driverName: "Ferry Gunawan",
            driverPhone: "081234567501",
            driverStatus: "LOADING",
          },
          {
            id: "vehicle2",
            fleetId: "fleet2",
            licensePlate: "L 5002 BB",
            driverName: "Gerry Prakoso",
            driverPhone: "081234567502",
            driverStatus: "LOADING",
          },
          {
            id: "vehicle3",
            fleetId: "fleet3",
            licensePlate: "L 5003 CC",
            driverName: "Harry Santoso",
            driverPhone: "081234567503",
            driverStatus: "LOADING",
          },
          {
            id: "vehicle4",
            fleetId: "fleet4",
            licensePlate: "L 5004 DD",
            driverName: "Irvan Wijaya",
            driverPhone: "081234567504",
            driverStatus: "LOADING",
          },
        ],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },

      // UNLOADING status with 1 unit
      {
        id: "uuid9",
        orderCode: "MT25UNLOAD09",
        orderType: "SCHEDULED",
        loadTimeStart: formatDateForAPI(today, 12),
        loadTimeEnd: formatDateForAPI(today, 14),
        orderStatus: "UNLOADING",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Pakal, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
          {
            id: "uuid",
            sequence: 2,
            fullAddress: "Jalan Raya No. 123, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Yogyakarta, Kota Yogyakarta",
            city: "Kota Yogyakarta",
            province: "D.I. Yogyakarta",
          },
          {
            id: "uuid",
            sequence: 2,
            fullAddress: "Jalan Raya No. 456, Kota Yogyakarta",
            city: "Kota Yogyakarta",
            province: "D.I. Yogyakarta",
          },
        ],
        truckType: { id: "uuid", name: "Colt Diesel Engkel" },
        carrierTruck: { id: "uuid", name: "Box" },
        truckCount: 1, // Single unit - different actions
        totalWeight: 3.5,
        weightUnit: "ton",
        assignedVehicles: [
          {
            id: "vehicle1",
            fleetId: "fleet1",
            licensePlate: "L 9999 XY",
            driverName: "Joko Susanto",
            driverPhone: "081234567999",
            driverStatus: "UNLOADING",
          },
        ],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },

      // UNLOADING status with multiple units (>1)
      {
        id: "uuid10",
        orderCode: "MT25UNLOAD10",
        orderType: "SCHEDULED",
        loadTimeStart: formatDateForAPI(today, 6),
        loadTimeEnd: formatDateForAPI(today, 8),
        orderStatus: "UNLOADING",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Gayungan, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Kuta, Kab. Badung",
            city: "Kab. Badung",
            province: "Bali",
          },
        ],
        truckType: { id: "uuid", name: "Fuso" },
        carrierTruck: { id: "uuid", name: "Box" },
        truckCount: 2, // Multiple units - different actions
        totalWeight: 12,
        weightUnit: "ton",
        assignedVehicles: [
          {
            id: "vehicle1",
            fleetId: "fleet1",
            licensePlate: "L 7777 GH",
            driverName: "Dedi Kurniawan",
            driverPhone: "081234567777",
            driverStatus: "UNLOADING",
          },
          {
            id: "vehicle2",
            fleetId: "fleet2",
            licensePlate: "L 7778 IJ",
            driverName: "Eko Prasetyo",
            driverPhone: "081234567778",
            driverStatus: "UNLOADING",
          },
        ],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },

      // UNLOADING status with SOS (multiple units)
      {
        id: "uuid11",
        orderCode: "MT25UNLOADSOS11",
        orderType: "INSTANT",
        loadTimeStart: formatDateForAPI(today, 8),
        loadTimeEnd: formatDateForAPI(today, 10),
        orderStatus: "UNLOADING",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Tandes, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Denpasar, Kota Denpasar",
            city: "Kota Denpasar",
            province: "Bali",
          },
        ],
        truckType: { id: "uuid", name: "Tronton" },
        carrierTruck: { id: "uuid", name: "Wing Box" },
        truckCount: 3, // Multiple units with SOS
        totalWeight: 18,
        weightUnit: "ton",
        assignedVehicles: [
          {
            id: "vehicle1",
            fleetId: "fleet1",
            licensePlate: "L 8901 AB",
            driverName: "Andi Pratama",
            driverPhone: "081234567890",
            driverStatus: "UNLOADING",
            hasSos: true,
            sosType: "BREAKDOWN",
            sosMessage: "Ban pecah, butuh bantuan segera",
          },
          {
            id: "vehicle2",
            fleetId: "fleet2",
            licensePlate: "L 8902 CD",
            driverName: "Budi Setiawan",
            driverPhone: "081234567891",
            driverStatus: "UNLOADING",
            hasSos: false,
          },
          {
            id: "vehicle3",
            fleetId: "fleet3",
            licensePlate: "L 8903 EF",
            driverName: "Charlie Wijaya",
            driverPhone: "081234567892",
            driverStatus: "UNLOADING",
            hasSos: true,
            sosType: "ACCIDENT",
            sosMessage: "Kecelakaan ringan, driver aman",
          },
        ],
        sosStatus: {
          hasSos: true,
          sosCount: 2,
          sosUnits: ["L 8901 AB", "L 8903 EF"],
          sosDetails: [
            {
              licensePlate: "L 8901 AB",
              driverName: "Andi Pratama",
              sosType: "BREAKDOWN",
              sosMessage: "Ban pecah, butuh bantuan segera",
              reportedAt: formatDateForAPI(today, 9),
            },
            {
              licensePlate: "L 8903 EF",
              driverName: "Charlie Wijaya",
              sosType: "ACCIDENT",
              sosMessage: "Kecelakaan ringan, driver aman",
              reportedAt: formatDateForAPI(today, 9, 30),
            },
          ],
        },
        hasChangeRequest: false,
      },

      // PREPARE_DOCUMENT status
      {
        id: "uuid12",
        orderCode: "MT25PREPDOC12",
        orderType: "INSTANT",
        loadTimeStart: formatDateForAPI(today, 17),
        loadTimeEnd: formatDateForAPI(today, 19),
        orderStatus: "PREPARE_DOCUMENT",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Simokerto, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Madiun, Kab. Madiun",
            city: "Kab. Madiun",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Colt Diesel Double" },
        carrierTruck: { id: "uuid", name: "Box" },
        truckCount: 1,
        totalWeight: 6,
        weightUnit: "ton",
        assignedVehicles: [
          {
            id: "uuid",
            fleetId: "uuid",
            licensePlate: "L 3456 IJ",
            driverName: "Siti Nurhaliza",
            driverPhone: "081234567894",
            driverStatus: "DOCUMENT_PREPARATION",
          },
        ],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },

      // DOCUMENT_DELIVERY status
      {
        id: "uuid13",
        orderCode: "MT25DOCDEL13",
        orderType: "SCHEDULED",
        loadTimeStart: formatDateForAPI(tomorrow, 20),
        loadTimeEnd: formatDateForAPI(tomorrow, 22),
        orderStatus: "DOCUMENT_DELIVERY",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Tambaksari, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Nganjuk, Kab. Nganjuk",
            city: "Kab. Nganjuk",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Fuso" },
        carrierTruck: { id: "uuid", name: "Wing Box" },
        truckCount: 2,
        totalWeight: 11,
        weightUnit: "ton",
        assignedVehicles: [
          {
            id: "uuid",
            fleetId: "uuid",
            licensePlate: "L 7890 KL",
            driverName: "Agus Prasetyo",
            driverPhone: "081234567895",
            driverStatus: "DOCUMENT_DELIVERY",
          },
          {
            id: "uuid2",
            fleetId: "uuid2",
            licensePlate: "L 7891 MN",
            driverName: "Bagus Santoso",
            driverPhone: "081234567896",
            driverStatus: "DOCUMENT_DELIVERY",
          },
          {
            id: "uuid2",
            fleetId: "uuid2",
            licensePlate: "L 7891 MN",
            driverName: "Bagus Santoso",
            driverPhone: "081234567896",
            driverStatus: "DOCUMENT_DELIVERY",
          },
          {
            id: "uuid2",
            fleetId: "uuid2",
            licensePlate: "L 7891 MN",
            driverName: "Bagus Santoso",
            driverPhone: "081234567896",
            driverStatus: "DOCUMENT_DELIVERY",
          },
          {
            id: "uuid2",
            fleetId: "uuid2",
            licensePlate: "L 7891 MN",
            driverName: "Bagus Santoso",
            driverPhone: "081234567896",
            driverStatus: "DOCUMENT_DELIVERY",
          },
          {
            id: "uuid2",
            fleetId: "uuid2",
            licensePlate: "L 7891 MN",
            driverName: "Bagus Santoso",
            driverPhone: "081234567896",
            driverStatus: "DOCUMENT_DELIVERY",
          },
        ],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 13,
      itemsPerPage: 20,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    availableStatuses: {
      totalNeedChangeResponse: 1,
      totalNeedConfirmationReady: 1,
      totalNeedAssignVehicle: 1,
      NeedChangeResponseOrderIds: ["uuid5"],
    },
  },
  Type: "ACTIVE_ORDERS_LIST",
};

export const fetcherActiveOrders = async (cacheKey) => {
  // Extract query string from cache key
  const queryString = cacheKey.includes("?") ? cacheKey.split("?")[1] : "";
  const url = queryString
    ? `/v1/transporter/orders/list/active?${queryString}`
    : "/v1/transporter/orders/list/active";

  if (isMockActiveOrders) {
    // Parse search parameter from query string
    const params = new URLSearchParams(queryString);
    const searchTerm = params.get("search")?.toLowerCase() || "";
    const statusFilter = params.get("status") || "";
    const hasLocationChange = params.get("hasLocationChange") === "true";

    let filteredOrders = [...apiResultActiveOrders.Data.orders];

    // Apply search filter
    if (searchTerm && searchTerm.length > 2) {
      filteredOrders = filteredOrders.filter((order) => {
        // Search in order code
        if (order.orderCode?.toLowerCase().includes(searchTerm)) return true;

        // Search in driver names
        if (
          order.assignedVehicles?.some((vehicle) =>
            vehicle.driverName?.toLowerCase().includes(searchTerm)
          )
        )
          return true;

        // Search in license plates
        if (
          order.assignedVehicles?.some((vehicle) =>
            vehicle.licensePlate?.toLowerCase().includes(searchTerm)
          )
        )
          return true;

        // Search in locations
        if (
          order.pickupLocations?.some(
            (loc) =>
              loc.fullAddress?.toLowerCase().includes(searchTerm) ||
              loc.city?.toLowerCase().includes(searchTerm)
          )
        )
          return true;

        if (
          order.dropoffLocations?.some(
            (loc) =>
              loc.fullAddress?.toLowerCase().includes(searchTerm) ||
              loc.city?.toLowerCase().includes(searchTerm)
          )
        )
          return true;

        // Search in truck type
        if (order.truckType?.name?.toLowerCase().includes(searchTerm))
          return true;

        return false;
      });
    }

    // Apply status filter
    if (statusFilter) {
      const statusMap = {
        need_change_response: "NEED_CHANGE_RESPONSE",
        need_confirmation_ready: "NEED_CONFIRMATION_READY",
        need_assign_vehicle: "NEED_ASSIGN_FLEET",
      };

      const mappedStatus = statusMap[statusFilter] || statusFilter;
      filteredOrders = filteredOrders.filter(
        (order) => order.orderStatus === mappedStatus
      );
    }

    // Apply location change filter
    if (hasLocationChange) {
      filteredOrders = filteredOrders.filter(
        (order) => order.hasChangeRequest === true
      );
    }

    return {
      ...apiResultActiveOrders.Data,
      orders: filteredOrders,
      pagination: {
        ...apiResultActiveOrders.Data.pagination,
        totalItems: filteredOrders.length,
      },
    };
  }

  const result = await fetcherMuatrans.get(url);
  return result?.data?.Data || {};
};

export const useGetActiveOrders = (params = {}) => {
  // Filter out null/undefined values before creating URLSearchParams
  const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});

  const queryParams = new URLSearchParams(filteredParams).toString();
  const cacheKey = `active-orders${queryParams ? `?${queryParams}` : ""}`;

  return useSWR(cacheKey, fetcherActiveOrders);
};

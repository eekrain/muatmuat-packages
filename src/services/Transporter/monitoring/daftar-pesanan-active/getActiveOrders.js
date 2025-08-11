import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockActiveOrders = true;

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
      // Primary status variants
      {
        id: "uuid1",
        orderCode: "MT25PREP01",
        orderType: "SCHEDULED",
        loadTimeStart: formatDateForAPI(today, 14),
        loadTimeEnd: formatDateForAPI(today, 16),
        orderStatus: "PREPARE_FLEET",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Tegalsari, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
          {
            id: "uuid2",
            sequence: 2,
            fullAddress: "Wonokromo, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
          {
            id: "uuid3",
            sequence: 3,
            fullAddress: "Gubeng, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
          {
            id: "uuid4",
            sequence: 4,
            fullAddress: "Genteng, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
          {
            id: "uuid5",
            sequence: 5,
            fullAddress: "Sawahan, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
          {
            id: "uuid6",
            sequence: 6,
            fullAddress: "Rungkut, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
          {
            id: "uuid7",
            sequence: 7,
            fullAddress: "Sukolilo, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
          {
            id: "uuid8",
            sequence: 8,
            fullAddress: "Mulyorejo, Kota Surabaya",
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
          {
            id: "uuid2",
            sequence: 2,
            fullAddress: "Sidoarjo, Kab. Sidoarjo",
            city: "Kab. Sidoarjo",
            province: "Jawa Timur",
          },
          {
            id: "uuid3",
            sequence: 3,
            fullAddress: "Gresik, Kab. Gresik",
            city: "Kab. Gresik",
            province: "Jawa Timur",
          },
          {
            id: "uuid4",
            sequence: 4,
            fullAddress: "Mojokerto, Kab. Mojokerto",
            city: "Kab. Mojokerto",
            province: "Jawa Timur",
          },
          {
            id: "uuid5",
            sequence: 5,
            fullAddress: "Malang, Kab. Malang",
            city: "Kab. Malang",
            province: "Jawa Timur",
          },
          {
            id: "uuid6",
            sequence: 6,
            fullAddress: "Blitar, Kab. Blitar",
            city: "Kab. Blitar",
            province: "Jawa Timur",
          },
          {
            id: "uuid7",
            sequence: 7,
            fullAddress: "Kediri, Kab. Kediri",
            city: "Kab. Kediri",
            province: "Jawa Timur",
          },
          {
            id: "uuid8",
            sequence: 8,
            fullAddress: "Jombang, Kab. Jombang",
            city: "Kab. Jombang",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Colt Diesel Engkel" },
        carrierTruck: { id: "uuid", name: "Box" },
        truckCount: 1,
        totalWeight: 2.5,
        weightUnit: "ton",
        assignedVehicles: [],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },
      {
        id: "uuid2",
        orderCode: "MT25SCHED02",
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
          {
            id: "uuid2",
            sequence: 2,
            fullAddress: "Tambaksari, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Tronton" },
        carrierTruck: { id: "uuid", name: "Flatbed" },
        truckCount: 2,
        totalWeight: 8.5,
        weightUnit: "ton",
        assignedVehicles: [],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: true,
      },
      {
        id: "uuid3",
        orderCode: "MT25CONF03",
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
            driverStatus: "AVAILABLE",
          },
        ],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },

      // Warning status variants
      {
        id: "uuid6",
        orderCode: "MT25PAY06",
        orderType: "SCHEDULED",
        loadTimeStart: formatDateForAPI(sevenDaysLater, 10),
        loadTimeEnd: formatDateForAPI(sevenDaysLater, 14),
        orderStatus: "NEED_ASSIGN_FLEET",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Sukolilo, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Mojokerto, Kab. Mojokerto",
            city: "Kab. Mojokerto",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Fuso" },
        carrierTruck: { id: "uuid", name: "Wing Box" },
        truckCount: 1,
        totalWeight: 5,
        weightUnit: "ton",
        assignedVehicles: [],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },
      {
        id: "uuid7",
        orderCode: "MT25PAY207",
        orderType: "INSTANT",
        loadTimeStart: formatDateForAPI(tomorrow, 14),
        loadTimeEnd: formatDateForAPI(tomorrow, 18),
        orderStatus: "WAITING_PAYMENT_2",
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
      {
        id: "uuid8",
        orderCode: "MT25REPAY08",
        orderType: "SCHEDULED",
        loadTimeStart: formatDateForAPI(threeDaysLater, 7),
        loadTimeEnd: formatDateForAPI(threeDaysLater, 11),
        orderStatus: "WAITING_REPAYMENT_1",
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
        assignedVehicles: [],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },
      {
        id: "uuid9",
        orderCode: "MT25CHANGE09",
        orderType: "INSTANT",
        loadTimeStart: formatDateForAPI(today, 11),
        loadTimeEnd: formatDateForAPI(today, 13),
        orderStatus: "WAITING_CONFIRMATION_CHANGES",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Lakarsantri, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Bangkalan, Kab. Bangkalan",
            city: "Kab. Bangkalan",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Colt Diesel Double" },
        carrierTruck: { id: "uuid", name: "Box" },
        truckCount: 1,
        totalWeight: 4.5,
        weightUnit: "ton",
        assignedVehicles: [],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: true,
      },

      // Success status variants
      {
        id: "uuid10",
        orderCode: "MT25COMP10",
        orderType: "SCHEDULED",
        loadTimeStart: formatDateForAPI(today, 5),
        loadTimeEnd: formatDateForAPI(today, 7),
        orderStatus: "COMPLETED",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Karang Pilang, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Kediri, Kab. Kediri",
            city: "Kab. Kediri",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Tronton" },
        carrierTruck: { id: "uuid", name: "Wing Box" },
        truckCount: 1,
        totalWeight: 12,
        weightUnit: "ton",
        assignedVehicles: [
          {
            id: "uuid",
            fleetId: "uuid",
            licensePlate: "L 9012 GH",
            driverName: "Budi Santoso",
            driverPhone: "081234567893",
            driverStatus: "COMPLETED",
          },
        ],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },
      {
        id: "uuid11",
        orderCode: "MT25CONFCH11",
        orderType: "INSTANT",
        loadTimeStart: formatDateForAPI(tomorrow, 15),
        loadTimeEnd: formatDateForAPI(tomorrow, 19),
        orderStatus: "CONFIRMED_CHANGES",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Benowo, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Jombang, Kab. Jombang",
            city: "Kab. Jombang",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Fuso" },
        carrierTruck: { id: "uuid", name: "Box" },
        truckCount: 1,
        totalWeight: 7.5,
        weightUnit: "ton",
        assignedVehicles: [],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: true,
      },

      // Error status variants
      {
        id: "uuid12",
        orderCode: "MT25CANSYS12",
        orderType: "SCHEDULED",
        loadTimeStart: formatDateForAPI(sevenDaysLater, 12),
        loadTimeEnd: formatDateForAPI(sevenDaysLater, 16),
        orderStatus: "CANCELED_BY_SYSTEM",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Asemrowo, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Blitar, Kab. Blitar",
            city: "Kab. Blitar",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Colt Diesel Engkel" },
        carrierTruck: { id: "uuid", name: "Box" },
        truckCount: 1,
        totalWeight: 2,
        weightUnit: "ton",
        assignedVehicles: [],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },
      {
        id: "uuid13",
        orderCode: "MT25CANSHIP13",
        orderType: "INSTANT",
        loadTimeStart: formatDateForAPI(tomorrow, 6),
        loadTimeEnd: formatDateForAPI(tomorrow, 8),
        orderStatus: "CANCELED_BY_SHIPPER",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Pabean Cantian, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Probolinggo, Kab. Probolinggo",
            city: "Kab. Probolinggo",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Tronton" },
        carrierTruck: { id: "uuid", name: "Flatbed" },
        truckCount: 1,
        totalWeight: 15,
        weightUnit: "ton",
        assignedVehicles: [],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },
      {
        id: "uuid14",
        orderCode: "MT25CANTRANS14",
        orderType: "SCHEDULED",
        loadTimeStart: formatDateForAPI(threeDaysLater, 16),
        loadTimeEnd: formatDateForAPI(threeDaysLater, 20),
        orderStatus: "CANCELED_BY_TRANSPORTER",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Semampir, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Lumajang, Kab. Lumajang",
            city: "Kab. Lumajang",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Trailer" },
        carrierTruck: { id: "uuid", name: "Container" },
        truckCount: 1,
        totalWeight: 30,
        weightUnit: "ton",
        assignedVehicles: [],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },

      // Additional primary status variants
      {
        id: "uuid15",
        orderCode: "MT25PREPDOC15",
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
      {
        id: "uuid16",
        orderCode: "MT25DOCDEL16",
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
        ],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },
      {
        id: "uuid17",
        orderCode: "MT25PREPFL17",
        orderType: "INSTANT",
        loadTimeStart: formatDateForAPI(threeDaysLater, 5),
        loadTimeEnd: formatDateForAPI(threeDaysLater, 7),
        orderStatus: "PREPARE_FLEET_CHANGES",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Kenjeran, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Tulungagung, Kab. Tulungagung",
            city: "Kab. Tulungagung",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Trailer" },
        carrierTruck: { id: "uuid", name: "Lowbed" },
        truckCount: 1,
        totalWeight: 35,
        weightUnit: "ton",
        assignedVehicles: [],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: true,
      },
      {
        id: "uuid18",
        orderCode: "MT25FLEET18",
        orderType: "SCHEDULED",
        loadTimeStart: formatDateForAPI(sevenDaysLater, 9),
        loadTimeEnd: formatDateForAPI(sevenDaysLater, 11),
        orderStatus: "FLEET_CHANGE",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Bulak, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Pacitan, Kab. Pacitan",
            city: "Kab. Pacitan",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Tronton" },
        carrierTruck: { id: "uuid", name: "Box" },
        truckCount: 1,
        totalWeight: 9,
        weightUnit: "ton",
        assignedVehicles: [],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: true,
      },

      // Additional warning payment statuses
      {
        id: "uuid19",
        orderCode: "MT25PAY319",
        orderType: "INSTANT",
        loadTimeStart: formatDateForAPI(today, 13),
        loadTimeEnd: formatDateForAPI(today, 15),
        orderStatus: "WAITING_PAYMENT_3",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Krembangan, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Ponorogo, Kab. Ponorogo",
            city: "Kab. Ponorogo",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Colt Diesel Engkel" },
        carrierTruck: { id: "uuid", name: "Bak Terbuka" },
        truckCount: 1,
        totalWeight: 1.5,
        weightUnit: "ton",
        assignedVehicles: [],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },
      {
        id: "uuid20",
        orderCode: "MT25PAY420",
        orderType: "SCHEDULED",
        loadTimeStart: formatDateForAPI(tomorrow, 16),
        loadTimeEnd: formatDateForAPI(tomorrow, 18),
        orderStatus: "WAITING_PAYMENT_4",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Mulyorejo, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Magetan, Kab. Magetan",
            city: "Kab. Magetan",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Fuso" },
        carrierTruck: { id: "uuid", name: "Box" },
        truckCount: 1,
        totalWeight: 8,
        weightUnit: "ton",
        assignedVehicles: [],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },
      {
        id: "uuid21",
        orderCode: "MT25REPAY221",
        orderType: "INSTANT",
        loadTimeStart: formatDateForAPI(threeDaysLater, 18),
        loadTimeEnd: formatDateForAPI(threeDaysLater, 20),
        orderStatus: "WAITING_REPAYMENT_2",
        pickupLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Sukomanunggal, Kota Surabaya",
            city: "Kota Surabaya",
            province: "Jawa Timur",
          },
        ],
        dropoffLocations: [
          {
            id: "uuid",
            sequence: 1,
            fullAddress: "Banyuwangi, Kab. Banyuwangi",
            city: "Kab. Banyuwangi",
            province: "Jawa Timur",
          },
        ],
        truckType: { id: "uuid", name: "Trailer" },
        carrierTruck: { id: "uuid", name: "Container" },
        truckCount: 1,
        totalWeight: 40,
        weightUnit: "ton",
        assignedVehicles: [],
        sosStatus: { hasSos: false, sosCount: 0, sosUnits: [] },
        hasChangeRequest: false,
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 5,
      totalItems: 45,
      itemsPerPage: 10,
      hasNextPage: true,
      hasPreviousPage: false,
    },
    availableStatuses: {
      hasNeedChangeResponse: true,
      hasNeedConfirmationReady: true,
      hasNeedAssignVehicle: true,
      totalNeedChangeResponse: 5,
      totalNeedConfirmationReady: 100,
      totalNeedAssignVehicle: 3,
      NeedChangeResponseOrderIds: [],
    },
  },
  Type: "ACTIVE_ORDERS_LIST",
};

export const fetcherActiveOrders = async (cacheKey) => {
  // Extract query string from cache key
  const queryString = cacheKey.includes("?") ? cacheKey.split("?")[1] : "";
  const url = queryString
    ? `/v1/active-orders?${queryString}`
    : "/v1/active-orders";

  if (isMockActiveOrders) {
    return apiResultActiveOrders.Data;
  }

  const result = await fetcherMuatrans.get(url);
  return result?.data?.Data || {};
};

export const useGetActiveOrders = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const cacheKey = `active-orders${queryParams ? `?${queryParams}` : ""}`;

  return useSWR(cacheKey, fetcherActiveOrders);
};

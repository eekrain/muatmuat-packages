import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Data agenda berhasil dimuat",
    },
    Data: {
      schedules: [
        {
          licensePlate: "B1234ABC",
          truckType: "CDD - box",
          driverName: "John Doe",
          driverPhone: "08123456789",
          driverEmail: "john.doe@example.com",
          schedule: [
            {
              id: "uuid-1",
              orderID: "order-123",
              fleetID: "fleet-456",
              driverID: "driver-789",
              scheduleDate: "2025-08-24",
              scheduleEndDate: "2025-08-28",
              additionalUnloadTimeStart: "2025-08-29",
              additionalUnloadTimeEnd: "2025-08-29",
              scheduledStartTime: "2025-08-24T08:00:00Z",
              scheduledEndTime: "2025-08-24T17:00:00Z",
              agendaStatus: "BERTUGAS",
              position: 0,
              scheduled: 2,
              additional: 1,
              hasSosIssue: false,
              isConflicted: false,
              scheduleConflictID: "conflict-123",
              estimation: {
                currentLocation: "Jakarta",
                nextDistance: 10,
                nextTime: 30,
              },
              firstDestinationName: "Surabaya, Kec. Pabean",
              estimatedTotalDistanceKm: 121.5,
              lastDestinationName: "Bali, Kec. Denpasar",
              driverName: "John Doe",
              licensePlate: "B1234ABC",
              truckType: "Box",
            },
          ],
        },
        {
          licensePlate: "B5678DEF",
          truckType: "Tronton - Box",
          driverName: "Jane Smith",
          driverPhone: "08123456790",
          driverEmail: "jane.smith@example.com",
          schedule: [
            {
              id: "uuid-2",
              orderID: "order-124",
              fleetID: "fleet-457",
              driverID: "driver-790",
              scheduleDate: "2025-08-25",
              scheduleEndDate: "2025-08-29",
              additionalUnloadTimeStart: "2025-08-30",
              additionalUnloadTimeEnd: "2025-08-30",
              scheduledStartTime: "2025-08-25T09:00:00Z",
              scheduledEndTime: "2025-08-25T18:00:00Z",
              agendaStatus: "DIJADWALKAN",
              position: 1,
              scheduled: 1,
              additional: 0,
              hasSosIssue: false,
              isConflicted: false,
              scheduleConflictID: null,
              estimation: {
                currentLocation: "Bandung",
                nextDistance: 15,
                nextTime: 45,
              },
              firstDestinationName: "Semarang, Kec. Semarang Tengah",
              estimatedTotalDistanceKm: 95.2,
              lastDestinationName: "Yogyakarta, Kec. Gondokusuman",
              driverName: "Jane Smith",
              licensePlate: "B5678DEF",
              truckType: "Tronton",
            },
          ],
        },
        {
          licensePlate: "B9999XYZ",
          truckType: "Pickup - Box",
          driverName: "Rudi Santoso",
          driverPhone: "08123456791",
          driverEmail: "rudi.santoso@example.com",
          schedule: [
            {
              id: "uuid-3",
              orderID: "order-125",
              fleetID: "fleet-458",
              driverID: "driver-791",
              scheduleDate: "2025-08-26",
              scheduleEndDate: "2025-08-30",
              additionalUnloadTimeStart: "2025-08-31",
              additionalUnloadTimeEnd: "2025-08-31",
              scheduledStartTime: "2025-08-26T07:00:00Z",
              scheduledEndTime: "2025-08-26T16:00:00Z",
              agendaStatus: "MENUNGGU_JAM_MUAT",
              position: 2,
              scheduled: 1,
              additional: 0,
              hasSosIssue: false,
              isConflicted: false,
              scheduleConflictID: null,
              estimation: {
                currentLocation: "Surabaya",
                nextDistance: 20,
                nextTime: 60,
              },
              firstDestinationName: "Malang, Kec. Klojen",
              estimatedTotalDistanceKm: 80.5,
              lastDestinationName: "Probolinggo, Kec. Wonoasih",
              driverName: "Rudi Santoso",
              licensePlate: "B9999XYZ",
              truckType: "Pickup",
            },
          ],
        },
        {
          licensePlate: "B7777GHI",
          truckType: "Colt Diesel Double - Box",
          driverName: "Ahmad Rahman",
          driverPhone: "08123456792",
          driverEmail: "ahmad.rahman@example.com",
          schedule: [
            {
              id: "uuid-4",
              orderID: "order-126",
              fleetID: "fleet-459",
              driverID: "driver-792",
              scheduleDate: "2025-08-27",
              scheduleEndDate: "2025-08-31",
              additionalUnloadTimeStart: "2025-09-01",
              additionalUnloadTimeEnd: "2025-09-01",
              scheduledStartTime: "2025-08-27T06:00:00Z",
              scheduledEndTime: "2025-08-27T15:00:00Z",
              agendaStatus: "PENGIRIMAN_SELESAI",
              position: 3,
              scheduled: 1,
              additional: 0,
              hasSosIssue: false,
              isConflicted: false,
              scheduleConflictID: null,
              estimation: {
                currentLocation: "Medan",
                nextDistance: 25,
                nextTime: 75,
              },
              firstDestinationName: "Pekanbaru, Kec. Senapelan",
              estimatedTotalDistanceKm: 150.3,
              lastDestinationName: "Jambi, Kec. Telanaipura",
              driverName: "Ahmad Rahman",
              licensePlate: "B7777GHI",
              truckType: "Colt Diesel Double",
            },
          ],
        },
        {
          licensePlate: "B5555JKL",
          truckType: "Colt Diesel Engkel - Engkel",
          driverName: "Budi Prasetyo",
          driverPhone: "08123456793",
          driverEmail: "budi.prasetyo@example.com",
          schedule: [
            {
              id: "uuid-5",
              orderID: "order-127",
              fleetID: "fleet-460",
              driverID: "driver-793",
              scheduleDate: "2025-08-28",
              scheduleEndDate: "2025-09-01",
              additionalUnloadTimeStart: "2025-09-02",
              additionalUnloadTimeEnd: "2025-09-02",
              scheduledStartTime: "2025-08-28T08:00:00Z",
              scheduledEndTime: "2025-08-28T17:00:00Z",
              agendaStatus: "NON_AKTIF",
              position: 4,
              scheduled: 1,
              additional: 0,
              hasSosIssue: false,
              isConflicted: false,
              scheduleConflictID: null,
              estimation: {
                currentLocation: "Semarang",
                nextDistance: 30,
                nextTime: 90,
              },
              firstDestinationName: "Solo, Kec. Laweyan",
              estimatedTotalDistanceKm: 120.8,
              lastDestinationName: "Magelang, Kec. Magelang Tengah",
              driverName: "Budi Prasetyo",
              licensePlate: "B5555JKL",
              truckType: "Colt Diesel Engkel",
            },
          ],
        },
        {
          licensePlate: "B4444MNO",
          truckType: "CDD - box",
          driverName: "Siti Nurhaliza",
          driverPhone: "08123456794",
          driverEmail: "siti.nurhaliza@example.com",
          schedule: [
            {
              id: "uuid-6",
              orderID: "order-128",
              fleetID: "fleet-461",
              driverID: "driver-794",
              scheduleDate: "2025-08-24",
              scheduleEndDate: "2025-08-28",
              additionalUnloadTimeStart: "2025-08-29",
              additionalUnloadTimeEnd: "2025-08-29",
              scheduledStartTime: "2025-08-24T07:00:00Z",
              scheduledEndTime: "2025-08-24T16:00:00Z",
              agendaStatus: "BERTUGAS",
              position: 5,
              scheduled: 1,
              additional: 0,
              hasSosIssue: false,
              isConflicted: false,
              scheduleConflictID: null,
              estimation: {
                currentLocation: "Makassar",
                nextDistance: 35,
                nextTime: 105,
              },
              firstDestinationName: "Parepare, Kec. Soreang",
              estimatedTotalDistanceKm: 180.2,
              lastDestinationName: "Palopo, Kec. Wara",
              driverName: "Siti Nurhaliza",
              licensePlate: "B4444MNO",
              truckType: "CDD - box",
            },
          ],
        },
        {
          licensePlate: "B3333PQR",
          truckType: "Tronton - Box",
          driverName: "Ahmad Hidayat",
          driverPhone: "08123456795",
          driverEmail: "ahmad.hidayat@example.com",
          schedule: [
            {
              id: "uuid-7",
              orderID: "order-129",
              fleetID: "fleet-462",
              driverID: "driver-795",
              scheduleDate: "2025-08-25",
              scheduleEndDate: "2025-08-29",
              additionalUnloadTimeStart: "2025-08-30",
              additionalUnloadTimeEnd: "2025-08-30",
              scheduledStartTime: "2025-08-25T06:00:00Z",
              scheduledEndTime: "2025-08-25T15:00:00Z",
              agendaStatus: "DIJADWALKAN",
              position: 6,
              scheduled: 1,
              additional: 0,
              hasSosIssue: false,
              isConflicted: false,
              scheduleConflictID: null,
              estimation: {
                currentLocation: "Balikpapan",
                nextDistance: 40,
                nextTime: 120,
              },
              firstDestinationName: "Samarinda, Kec. Samarinda Ulu",
              estimatedTotalDistanceKm: 200.5,
              lastDestinationName: "Bontang, Kec. Bontang Utara",
              driverName: "Ahmad Hidayat",
              licensePlate: "B3333PQR",
              truckType: "Tronton - Box",
            },
          ],
        },
        {
          licensePlate: "B2222STU",
          truckType: "Pickup - Box",
          driverName: "Dewi Sartika",
          driverPhone: "08123456796",
          driverEmail: "dewi.sartika@example.com",
          schedule: [
            {
              id: "uuid-8",
              orderID: "order-130",
              fleetID: "fleet-463",
              driverID: "driver-796",
              scheduleDate: "2025-08-26",
              scheduleEndDate: "2025-08-30",
              additionalUnloadTimeStart: "2025-08-31",
              additionalUnloadTimeEnd: "2025-08-31",
              scheduledStartTime: "2025-08-26T08:00:00Z",
              scheduledEndTime: "2025-08-26T17:00:00Z",
              agendaStatus: "MENUNGGU_JAM_MUAT",
              position: 7,
              scheduled: 1,
              additional: 0,
              hasSosIssue: false,
              isConflicted: false,
              scheduleConflictID: null,
              estimation: {
                currentLocation: "Manado",
                nextDistance: 45,
                nextTime: 135,
              },
              firstDestinationName: "Bitung, Kec. Aertembaga",
              estimatedTotalDistanceKm: 95.8,
              lastDestinationName: "Tomohon, Kec. Tomohon Utara",
              driverName: "Dewi Sartika",
              licensePlate: "B2222STU",
              truckType: "Pickup - Box",
            },
          ],
        },
        {
          licensePlate: "B1111VWX",
          truckType: "Colt Diesel Double - Box",
          driverName: "Rizki Pratama",
          driverPhone: "08123456797",
          driverEmail: "rizki.pratama@example.com",
          schedule: [
            {
              id: "uuid-9",
              orderID: "order-131",
              fleetID: "fleet-464",
              driverID: "driver-797",
              scheduleDate: "2025-08-27",
              scheduleEndDate: "2025-08-31",
              additionalUnloadTimeStart: "2025-09-01",
              additionalUnloadTimeEnd: "2025-09-01",
              scheduledStartTime: "2025-08-27T09:00:00Z",
              scheduledEndTime: "2025-08-27T18:00:00Z",
              agendaStatus: "PENGIRIMAN_SELESAI",
              position: 8,
              scheduled: 1,
              additional: 0,
              hasSosIssue: false,
              isConflicted: false,
              scheduleConflictID: null,
              estimation: {
                currentLocation: "Ambon",
                nextDistance: 50,
                nextTime: 150,
              },
              firstDestinationName: "Tual, Kec. Tual",
              estimatedTotalDistanceKm: 250.3,
              lastDestinationName: "Saumlaki, Kec. Tanimbar Selatan",
              driverName: "Rizki Pratama",
              licensePlate: "B1111VWX",
              truckType: "Colt Diesel Double - Box",
            },
          ],
        },
        {
          licensePlate: "B0000SOS",
          truckType: "CDD - box",
          driverName: "Ahmad Kurniawan",
          driverPhone: "08123456798",
          driverEmail: "ahmad.kurniawan@example.com",
          schedule: [
            {
              id: "uuid-10",
              orderID: "order-132",
              fleetID: "fleet-465",
              driverID: "driver-798",
              scheduleDate: "2025-08-25",
              scheduleEndDate: "2025-08-29",
              additionalUnloadTimeStart: "2025-08-30",
              additionalUnloadTimeEnd: "2025-08-30",
              scheduledStartTime: "2025-08-25T10:00:00Z",
              scheduledEndTime: "2025-08-25T19:00:00Z",
              agendaStatus: "BERTUGAS",
              position: 9,
              scheduled: 1,
              additional: 0,
              hasSosIssue: true,
              isConflicted: false,
              scheduleConflictID: null,
              estimation: {
                currentLocation: "Jakarta",
                nextDistance: 5,
                nextTime: 15,
              },
              firstDestinationName: "Bekasi, Kec. Bekasi Utara",
              estimatedTotalDistanceKm: 25.5,
              lastDestinationName: "Karawang, Kec. Karawang Barat",
              driverName: "Ahmad Kurniawan",
              licensePlate: "B0000SOS",
              truckType: "CDD - box",
            },
          ],
        },
        {
          licensePlate: "B9999KONFLIK",
          truckType: "Tronton - Box",
          driverName: "Budi Santoso",
          driverPhone: "08123456799",
          driverEmail: "budi.santoso@example.com",
          schedule: [
            {
              id: "uuid-11",
              orderID: "order-133",
              fleetID: "fleet-466",
              driverID: "driver-799",
              scheduleDate: "2025-08-26",
              scheduleEndDate: "2025-08-30",
              additionalUnloadTimeStart: "2025-08-31",
              additionalUnloadTimeEnd: "2025-08-31",
              scheduledStartTime: "2025-08-26T08:00:00Z",
              scheduledEndTime: "2025-08-26T17:00:00Z",
              agendaStatus: "DIJADWALKAN",
              position: 10,
              scheduled: 2,
              additional: 1,
              hasSosIssue: false,
              isConflicted: true,
              scheduleConflictID: "conflict-456",
              estimation: {
                currentLocation: "Bandung",
                nextDistance: 12,
                nextTime: 35,
              },
              firstDestinationName: "Cimahi, Kec. Cimahi Tengah",
              estimatedTotalDistanceKm: 45.8,
              lastDestinationName: "Tasikmalaya, Kec. Cihideung",
              driverName: "Budi Santoso",
              licensePlate: "B9999KONFLIK",
              truckType: "Tronton - Box",
            },
          ],
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 10,
        itemsPerPage: 10,
      },
      summary: {
        totalArmada: 12,
        totalDriver: 12,
        statusCounts: {
          DIJADWALKAN: 3,
          MENUNGGU_JAM_MUAT: 2,
          BERTUGAS: 3,
          PENGIRIMAN_SELESAI: 2,
          NON_AKTIF: 1,
          SOS: 1,
        },
        countPerDay: [2, 3, 3, 2, 2],
        countConflictedPerDay: [false, false, true, false, false],
      },
      lastUpdated: "2024-04-01T10:30:00Z",
    },
    Type: "GET_AGENDA_SCHEDULES",
  },
};

/**
 * Helper function untuk memfilter data API berdasarkan parameter
 * @param {Object} apiData - Data dari API
 * @param {Object} params - Parameter filtering dan searching
 * @returns {Object} - Data API yang sudah difilter
 */
const applyClientSideFiltering = (apiData, params = {}) => {
  // If no filtering/searching is needed, return original data
  if (!params.search && !params.agendaStatus) {
    console.log("ℹ️ No filtering needed, returning original API data");
    return apiData;
  }

  let filteredSchedules = apiData.schedules || [];

  // Apply search filtering
  if (params.search && params.search.trim().length > 0) {
    const searchTerm = params.search.toLowerCase().trim();
    console.log("🔍 Applying client-side search for:", searchTerm);
    filteredSchedules = filteredSchedules.filter((schedule) => {
      // Search in license plate
      if (
        schedule.licensePlate &&
        schedule.licensePlate.toLowerCase().includes(searchTerm)
      ) {
        console.log("✅ Found in license plate:", schedule.licensePlate);
        return true;
      }
      // Search in driver name
      if (
        schedule.driverName &&
        schedule.driverName.toLowerCase().includes(searchTerm)
      ) {
        console.log("✅ Found in driver name:", schedule.driverName);
        return true;
      }
      // Search in truck type
      if (
        schedule.truckType &&
        schedule.truckType.toLowerCase().includes(searchTerm)
      ) {
        console.log("✅ Found in truck type:", schedule.truckType);
        return true;
      }
      return false;
    });
    console.log(
      "📊 Client-side search results:",
      filteredSchedules.length,
      "items found"
    );
  }

  // Apply status filtering
  if (params.agendaStatus && params.agendaStatus.length > 0) {
    console.log(
      "🔍 Applying client-side status filtering:",
      params.agendaStatus
    );
    filteredSchedules = filteredSchedules.filter((schedule) => {
      const hasMatchingStatus = schedule.schedule.some((item) => {
        const matches = params.agendaStatus.includes(item.agendaStatus);
        if (matches) {
          console.log(
            "✅ Found matching status:",
            item.agendaStatus,
            "for",
            schedule.licensePlate
          );
        }
        return matches;
      });
      if (!hasMatchingStatus) {
        console.log(
          "❌ No matching status for:",
          schedule.licensePlate,
          "Statuses:",
          schedule.schedule.map((s) => s.agendaStatus)
        );
      }
      return hasMatchingStatus;
    });
    console.log(
      "📊 Client-side filter results:",
      filteredSchedules.length,
      "items found"
    );
  }

  return {
    ...apiData,
    schedules: filteredSchedules,
    pagination: {
      ...apiData.pagination,
      totalItems: filteredSchedules.length,
      totalPages: Math.ceil(filteredSchedules.length / (params.limit || 10)),
    },
    summary: {
      ...apiData.summary,
      totalArmada: filteredSchedules.length,
      totalDriver: filteredSchedules.length,
    },
  };
};

/**
 * Helper function untuk memfilter mock data berdasarkan parameter
 * @param {Object} params - Parameter filtering dan searching
 * @returns {Object} - Data mock yang sudah difilter
 */
const getFilteredMockData = (params = {}) => {
  // Simulate API delay
  // await new Promise((resolve) => setTimeout(resolve, 500));

  // Filter mock data based on search parameter
  let filteredSchedules = mockAPIResult.data.Data.schedules;

  if (params.search && params.search.trim().length > 0) {
    const searchTerm = params.search.toLowerCase().trim();
    console.log("🔍 Searching for:", searchTerm);
    filteredSchedules = mockAPIResult.data.Data.schedules.filter((schedule) => {
      // Search in license plate
      if (
        schedule.licensePlate &&
        schedule.licensePlate.toLowerCase().includes(searchTerm)
      ) {
        console.log("✅ Found in license plate:", schedule.licensePlate);
        return true;
      }
      // Search in driver name
      if (
        schedule.driverName &&
        schedule.driverName.toLowerCase().includes(searchTerm)
      ) {
        console.log("✅ Found in driver name:", schedule.driverName);
        return true;
      }
      // Search in truck type
      if (
        schedule.truckType &&
        schedule.truckType.toLowerCase().includes(searchTerm)
      ) {
        console.log("✅ Found in truck type:", schedule.truckType);
        return true;
      }
      return false;
    });
    console.log("📊 Search results:", filteredSchedules.length, "items found");
  }

  // Filter by agenda status if provided
  if (params.agendaStatus && params.agendaStatus.length > 0) {
    console.log("🔍 Filtering by status:", params.agendaStatus);
    filteredSchedules = filteredSchedules.filter((schedule) => {
      const hasMatchingStatus = schedule.schedule.some((item) => {
        const matches = params.agendaStatus.includes(item.agendaStatus);
        if (matches) {
          console.log(
            "✅ Found matching status:",
            item.agendaStatus,
            "for",
            schedule.licensePlate
          );
        }
        return matches;
      });
      if (!hasMatchingStatus) {
        console.log(
          "❌ No matching status for:",
          schedule.licensePlate,
          "Statuses:",
          schedule.schedule.map((s) => s.agendaStatus)
        );
      }
      return hasMatchingStatus;
    });
    console.log("📊 Filter results:", filteredSchedules.length, "items found");
  }

  return {
    ...mockAPIResult.data.Data,
    schedules: filteredSchedules,
    pagination: {
      ...mockAPIResult.data.Data.pagination,
      totalItems: filteredSchedules.length,
      totalPages: Math.ceil(filteredSchedules.length / (params.limit || 10)),
    },
    summary: {
      ...mockAPIResult.data.Data.summary,
      totalArmada: filteredSchedules.length,
      totalDriver: filteredSchedules.length,
    },
  };
};

/**
 * Mengambil data jadwal agenda armada atau driver berdasarkan parameter yang diberikan
 * @param {Object} params - Parameter untuk mengambil data agenda
 * @param {number} params.page - Nomor halaman (default: 1)
 * @param {number} params.limit - Items per halaman (default: 10)
 * @param {string} params.viewType - Jenis tampilan: "armada" atau "driver" (default: "armada")
 * @param {string} params.scheduleDateFrom - Tanggal mulai periode (YYYY-MM-DD)
 * @param {string} params.scheduleDateTo - Tanggal akhir periode (YYYY-MM-DD)
 * @param {Array} params.agendaStatus - Filter status agenda
 * @param {string} params.search - Pencarian No Polisi/nama driver
 * @returns {Promise<Object>} - Data agenda schedule
 */
export const getAgendaSchedules = async (params = {}) => {
  const useMockData = false; // Set to false to use real API

  if (useMockData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getFilteredMockData(params);
  }

  // Build query parameters according to API contract
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.viewType) queryParams.append("view_type", params.viewType);
  if (params.scheduleDateFrom)
    queryParams.append("schedule_date_from", params.scheduleDateFrom);
  if (params.scheduleDateTo)
    queryParams.append("schedule_date_to", params.scheduleDateTo);
  if (params.agendaStatus && params.agendaStatus.length > 0) {
    queryParams.append("agenda_status", params.agendaStatus.join(","));
  }
  if (params.search) queryParams.append("search", params.search);

  const url = `/v1/transporter/agenda-schedules?${queryParams.toString()}`;
  console.log("🌐 Making REAL API call to:", url);
  console.log("📡 API Parameters:", params);

  try {
    const result = await fetcherMuatrans.get(url);

    console.log("✅ API call successful:", {
      status: result?.status,
      dataLength: result?.data?.Data?.schedules?.length || 0,
      timestamp: new Date().toLocaleTimeString(),
    });

    // Log the actual response structure for debugging
    console.log("🔍 Full API Response Structure:", {
      hasData: !!result?.data,
      hasDataData: !!result?.data?.Data,
      hasSchedules: !!result?.data?.Data?.schedules,
      responseKeys: result?.data ? Object.keys(result.data) : [],
      dataKeys: result?.data?.Data ? Object.keys(result.data.Data) : [],
      sampleSchedule: result?.data?.Data?.schedules?.[0] || null,
      responseSize: JSON.stringify(result?.data || {}).length,
    });

    // Check if response is empty or has no data
    if (!result?.data || Object.keys(result.data).length === 0) {
      console.log(
        "⚠️ API returned empty response, using mock data with filtering"
      );
      // Apply filtering to mock data when API returns empty
      return getFilteredMockData(params);
    }

    // Check if response has the expected structure
    if (
      result?.data?.Data?.schedules &&
      result.data.Data.schedules.length > 0
    ) {
      console.log(
        "✅ API returned valid data with schedules, applying client-side filtering"
      );
      // Apply client-side filtering to API data if needed
      return applyClientSideFiltering(result.data.Data, params);
    } else if (result?.data?.schedules && result.data.schedules.length > 0) {
      // Alternative structure: data.schedules directly
      console.log("🔄 Using alternative response structure: data.schedules");
      return applyClientSideFiltering(result.data, params);
    } else if (result?.data) {
      // Check if data exists but schedules is empty
      if (
        result.data.Data &&
        (!result.data.Data.schedules || result.data.Data.schedules.length === 0)
      ) {
        console.log(
          "⚠️ API returned empty schedules, using mock data with filtering"
        );
        return getFilteredMockData(params);
      }
      // Fallback: return data directly
      console.log("🔄 Using fallback response structure: data directly");
      return applyClientSideFiltering(result.data, params);
    } else {
      console.error("❌ Unexpected response structure:", result);
      throw new Error("Unexpected response structure from API");
    }
  } catch (error) {
    console.error("❌ API call failed:", {
      url,
      error: error.message,
      status: error.response?.status,
      timestamp: new Date().toLocaleTimeString(),
    });

    // Fallback to mock data if API fails
    console.log("🔄 Falling back to mock data due to API failure");
    return getFilteredMockData(params);
  }
};

/**
 * SWR hook untuk mengambil data agenda schedules
 * @param {Object} params - Parameter untuk mengambil data agenda
 * @returns {Object} - SWR result dengan data agenda schedules
 */
export const useGetAgendaSchedules = (params = {}) => {
  const { data, error, isLoading, mutate } = useSWR(
    `agenda-schedules/${JSON.stringify(params)}`,
    () => getAgendaSchedules(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

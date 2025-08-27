import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Use mock data for development since server data is not available yet
const useMockData = false;

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Fleet readiness checklist retrieved successfully",
    },
    Data: {
      orderId: "dcdaf886-56d6-4d84-89d6-a21ec18d0bc1",
      fleetId: "fleet-uuid-001",
      orderInfo: {
        orderCode: "ORD-2024-001",
        pickupLocation: "Jakarta Pusat",
        dropoffLocation: "Surabaya",
        scheduledPickupTime: "2024-03-15T08:00:00Z",
        estimatedDeliveryTime: "2024-03-16T14:00:00Z",
        estimatedDistance: 850, // km - distance from Jakarta to Surabaya
      },
      fleetInfo: {
        vehicleId: "vehicle-uuid-001",
        licensePlate: "B 1234 ABC",
        truckType: "Colt Diesel Engkel - Box",
        driverName: "John Doe",
        driverPhone: "081234567890",
        driverProfileImage: "https://example.com/driver.jpg",
      },
      checklistCategories: [
        {
          categoryId: "DOCUMENTS",
          categoryName: "Dokumen Kendaraan",
          items: [
            {
              itemId: "STNK",
              itemName: "STNK",
              description: "Surat Tanda Nomor Kendaraan",
              isRequired: true,
              checkStatus: "CHECKED",
              requiresUpload: true,
              uploadedFiles: [
                {
                  fileId: "file-001",
                  fileName: "stnk.jpg",
                  fileUrl: "https://example.com/stnk.jpg",
                  uploadedAt: "2024-03-15T07:30:00Z",
                },
              ],
            },
            {
              itemId: "KIR",
              itemName: "KIR",
              description: "Keur Izin Rute",
              isRequired: true,
              checkStatus: "INVALID",
              requiresUpload: true,
              validationMessage: "Dokumen KIR sudah expired",
              expiryDate: "2024-02-28T23:59:59Z",
            },
          ],
        },
        {
          categoryId: "VEHICLE_CONDITION",
          categoryName: "Kondisi Kendaraan",
          items: [
            {
              itemId: "ENGINE_CHECK",
              itemName: "Pemeriksaan Mesin",
              description: "Periksa kondisi mesin dan oli",
              isRequired: true,
              checkStatus: "CHECKED",
              requiresUpload: false,
              checkedAt: "2024-03-15T07:45:00Z",
              checkedBy: "driver-uuid-001",
            },
            {
              itemId: "FUEL_LEVEL",
              itemName: "Level BBM",
              description: "Periksa level bahan bakar",
              isRequired: true,
              checkStatus: "CHECKED",
              requiresUpload: false,
              estimatedConsumption: "80 liter",
              currentFuelLevel: "75%",
            },
            {
              itemId: "TIRE_CONDITION",
              itemName: "Kondisi Ban",
              description: "Periksa kondisi dan tekanan ban",
              isRequired: true,
              checkStatus: "PENDING",
              requiresUpload: true,
              inspectionPoints: [
                "Tekanan ban sesuai standar",
                "Tidak ada kerusakan atau botak",
                "Ban cadangan dalam kondisi baik",
              ],
            },
          ],
        },
      ],
      checklistSummary: {
        totalItems: 5,
        checkedItems: 2,
        pendingItems: 3,
        invalidItems: 1,
        completionPercentage: 40,
        canProceed: false,
      },
      additionalRequirements: {
        etaInputRequired: true,
        specialInstructions: "Muatan elektronik - hindari guncangan",
        contactInformation: {
          picName: "Budi Santoso",
          picPhone: "081234567890",
        },
      },
    },
    Type: "GET_FLEET_READINESS_CHECKLIST",
  },
};

// Normalize data to match component expectations
const normalizeReadinessData = (rawData) => {
  // Handle both mock data structure and real API response structure
  const {
    checklistSummary,
    orderInfo,
    fleetInfo,
    checklistCategories,
    order,
    locations,
    cargoInfo,
    additionalServiceRequirements,
  } = rawData;

  // For real API response, extract estimatedDistance from order object
  const realOrderData = order || orderInfo;
  const estimatedDistance =
    realOrderData?.estimatedDistance ||
    realOrderData?.estimatedDistanceKm ||
    orderInfo?.estimatedDistance ||
    121; // fallback to default

  return {
    // Normalized summary for easy access
    totalItems: checklistSummary?.totalItems || 0,
    checkedItems: checklistSummary?.checkedItems || 0,
    completionPercentage: checklistSummary?.completionPercentage || 0,
    canProceed: checklistSummary?.canProceed || false,

    // Order information - ensure estimatedDistance is available
    order: {
      ...orderInfo,
      ...realOrderData,
      estimatedDistance,
    },

    // Fleet information
    fleetInfo,

    // Location information
    locations,

    // Cargo information
    cargoInfo,

    // Additional service requirements
    additionalServiceRequirements,

    // Full checklist data for detailed view if needed
    checklistCategories,
    checklistSummary,

    // Raw data for backward compatibility
    _raw: rawData,
  };
};

// Fetcher function
export const getFleetReadinessChecklist = async (orderId) => {
  let result;
  if (useMockData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(
      `/v1/transporter/orders/${orderId}/readiness-checklist`
    );
  }
  const rawData = result.data.Data;

  // Normalize data before returning
  return normalizeReadinessData(rawData);
};

// Hook for getting fleet readiness checklist
export const useGetFleetReadinessChecklist = (orderId) =>
  useSWR(orderId ? `fleet-readiness-checklist/${orderId}` : null, () =>
    getFleetReadinessChecklist(orderId)
  );

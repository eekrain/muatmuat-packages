import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock config for UI state testing
const IS_MOCK = false;
const MOCK_CONFIG = {
  showEmptyState: false,
};

const apiResultAvailableFleet = {
  Message: {
    Code: 200,
    Text: "Available fleet vehicles retrieved successfully",
  },
  Data: {
    vehicles: [
      {
        id: "uuid",
        transporterID: "uuid",
        licensePlate: "B 1234 XYZ",
        truckTypeID: "uuid",
        carrierTruckID: "uuid",
        vehicleBrandID: "uuid",
        vehicleTypeID: "uuid",
        registrationYear: 2022,
        chassisNumber: "CHASSIS123",
        fleetStatus: "ACTIVE",
        verificationStatus: "VERIFICATION_COMPLETE",
        operationalStatus: "READY_FOR_ORDER", // WAITING_LOADING_TIME, ON_DUTY
        truckTypeName: "Fuso 6 Roda",
        carrierName: "Box",
        vehicleBrandName: "Mitsubishi",
        vehicleTypeName: "Canter",
        dimensions: {
          length: 6.0,
          width: 2.5,
          height: 2.5,
          dimensionUnit: "m",
        },
        driver: {
          id: "uuid",
          name: "John Driver",
          phoneNumber: "081234567890",
          profileImage: "https://storage.example.com/driver1.jpg",
          driverStatus: "AVAILABLE",
          simExpiryDate: "2025-12-31",
          verificationStatus: "VERIFIED",
          whatsappVerified: true,
        },
        location: {
          latitude: -6.2088,
          longitude: 106.8456,
          lastLocationUpdate: "2025-01-15T10:25:00+07:00",
          address: "Jakarta Pusat",
          accuracy: 10,
        },
        route: {
          hasRoute: true,
          distance: 5200,
          duration: 900,
          coordinates: [
            [-6.2088, 106.8456],
            [-6.21, 106.85],
          ],
        },
        schedule: {
          hasSchedule: false,
          nextLoadTime: null,
        },
        distanceFromPickup: 5.2,
        estimatedArrival: "15 menit",
        isRecommended: true,
        compatibilityScore: 95,
        statusInfo: {
          statusText: "Siap Menerima Order",
          statusColor: "green",
          additionalInfo: null,
        },
      },
      {
        id: "uuid2",
        transporterID: "uuid2",
        licensePlate: "B 5678 ABC",
        truckTypeID: "uuid2",
        carrierTruckID: "uuid2",
        vehicleBrandID: "uuid2",
        vehicleTypeID: "uuid2",
        registrationYear: 2021,
        chassisNumber: "CHASSIS456",
        fleetStatus: "ACTIVE",
        verificationStatus: "VERIFICATION_COMPLETE",
        operationalStatus: "ON_DUTY",
        truckTypeName: "Colt Diesel Engkel",
        carrierName: "Box",
        vehicleBrandName: "Isuzu",
        vehicleTypeName: "Elf",
        dimensions: {
          length: 4.5,
          width: 2.0,
          height: 2.0,
          dimensionUnit: "m",
        },
        driver: {
          id: "uuid2",
          name: "Jane Driver",
          phoneNumber: "081987654321",
          profileImage: "https://storage.example.com/driver2.jpg",
          driverStatus: "ON_DUTY",
          simExpiryDate: "2025-08-15",
          verificationStatus: "VERIFIED",
          whatsappVerified: true,
        },
        location: {
          latitude: -6.1753,
          longitude: 106.8266,
          lastLocationUpdate: "2025-01-15T10:30:00+07:00",
          address: "Pabean Cantikan, Kota Surabaya",
          accuracy: 8,
        },
        route: {
          hasRoute: true,
          distance: 7800,
          duration: 1200,
          coordinates: [
            [-6.1753, 106.8266],
            [-6.18, 106.83],
          ],
        },
        schedule: {
          hasSchedule: true,
          nextLoadTime: "2025-01-15T14:00:00+07:00",
          estimatedFinish: "12 Jun 2025",
          scheduleNotes: "Sedang dalam perjalanan menuju lokasi muat",
        },
        distanceFromPickup: 7.8,
        estimatedArrival: "20 menit",
        isRecommended: false,
        compatibilityScore: 78,
        statusInfo: {
          statusText: "Sedang Bertugas",
          statusColor: "orange",
          additionalInfo: "Estimasi selesai pukul 16:30",
        },
      },
    ],
  },
  Type: "GET_AVAILABLE_FLEET_VEHICLES",
};

export const useGetAvailableFleetVehicles = (orderId, params = {}) => {
  const cacheKey = params
    ? `available-fleet-${orderId}-${JSON.stringify(params)}`
    : `available-fleet-${orderId}`;
  return useSWR(cacheKey, () => fetcherAvailableFleetVehicles(orderId, params));
};

export const fetcherAvailableFleetVehicles = async (orderId, params = {}) => {
  if (IS_MOCK) {
    const result = JSON.parse(JSON.stringify(apiResultAvailableFleet));

    if (result.Data.showEmptyState) {
      return result.Data;
    }

    // Simpan semua vehicles original
    const originalVehicles = result.Data.vehicles;

    // Lanjut filter untuk tampilan saja
    let filteredVehicles = [...originalVehicles];

    // Filter by operational status if provided
    if (params.operationalStatus && params.operationalStatus.length > 0) {
      filteredVehicles = filteredVehicles.filter((vehicle) =>
        params.operationalStatus.includes(vehicle.operationalStatus)
      );
    }

    // Filter by search query if provided
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredVehicles = filteredVehicles.filter(
        (vehicle) =>
          vehicle.licensePlate.toLowerCase().includes(searchTerm) ||
          vehicle.driver.name.toLowerCase().includes(searchTerm) ||
          vehicle.truckTypeName.toLowerCase().includes(searchTerm) ||
          vehicle.carrierName.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by distance if provided
    if (params.maxDistance) {
      filteredVehicles = filteredVehicles.filter(
        (vehicle) => vehicle.distanceFromPickup <= params.maxDistance
      );
    }

    // Filter by recommended only
    if (params.recommendedOnly === true) {
      filteredVehicles = filteredVehicles.filter(
        (vehicle) => vehicle.isRecommended === true
      );
    }

    // Sort by recommendation and compatibility score
    filteredVehicles.sort((a, b) => {
      if (a.isRecommended && !b.isRecommended) return -1;
      if (!a.isRecommended && b.isRecommended) return 1;
      return b.compatibilityScore - a.compatibilityScore;
    });

    // Return data
    return {
      ...result.Data,
      vehicles: filteredVehicles,
    };
  }

  // API real
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);
  if (params.search) queryParams.append("search", params.search);
  if (params.operationalStatus) {
    params.operationalStatus.forEach((status) =>
      queryParams.append("operationalStatus", status)
    );
  }
  if (params.maxDistance) queryParams.append("maxDistance", params.maxDistance);
  if (params.recommendedOnly !== undefined)
    queryParams.append("recommendedOnly", params.recommendedOnly);

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `v1/transporter/monitoring/transport-requests/${orderId}/available-fleet?${queryString}`
    : `v1/transporter/monitoring/transport-requests/${orderId}/available-fleet`;

  const result = await fetcherMuatrans.get(endpoint);
  return result?.data?.Data || {};
};

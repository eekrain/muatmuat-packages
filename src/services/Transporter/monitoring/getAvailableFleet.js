import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockAvailableFleet = true;

const apiResultAvailableFleet = {
  Message: {
    Code: 200,
    Text: "Available fleet vehicles retrieved successfully",
  },
  Data: {
    vehicles: [
      {
        id: "fleet-uuid-1",
        transporterID: "transporter-uuid-1",
        licensePlate: "L 1111 CD",
        truckTypeID: "truck-type-uuid-1",
        carrierTruckID: "carrier-uuid-1",
        vehicleBrandID: "brand-uuid-1",
        vehicleTypeID: "vehicle-type-uuid-1",
        registrationYear: 2022,
        chassisNumber: "CHASSIS123456789",
        fleetStatus: "ACTIVE",
        verificationStatus: "VERIFICATION_COMPLETE",
        operationalStatus: "READY_FOR_ORDER", // WAITING_LOADING_TIME, ON_DUTY
        truckTypeName: "Tractor head 6 x 4 dan Semi Trailer",
        carrierName: "Skeletal Container Jumbo 45 ft (3 As",
        vehicleBrandName: "Mitsubishi",
        vehicleTypeName: "Canter",
        dimensions: {
          length: 6.0,
          width: 2.5,
          height: 2.5,
          dimensionUnit: "m",
        },
        driver: {
          id: "driver-uuid-1",
          name: "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra Toldo Sasmita",
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
          hasSchedule: true,
          nextLoadTime: "2025-01-15T15:30:00+07:00",
          estimatedFinish: "12 Jun 2025",
          scheduleNotes: null,
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
        id: "fleet-uuid-2",
        transporterID: "transporter-uuid-1",
        licensePlate: "L 2222 CD",
        truckTypeID: "truck-type-uuid-2",
        carrierTruckID: "carrier-uuid-2",
        vehicleBrandID: "brand-uuid-2",
        vehicleTypeID: "vehicle-type-uuid-2",
        registrationYear: 2021,
        chassisNumber: "CHASSIS987654321",
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
          id: "driver-uuid-2",
          name: "Noel Gallagher",
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
      {
        id: "fleet-uuid-3",
        transporterID: "transporter-uuid-1",
        licensePlate: "L 3333 CD",
        truckTypeID: "truck-type-uuid-3",
        carrierTruckID: "carrier-uuid-3",
        vehicleBrandID: "brand-uuid-3",
        vehicleTypeID: "vehicle-type-uuid-3",
        registrationYear: 2023,
        chassisNumber: "CHASSIS456789123",
        fleetStatus: "ACTIVE",
        verificationStatus: "VERIFICATION_COMPLETE",
        operationalStatus: "ON_DUTY",
        truckTypeName: "Colt Diesel Engkel",
        carrierName: "Box",
        vehicleBrandName: "Hino",
        vehicleTypeName: "Ranger",
        dimensions: {
          length: 12.0,
          width: 2.5,
          height: 3.8,
          dimensionUnit: "m",
        },
        driver: {
          id: "driver-uuid-3",
          name: "Mukloson",
          phoneNumber: "081122334455",
          profileImage: "https://storage.example.com/driver3.jpg",
          driverStatus: "WAITING",
          simExpiryDate: "2026-03-20",
          verificationStatus: "VERIFIED",
          whatsappVerified: true,
        },
        location: {
          latitude: -6.2618,
          longitude: 106.8106,
          lastLocationUpdate: "2025-01-15T10:35:00+07:00",
          address: "Jakarta Barat",
          accuracy: 12,
        },
        route: {
          hasRoute: true,
          distance: 3400,
          duration: 600,
          coordinates: [
            [-6.2618, 106.8106],
            [-6.265, 106.815],
          ],
        },
        schedule: {
          hasSchedule: true,
          nextLoadTime: "2025-01-15T13:00:00+07:00",
          estimatedFinish: "12 Jun 2025",
          scheduleNotes: "Menunggu waktu muat hari ini",
        },
        distanceFromPickup: 3.4,
        estimatedArrival: "10 menit",
        isRecommended: true,
        compatibilityScore: 92,
        statusInfo: {
          statusText: "Akan Muat Hari Ini",
          statusColor: "blue",
          additionalInfo: "Jadwal muat pukul 13:00",
        },
      },
      {
        id: "fleet-uuid-4",
        transporterID: "transporter-uuid-1",
        licensePlate: "B 3456 GHI",
        truckTypeID: "truck-type-uuid-1",
        carrierTruckID: "carrier-uuid-1",
        vehicleBrandID: "brand-uuid-4",
        vehicleTypeID: "vehicle-type-uuid-4",
        registrationYear: 2020,
        chassisNumber: "CHASSIS789123456",
        fleetStatus: "ACTIVE",
        verificationStatus: "VERIFICATION_COMPLETE",
        operationalStatus: "WAITING_LOADING_TIME",
        truckTypeName: "Tractor head 6 x 4 dan Semi Trailer",
        carrierName: "Skeletal Container Jumbo 45 ft  (3 As)",
        vehicleBrandName: "Mitsubishi",
        vehicleTypeName: "Fighter",
        dimensions: {
          length: 5.5,
          width: 2.3,
          height: 2.8,
          dimensionUnit: "m",
        },
        driver: {
          id: "driver-uuid-4",
          name: "Muklason Noel Gallagher Noel Gallagher Noel Gallagher",
          phoneNumber: "081555666777",
          profileImage: "https://storage.example.com/driver4.jpg",
          driverStatus: "AVAILABLE",
          simExpiryDate: "2025-11-10",
          verificationStatus: "VERIFIED",
          whatsappVerified: false,
        },
        location: {
          latitude: -6.1241,
          longitude: 106.7786,
          lastLocationUpdate: "2025-01-15T10:40:00+07:00",
          address: "Jakarta Utara",
          accuracy: 15,
        },
        route: {
          hasRoute: true,
          distance: 9500,
          duration: 1800,
          coordinates: [
            [-6.1241, 106.7786],
            [-6.13, 106.78],
          ],
        },
        schedule: {
          hasSchedule: true,
          nextLoadTime: "2025-01-15T15:30:00+07:00",
          estimatedFinish: null,
          scheduleNotes: null,
        },
        distanceFromPickup: 9.5,
        estimatedArrival: "30 menit",
        isRecommended: false,
        compatibilityScore: 85,
        statusInfo: {
          statusText: "Siap Menerima Order",
          statusColor: "green",
          additionalInfo: null,
        },
      },
      {
        id: "fleet-uuid-5",
        transporterID: "transporter-uuid-1",
        licensePlate: "B 7890 JKL",
        truckTypeID: "truck-type-uuid-2",
        carrierTruckID: "carrier-uuid-2",
        vehicleBrandID: "brand-uuid-2",
        vehicleTypeID: "vehicle-type-uuid-2",
        registrationYear: 2019,
        chassisNumber: "CHASSIS123789456",
        fleetStatus: "ACTIVE",
        verificationStatus: "VERIFICATION_COMPLETE",
        operationalStatus: "ON_DUTY",
        truckTypeName: "Colt Diesel Engkel",
        carrierName: "Bak Terbuka",
        vehicleBrandName: "Isuzu",
        vehicleTypeName: "Elf",
        dimensions: {
          length: 4.5,
          width: 2.0,
          height: 2.0,
          dimensionUnit: "m",
        },
        driver: {
          id: "driver-uuid-5",
          name: "Rudi Hartono",
          phoneNumber: "081888999000",
          profileImage: "https://storage.example.com/driver5.jpg",
          driverStatus: "ON_DUTY",
          simExpiryDate: "2025-06-25",
          verificationStatus: "VERIFIED",
          whatsappVerified: true,
        },
        location: {
          latitude: -6.5944,
          longitude: 106.7892,
          lastLocationUpdate: "2025-01-15T10:45:00+07:00",
          address: "Tangerang",
          accuracy: 20,
        },
        route: {
          hasRoute: true,
          distance: 15200,
          duration: 2400,
          coordinates: [
            [-6.5944, 106.7892],
            [-6.6, 106.8],
          ],
        },
        schedule: {
          hasSchedule: true,
          nextLoadTime: "2025-01-15T15:30:00+07:00",
          estimatedFinish: "2025-01-15T18:00:00+07:00",
          scheduleNotes: "Menyelesaikan pengiriman saat ini",
        },
        distanceFromPickup: 15.2,
        estimatedArrival: "40 menit",
        isRecommended: false,
        compatibilityScore: 68,
        statusInfo: {
          statusText: "Sedang Bertugas",
          statusColor: "orange",
          additionalInfo: "Tersedia setelah pukul 18:00",
        },
      },
    ],
  },
  Type: "GET_AVAILABLE_FLEET_VEHICLES",
};

export const useGetAvailableFleet = (orderId, params = {}) => {
  const cacheKey = ["monitoring-available-fleet", orderId, params];

  return useSWR(cacheKey, () => fetcherAvailableFleet(orderId, params));
};

export const fetcherAvailableFleet = async (orderId, params = {}) => {
  if (isMockAvailableFleet) {
    // Simulate filtering in mock data
    const filteredData = {
      ...apiResultAvailableFleet.Data,
      vehicles: apiResultAvailableFleet.Data.vehicles.filter((vehicle) => {
        // Filter by operational status if provided
        if (params.operationalStatus && params.operationalStatus.length > 0) {
          return params.operationalStatus.includes(vehicle.operationalStatus);
        }

        // Filter by search query if provided
        if (params.search) {
          const searchTerm = params.search.toLowerCase();
          return (
            vehicle.licensePlate.toLowerCase().includes(searchTerm) ||
            vehicle.driver.name.toLowerCase().includes(searchTerm) ||
            vehicle.truckTypeName.toLowerCase().includes(searchTerm) ||
            vehicle.carrierName.toLowerCase().includes(searchTerm)
          );
        }

        // Filter by distance if provided
        if (params.maxDistance) {
          return vehicle.distanceFromPickup <= params.maxDistance;
        }

        // Filter by recommended only
        if (params.recommendedOnly === true) {
          return vehicle.isRecommended === true;
        }

        return true;
      }),
    };

    // Sort by recommendation and compatibility score
    filteredData.vehicles.sort((a, b) => {
      if (a.isRecommended && !b.isRecommended) return -1;
      if (!a.isRecommended && b.isRecommended) return 1;
      return b.compatibilityScore - a.compatibilityScore;
    });

    return filteredData;
  }

  const result = await fetcherMuatrans.get(
    `/v1/transporter/monitoring/transport-requests/${orderId}/available-fleet`,
    { params }
  );
  return result?.data?.Data || {};
};

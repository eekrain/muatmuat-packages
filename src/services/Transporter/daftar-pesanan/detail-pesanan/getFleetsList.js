import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Use mock data for development since server data is not available yet
const useMockData = true;

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Available fleet vehicles retrieved successfully",
    },
    Data: {
      vehicles: [
        {
          id: "fleet-uuid-001",
          transporterID: "transporter-uuid-001",
          licensePlate: "B 1234 XYZ",
          truckTypeID: "truck-type-uuid-001",
          carrierTruckID: "carrier-uuid-001",
          vehicleBrandID: "brand-uuid-001",
          vehicleTypeID: "type-uuid-001",
          registrationYear: 2022,
          chassisNumber: "CHASSIS123",
          fleetStatus: "ACTIVE",
          verificationStatus: "VERIFICATION_COMPLETE",
          operationalStatus: "READY_FOR_ORDER",
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
            id: "driver-uuid-001",
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
          id: "fleet-uuid-002",
          transporterID: "transporter-uuid-001",
          licensePlate: "B 5678 ABC",
          truckTypeID: "truck-type-uuid-002",
          carrierTruckID: "carrier-uuid-002",
          vehicleBrandID: "brand-uuid-002",
          vehicleTypeID: "type-uuid-002",
          registrationYear: 2023,
          chassisNumber: "CHASSIS456",
          fleetStatus: "ACTIVE",
          verificationStatus: "VERIFICATION_COMPLETE",
          operationalStatus: "READY_FOR_ORDER",
          truckTypeName: "Truck 10 Roda",
          carrierName: "Container",
          vehicleBrandName: "Hino",
          vehicleTypeName: "Ranger",
          dimensions: {
            length: 12.0,
            width: 2.5,
            height: 2.8,
            dimensionUnit: "m",
          },
          driver: {
            id: "driver-uuid-002",
            name: "Sarah Wilson",
            phoneNumber: "081234567891",
            profileImage: "https://storage.example.com/driver2.jpg",
            driverStatus: "AVAILABLE",
            simExpiryDate: "2025-06-30",
            verificationStatus: "VERIFIED",
            whatsappVerified: true,
          },
          location: {
            latitude: -6.2089,
            longitude: 106.8457,
            lastLocationUpdate: "2025-01-15T10:30:00+07:00",
            address: "Jakarta Selatan",
            accuracy: 15,
          },
          route: {
            hasRoute: true,
            distance: 7800,
            duration: 1200,
            coordinates: [
              [-6.2089, 106.8457],
              [-6.215, 106.86],
            ],
          },
          schedule: {
            hasSchedule: false,
            nextLoadTime: null,
          },
          distanceFromPickup: 7.8,
          estimatedArrival: "20 menit",
          isRecommended: false,
          compatibilityScore: 85,
          statusInfo: {
            statusText: "Siap Menerima Order",
            statusColor: "green",
            additionalInfo: null,
          },
        },
        {
          id: "fleet-uuid-003",
          transporterID: "transporter-uuid-001",
          licensePlate: "B 9012 DEF",
          truckTypeID: "truck-type-uuid-003",
          carrierTruckID: "carrier-uuid-003",
          vehicleBrandID: "brand-uuid-003",
          vehicleTypeID: "type-uuid-003",
          registrationYear: 2021,
          chassisNumber: "CHASSIS789",
          fleetStatus: "ACTIVE",
          verificationStatus: "VERIFICATION_COMPLETE",
          operationalStatus: "READY_FOR_ORDER",
          truckTypeName: "Pickup 4 Roda",
          carrierName: "Pickup",
          vehicleBrandName: "Suzuki",
          vehicleTypeName: "Carry",
          dimensions: {
            length: 3.5,
            width: 1.6,
            height: 1.8,
            dimensionUnit: "m",
          },
          driver: {
            id: "driver-uuid-003",
            name: "Ahmad Rizki",
            phoneNumber: "081234567892",
            profileImage: "https://storage.example.com/driver3.jpg",
            driverStatus: "AVAILABLE",
            simExpiryDate: "2025-03-15",
            verificationStatus: "VERIFIED",
            whatsappVerified: false,
          },
          location: {
            latitude: -6.209,
            longitude: 106.8458,
            lastLocationUpdate: "2025-01-15T10:35:00+07:00",
            address: "Jakarta Barat",
            accuracy: 8,
          },
          route: {
            hasRoute: true,
            distance: 3200,
            duration: 600,
            coordinates: [
              [-6.209, 106.8458],
              [-6.205, 106.84],
            ],
          },
          schedule: {
            hasSchedule: false,
            nextLoadTime: null,
          },
          distanceFromPickup: 3.2,
          estimatedArrival: "10 menit",
          isRecommended: true,
          compatibilityScore: 98,
          statusInfo: {
            statusText: "Siap Menerima Order",
            statusColor: "green",
            additionalInfo: null,
          },
        },
      ],
    },
    Type: "GET_AVAILABLE_FLEET_VEHICLES",
  },
};

// Fetcher function
export const getAvailableFleetVehicles = async (orderId) => {
  let result;
  if (useMockData) {
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(
      `/v1/transporter/monitoring/transport-requests/${orderId}/available-fleet`
    );
  }
  const data = result.data.Data;
  return data;
};

// SWR Hook
export const useGetAvailableFleetVehicles = (orderId) =>
  useSWR(`available-fleet/${orderId}`, () =>
    getAvailableFleetVehicles(orderId)
  );

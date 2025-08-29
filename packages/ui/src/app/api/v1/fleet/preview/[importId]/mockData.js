export const successResponse = {
  Message: {
    Code: 200,
    Text: "Fleet preview data retrieved successfully",
  },
  Data: {
    bulkImportId: "12345678-1234-1234-1234-123456789012", // [dbt_mt_fleet_bulk_import.id]
    totalFleets: 25,
    fleets: [
      {
        id: "87654321-4321-4321-4321-210987654321", // [dbt_mt_fleet_import_history.id]
        excelRowNumber: 2, // [dbt_mt_fleet_import_history.excelRowNumber]
        licensePlate: "B1234CD", // [dbm_mt_fleet.licensePlate]
        truckTypeName: "Truk Besar", // [dbm_mt_truck_type.name]
        truckTypeId: "truck-type-uuid-001",
        carrierTypeName: "Box", // [dbm_mt_carrier_truck.name]
        carrierTypeId: "carrier-type-uuid-001",
        vehicleBrand: "Toyota", // [dbm_mt_vehicle_brand.name]
        vehicleBrandId: "vehicle-brand-uuid-001",
        vehicleType: "Dyna", // [dbm_mt_vehicle_type.name]
        vehicleTypeId: "vehicle-type-uuid-001",
        registrationYear: 2020, // [dbm_mt_fleet.registrationYear]
        chassisNumber: "JHD123456789", // [dbm_mt_fleet.chassisNumber]
        stnkExpiryDate: "2025-12-31", // [dbm_mt_fleet.stnkExpiryDate]
        kirExpiryDate: "2025-06-30", // [dbm_mt_fleet.kirExpiryDate]
        gpsInstallationEstimateStartDate: "2024-02-01",
        gpsInstallationEstimateEndDate: "2024-02-03",
      },
      {
        id: "98765432-5432-5432-5432-321098765432",
        excelRowNumber: 3,
        licensePlate: "D5678EF",
        truckTypeName: "Truk Sedang",
        truckTypeId: "truck-type-uuid-002",
        carrierTypeName: "Engkel",
        carrierTypeId: "carrier-type-uuid-002",
        vehicleBrand: "Mitsubishi",
        vehicleBrandId: "vehicle-brand-uuid-002",
        vehicleType: "Canter",
        vehicleTypeId: "vehicle-type-uuid-002",
        registrationYear: 2019,
        chassisNumber: "MIT987654321",
        stnkExpiryDate: "2025-08-15",
        kirExpiryDate: "2025-04-20",
        gpsInstallationEstimateStartDate: "2024-02-05",
        gpsInstallationEstimateEndDate: "2024-02-07",
      },
      {
        id: "11111111-1111-1111-1111-111111111111",
        excelRowNumber: 4,
        licensePlate: "F9012GH",
        truckTypeName: "Truk Kecil",
        truckTypeId: "truck-type-uuid-003",
        carrierTypeName: "Pick Up",
        carrierTypeId: "carrier-type-uuid-003",
        vehicleBrand: "Isuzu",
        vehicleBrandId: "vehicle-brand-uuid-003",
        vehicleType: "ELF",
        vehicleTypeId: "vehicle-type-uuid-003",
        registrationYear: 2021,
        chassisNumber: "ISU456789123",
        stnkExpiryDate: "2026-03-10",
        kirExpiryDate: "2025-09-25",
        gpsInstallationEstimateStartDate: "2024-02-10",
        gpsInstallationEstimateEndDate: "2024-02-12",
      },
    ],
  },
  Type: "FLEET_PREVIEW",
};

export const errorResponse = {
  Message: {
    Code: 404,
    Text: "Import ID not found",
  },
  Data: {
    errors: [
      {
        field: "importId",
        message: "Data import dengan ID tersebut tidak ditemukan",
      },
    ],
  },
  Type: "IMPORT_NOT_FOUND",
};

export const serverErrorResponse = {
  Message: {
    Code: 500,
    Text: "Internal Server Error",
  },
  Data: {
    errors: [
      {
        field: "general",
        message: "Terjadi kesalahan pada sistem kami",
      },
    ],
  },
  Type: "INTERNAL_SERVER_ERROR",
};

export const processingErrorResponse = {
  Message: {
    Code: 400,
    Text: "Import still processing",
  },
  Data: {
    errors: [
      {
        field: "status",
        message: "Data import masih dalam proses. Silakan coba lagi nanti.",
      },
    ],
  },
  Type: "IMPORT_PROCESSING",
};

export const emptyPreviewResponse = {
  Message: {
    Code: 200,
    Text: "Fleet preview data retrieved successfully",
  },
  Data: {
    bulkImportId: "12345678-1234-1234-1234-123456789012",
    totalFleets: 0,
    fleets: [],
  },
  Type: "FLEET_PREVIEW",
};

// Mock data for different import scenarios
export const mockFleetData = {
  // Large dataset simulation
  generateLargeFleetList: (count = 50) => {
    const fleets = [];
    const truckTypes = ["Truk Besar", "Truk Sedang", "Truk Kecil"];
    const carrierTypes = ["Box", "Engkel", "Pick Up", "Tanker"];
    const brands = ["Toyota", "Mitsubishi", "Isuzu", "Hino", "Fuso"];
    const vehicleTypes = ["Dyna", "Canter", "ELF", "Ranger", "Fighter"];

    for (let i = 0; i < count; i++) {
      const rowNumber = i + 2; // Excel starts from row 2 (excluding header)
      fleets.push({
        id: `fleet-${Date.now()}-${i}`,
        excelRowNumber: rowNumber,
        licensePlate: `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}${Math.floor(1000 + Math.random() * 9000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
        truckTypeName:
          truckTypes[Math.floor(Math.random() * truckTypes.length)],
        truckTypeId: `truck-type-uuid-${String(i).padStart(3, "0")}`,
        carrierTypeName:
          carrierTypes[Math.floor(Math.random() * carrierTypes.length)],
        carrierTypeId: `carrier-type-uuid-${String(i).padStart(3, "0")}`,
        vehicleBrand: brands[Math.floor(Math.random() * brands.length)],
        vehicleBrandId: `vehicle-brand-uuid-${String(i).padStart(3, "0")}`,
        vehicleType:
          vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
        vehicleTypeId: `vehicle-type-uuid-${String(i).padStart(3, "0")}`,
        registrationYear: 2018 + Math.floor(Math.random() * 7), // 2018-2024
        chassisNumber: `${brands[Math.floor(Math.random() * brands.length)].substring(0, 3).toUpperCase()}${Math.floor(100000000 + Math.random() * 900000000)}`,
        stnkExpiryDate: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
        kirExpiryDate: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
        gpsInstallationEstimateStartDate: "2024-02-01",
        gpsInstallationEstimateEndDate: "2024-02-03",
      });
    }
    return fleets;
  },
};

import { NextResponse } from "next/server";

import {
  errorResponse,
  invalidBatchIdResponse,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Mock function to validate batch ID format
function isValidBatchId(batchId) {
  const uuidRegex =
    /^batch-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(batchId);
}

// Mock function to generate driver data
function generateMockDrivers(batchId, count = 25) {
  const firstNames = [
    "John",
    "Jane",
    "Ahmad",
    "Siti",
    "Eko",
    "Budi",
    "Sri",
    "Agus",
    "Dewi",
    "Rudi",
    "Maya",
    "Deni",
    "Rina",
    "Hendri",
    "Lestari",
    "Bambang",
    "Ani",
    "Dody",
    "Ika",
    "Yanto",
    "Wati",
    "Hadi",
    "Sari",
    "Adi",
    "Fitri",
  ];

  const lastNames = [
    "Doe",
    "Smith",
    "Budi",
    "Nurhaliza",
    "Prasetyo",
    "Santoso",
    "Kusuma",
    "Wijaya",
    "Sari",
    "Hermawan",
    "Lestari",
    "Pratama",
    "Wulandari",
    "Setiawan",
    "Maharani",
    "Gunawan",
    "Pertiwi",
    "Saputra",
    "Indrayani",
    "Purnomo",
    "Rahayu",
    "Kurniawan",
    "Safitri",
    "Nugroho",
    "Anggraini",
  ];

  const drivers = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const phoneNumber = `08123456${String(7890 + i).padStart(4, "0")}`;

    // Generate random SIM expiry date between 2025-2027
    const startDate = new Date("2025-01-01");
    const endDate = new Date("2027-12-31");
    const randomTime =
      startDate.getTime() +
      Math.random() * (endDate.getTime() - startDate.getTime());
    const simExpiryDate = new Date(randomTime).toISOString().split("T")[0];

    drivers.push({
      tempId: `temp-${String(i + 1).padStart(3, "0")}`,
      name: `${firstName} ${lastName}`,
      phoneNumber: phoneNumber,
      simExpiryDate: simExpiryDate,
    });
  }

  return drivers;
}

// Mock database of batch IDs for demonstration
const mockBatches = {
  "batch-123e4567-e89b-12d3-a456-426614174000": { totalDrivers: 25 },
  "batch-987fcdeb-51d3-47a8-b456-123456789abc": { totalDrivers: 1 },
  "batch-456789ab-cdef-1234-5678-90abcdef1234": { totalDrivers: 40 },
};

export async function GET(req, { params }) {
  try {
    // Add realistic delay for database query
    await delay(500);

    const { batchId } = params;

    // Validate batch ID format
    if (!isValidBatchId(batchId)) {
      return NextResponse.json(invalidBatchIdResponse, {
        status: invalidBatchIdResponse.Message.Code,
      });
    }

    // Check if batch exists in mock database
    const batchData = mockBatches[batchId];
    if (!batchData) {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Generate mock driver data
    const drivers = generateMockDrivers(batchId, batchData.totalDrivers);

    // Create dynamic success response
    const dynamicSuccessResponse = {
      ...successResponse,
      Data: {
        batchId: batchId,
        totalDrivers: batchData.totalDrivers,
        drivers: drivers,
      },
    };

    return NextResponse.json(dynamicSuccessResponse, {
      status: dynamicSuccessResponse.Message.Code,
    });
  } catch {
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}

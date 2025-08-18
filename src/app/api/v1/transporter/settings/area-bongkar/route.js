import { NextResponse } from "next/server";

import {
  noCityErrorResponse,
  noDataResponse,
  noProvinceErrorResponse,
  saveErrorResponse,
  saveSuccessResponse,
  searchAreaBongkarNoDataResponse,
  searchAreaBongkarSuccessResponse,
  serverErrorResponse,
  successResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req) {
  try {
    // Add realistic delay for testing
    await delay(1000);

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    // Mock: Create a copy of the success response to modify
    const mockData = { ...successResponse };

    // Update pagination based on query parameters
    mockData.Data.pagination = {
      currentPage: page,
      totalPages: Math.ceil(mockData.Data.totalProvinces / limit),
      totalItems: mockData.Data.totalProvinces,
      itemsPerPage: limit,
    };

    // Mock: Simulate pagination by slicing the data
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    mockData.Data.unloadingAreas = mockData.Data.unloadingAreas.slice(
      startIndex,
      endIndex
    );

    // Mock: Simulate no data scenario (uncomment to test)
    // if (Math.random() < 0.1) {
    //   return NextResponse.json(noDataResponse, {
    //     status: noDataResponse.Message.Code,
    //   });
    // }

    // Return success response
    return NextResponse.json(mockData, {
      status: mockData.Message.Code,
    });
  } catch (error) {
    console.error("Area Bongkar API Error:", error);
    return NextResponse.json(serverErrorResponse, {
      status: serverErrorResponse.Message.Code,
    });
  }
}

export async function POST(req) {
  try {
    // Add realistic delay for testing
    await delay(800);

    // Check for authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(saveErrorResponse, {
        status: saveErrorResponse.Message.Code,
      });
    }

    // Parse request body
    const body = await req.json();
    const { unloadingAreas } = body;

    // Validation: Check if unloadingAreas exists and is an array
    if (!unloadingAreas || !Array.isArray(unloadingAreas)) {
      return NextResponse.json(noProvinceErrorResponse, {
        status: noProvinceErrorResponse.Message.Code,
      });
    }

    // Validation: Check if at least one province is selected
    if (unloadingAreas.length === 0) {
      return NextResponse.json(noProvinceErrorResponse, {
        status: noProvinceErrorResponse.Message.Code,
      });
    }

    // Validation: Check if each province has at least one city
    for (let i = 0; i < unloadingAreas.length; i++) {
      const province = unloadingAreas[i];

      if (
        !province.cities ||
        !Array.isArray(province.cities) ||
        province.cities.length === 0
      ) {
        const errorResponse = {
          ...noCityErrorResponse,
          Data: {
            errors: [
              {
                field: `areaBongkar[${i}].kotaKabupaten`,
                message: `Minimal 1 kota/kabupaten harus dipilih untuk provinsi ${province.provinceName || "yang dipilih"}`,
                code: "MINIMUM_CITY_PER_PROVINCE_REQUIRED",
              },
            ],
          },
        };

        return NextResponse.json(errorResponse, {
          status: errorResponse.Message.Code,
        });
      }
    }

    // Calculate totals
    const totalProvinces = unloadingAreas.length;
    const totalKota = unloadingAreas.reduce((total, province) => {
      return total + (province.cities ? province.cities.length : 0);
    }, 0);

    // Mock successful save response
    const response = {
      ...saveSuccessResponse,
      Data: {
        ...saveSuccessResponse.Data,
        totalProvinces,
        totalKota,
        configurationId: `550e8400-e29b-41d4-a716-${Date.now().toString().slice(-12)}`,
        transporterId: "550e8400-e29b-41d4-a716-446655440088",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    // Log for debugging
    console.log("Area Bongkar saved:", {
      totalProvinces,
      totalKota,
      provinces: unloadingAreas.map((p) => ({
        name: p.provinceName,
        citiesCount: p.cities.length,
      })),
    });

    return NextResponse.json(response, {
      status: response.Message.Code,
    });
  } catch (error) {
    console.error("Save Area Bongkar API Error:", error);
    return NextResponse.json(serverErrorResponse, {
      status: serverErrorResponse.Message.Code,
    });
  }
}

export async function DELETE(req) {
  try {
    // Add realistic delay for testing
    await delay(800);

    // Check for authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        {
          Message: {
            Code: 401,
            Text: "Token autentikasi tidak ditemukan",
          },
          Data: null,
          Type: "DELETE_PROVINSI_AREA_BONGKAR_ERROR",
        },
        {
          status: 401,
        }
      );
    }

    // Extract provinsi ID from URL
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");
    const provinsiId = pathSegments[pathSegments.length - 1];

    if (!provinsiId) {
      return NextResponse.json(
        {
          Message: {
            Code: 400,
            Text: "ID provinsi tidak ditemukan",
          },
          Data: {
            errors: [
              {
                field: "provinsiId",
                message: "ID provinsi harus disertakan dalam URL",
              },
            ],
          },
          Type: "DELETE_PROVINSI_AREA_BONGKAR_ERROR",
        },
        {
          status: 400,
        }
      );
    }

    // Mock: Check if this is the last province (simulate validation)
    // In real implementation, you would check against database
    const isLastProvince = Math.random() < 0.3; // 30% chance to simulate last province scenario

    if (isLastProvince) {
      return NextResponse.json(
        {
          Message: {
            Code: 400,
            Text: "Kamu tidak bisa menghapus provinsi terakhir. Minimal harus ada satu provinsi terpilih",
          },
          Data: {
            errors: [
              {
                field: "provinsiId",
                message:
                  "Minimal 1 provinsi harus tersisa dalam konfigurasi area bongkar",
              },
            ],
            remainingProvinsi: 1,
          },
          Type: "DELETE_PROVINSI_AREA_BONGKAR_ERROR",
        },
        {
          status: 400,
        }
      );
    }

    // Mock successful delete response
    const mockProvinceNames = [
      "DKI Jakarta",
      "Jawa Barat",
      "Jawa Tengah",
      "Jawa Timur",
      "Sumatera Utara",
      "Sumatera Barat",
      "Bali",
      "Kalimantan Timur",
    ];
    const deletedProvinceName =
      mockProvinceNames[Math.floor(Math.random() * mockProvinceNames.length)];
    const remainingCount = Math.floor(Math.random() * 5) + 2; // 2-6 remaining provinces

    const response = {
      Message: {
        Code: 200,
        Text: `Berhasil menghapus Provinsi ${deletedProvinceName}`,
      },
      Data: {
        deleted: true,
        deletedProvinsiName: deletedProvinceName,
        remainingProvinsi: remainingCount,
      },
      Type: "DELETE_PROVINSI_AREA_BONGKAR",
    };

    // Log for debugging
    console.log("Province deleted:", {
      provinsiId,
      deletedProvinceName,
      remainingCount,
    });

    return NextResponse.json(response, {
      status: response.Message.Code,
    });
  } catch (error) {
    console.error("Delete Provinsi Area Bongkar API Error:", error);
    return NextResponse.json(serverErrorResponse, {
      status: serverErrorResponse.Message.Code,
    });
  }
}

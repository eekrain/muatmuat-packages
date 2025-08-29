import { NextResponse } from "next/server";

import {
  searchAreaBongkarNoDataResponse,
  searchAreaBongkarSuccessResponse,
  serverErrorResponse,
} from "../mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req) {
  try {
    // Add realistic delay for testing
    await delay(1000);

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
          Type: "SEARCH_AREA_BONGKAR_ERROR",
        },
        {
          status: 401,
        }
      );
    }

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    // Validate required keyword parameter
    if (!keyword) {
      return NextResponse.json(
        {
          Message: {
            Code: 400,
            Text: "Parameter keyword wajib diisi",
          },
          Data: {
            errors: [
              {
                field: "keyword",
                message: "Parameter keyword tidak boleh kosong",
                code: "KEYWORD_REQUIRED",
              },
            ],
          },
          Type: "SEARCH_AREA_BONGKAR_ERROR",
        },
        {
          status: 400,
        }
      );
    }

    // Mock search data based on keyword
    const mockData = { ...searchAreaBongkarSuccessResponse };
    let searchResults = [];

    // Simple mock search logic
    const allProvinces = [
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440001",
        provinceName: "DKI Jakarta",
        areaName: "Area Jakarta Raya",
        cityCount: 5,
        isAllCitiesSelected: false,
        displayText: "DKI Jakarta - 5 Kota/Kab",
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440002",
        provinceName: "Jawa Barat",
        areaName: "Area Jawa Barat",
        cityCount: 8,
        isAllCitiesSelected: true,
        displayText: "Jawa Barat - 8 Kota/Kab",
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440003",
        provinceName: "Jawa Tengah",
        areaName: "Area Jawa Tengah",
        cityCount: 6,
        isAllCitiesSelected: false,
        displayText: "Jawa Tengah - 3 Kota/Kab",
      },
      {
        provinceId: "550e8400-e29b-41d4-a716-446655440004",
        provinceName: "Jawa Timur",
        areaName: "Area Jawa Timur",
        cityCount: 7,
        isAllCitiesSelected: false,
        displayText: "Jawa Timur - 4 Kota/Kab",
      },
    ];

    // Filter provinces based on keyword
    searchResults = allProvinces.filter((province) =>
      province.provinceName.toLowerCase().includes(keyword.toLowerCase())
    );

    // Add highlighting to matching provinces
    searchResults = searchResults.map((province) => ({
      ...province,
      highlightedName: province.provinceName.replace(
        new RegExp(keyword, "gi"),
        `<mark>$&</mark>`
      ),
    }));

    // Handle pagination
    const totalItems = searchResults.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = searchResults.slice(startIndex, endIndex);

    // Update response data
    mockData.Data.keyword = keyword;
    mockData.Data.found = paginatedResults.length > 0;
    mockData.Data.unloadingAreas = paginatedResults;
    mockData.Data.pagination = {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalItems,
      itemsPerPage: limit,
    };

    // Return no data response if no results found
    if (paginatedResults.length === 0) {
      const noDataResponse = {
        ...searchAreaBongkarNoDataResponse,
        Data: {
          ...searchAreaBongkarNoDataResponse.Data,
          keyword: keyword,
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: limit,
          },
        },
      };

      return NextResponse.json(noDataResponse, {
        status: noDataResponse.Message.Code,
      });
    }

    // Log for debugging
    console.log("Area Bongkar search:", {
      keyword,
      foundResults: paginatedResults.length,
      totalResults: totalItems,
    });

    // Return success response
    return NextResponse.json(mockData, {
      status: mockData.Message.Code,
    });
  } catch (error) {
    console.error("Search Area Bongkar API Error:", error);
    return NextResponse.json(serverErrorResponse, {
      status: serverErrorResponse.Message.Code,
    });
  }
}

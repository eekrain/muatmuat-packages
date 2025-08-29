import { NextResponse } from "next/server";

import {
  kotaKabupatenNoDataResponse,
  kotaKabupatenSuccessResponse,
  serverErrorResponse,
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
    const provinceIds = searchParams.get("provinceIds") || "";
    const search = searchParams.get("search") || "";
    const selectedOnly = searchParams.get("selectedOnly") === "true";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;

    // Validate required parameters
    if (!provinceIds) {
      return NextResponse.json(
        {
          Message: {
            Code: 400,
            Text: "Parameter provinceIds wajib diisi",
          },
          Data: null,
          Type: "GET_MASTER_KOTA_KABUPATEN_ERROR",
        },
        {
          status: 400,
        }
      );
    }

    // Mock: Create a copy of the success response to modify
    const mockData = { ...kotaKabupatenSuccessResponse };
    let citiesData = [...mockData.Data.cities];

    // Filter by provinceIds
    const provinceIdArray = provinceIds
      .split(",")
      .map((id) => parseInt(id.trim()));
    citiesData = citiesData.filter((city) =>
      provinceIdArray.includes(city.provinceId)
    );

    // Filter by search if provided
    if (search) {
      citiesData = citiesData
        .map((province) => ({
          ...province,
          kota: province.kota.filter((kota) =>
            kota.cityName.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((province) => province.kota.length > 0);
    }

    // Filter by selectedOnly if true
    if (selectedOnly) {
      citiesData = citiesData
        .map((province) => ({
          ...province,
          kota: province.kota.filter((kota) => kota.isSelected),
        }))
        .filter((province) => province.kota.length > 0);
    }

    // Calculate total items for pagination
    const totalItems = citiesData.reduce(
      (acc, province) => acc + province.kota.length,
      0
    );
    const totalPages = Math.ceil(totalItems / limit);

    // Handle pagination
    const paginatedCities = [];
    let currentCount = 0;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    for (const province of citiesData) {
      const kotaToAdd = [];
      for (const kota of province.kota) {
        if (currentCount >= startIndex && currentCount < endIndex) {
          kotaToAdd.push(kota);
        }
        currentCount++;
      }

      if (kotaToAdd.length > 0) {
        paginatedCities.push({
          ...province,
          kota: kotaToAdd,
        });
      }
    }

    // Update response data
    mockData.Data.cities = paginatedCities;
    mockData.Data.pagination = {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalItems,
      itemsPerPage: limit,
    };

    // Return no data response if no results found
    if (paginatedCities.length === 0 || totalItems === 0) {
      return NextResponse.json(kotaKabupatenNoDataResponse, {
        status: kotaKabupatenNoDataResponse.Message.Code,
      });
    }

    // Return success response
    return NextResponse.json(mockData, {
      status: mockData.Message.Code,
    });
  } catch (error) {
    console.error("Master Kota/Kabupaten API Error:", error);
    return NextResponse.json(serverErrorResponse, {
      status: serverErrorResponse.Message.Code,
    });
  }
}

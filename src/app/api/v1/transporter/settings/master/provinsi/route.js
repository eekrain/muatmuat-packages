import { NextResponse } from "next/server";

import { serverErrorResponse } from "../../area-bongkar/mockData";
import {
  createMasterProvinsiNoDataResponse,
  createMasterProvinsiSuccessResponse,
  masterProvinsiData,
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
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const excludeSelected = searchParams.get("excludeSelected") === "true";

    // Create a copy of the master data
    let provinsiData = [...masterProvinsiData];

    // Filter by search if provided
    if (search) {
      provinsiData = provinsiData.filter((provinsi) =>
        provinsi.provinceName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by excludeSelected if true
    if (excludeSelected) {
      provinsiData = provinsiData.filter((provinsi) => !provinsi.isSelected);
    }

    // Handle pagination
    const totalItems = provinsiData.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = provinsiData.slice(startIndex, endIndex);

    // Create pagination info
    const pagination = {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalItems,
      itemsPerPage: limit,
    };

    // Update grouping based on filtered data
    const grouping = {};
    provinsiData.forEach((provinsi) => {
      const group = provinsi.alphabetGroup;
      grouping[group] = (grouping[group] || 0) + 1;
    });
    // mockData.Data.grouping = grouping;
    // Create search params string
    const searchParamsString = `search=${search}&page=${page}&limit=${limit}&excludeSelected=${excludeSelected}`;

    // Return no data response if no results found
    if (paginatedData.length === 0) {
      const noDataResponse = createMasterProvinsiNoDataResponse(
        pagination,
        searchParamsString
      );
      return NextResponse.json(noDataResponse, {
        status: noDataResponse.Message.Code,
      });
    }

    // Return success response
    const successResponse = createMasterProvinsiSuccessResponse(
      paginatedData,
      pagination,
      searchParamsString
    );
    return NextResponse.json(successResponse, {
      status: successResponse.Message.Code,
    });
  } catch (error) {
    console.error("Master Provinsi API Error:", error);
    return NextResponse.json(serverErrorResponse, {
      status: serverErrorResponse.Message.Code,
    });
  }
}

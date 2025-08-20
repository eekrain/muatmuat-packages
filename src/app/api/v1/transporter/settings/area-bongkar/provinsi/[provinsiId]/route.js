import { NextResponse } from "next/server";

import { provinceNameMapping } from "../../../master/provinsi/mockData";
import {
  authErrorResponse,
  mockUpdateAreaBongkarError,
  mockUpdateAreaBongkarSuccess,
  serverErrorResponse,
} from "./mockData";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function PUT(req, { params }) {
  try {
    await delay(800);

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(authErrorResponse, {
        status: authErrorResponse.Message.Code,
      });
    }

    const { provinsiId } = params;
    if (!provinsiId) {
      return NextResponse.json(
        {
          Message: {
            Code: 400,
            Text: "Parameter provinsiId tidak valid",
          },
          Data: {
            errors: [
              {
                field: "provinsiId",
                message: "provinsiId is required",
              },
            ],
          },
          Type: "UPDATE_AREA_BONGKAR_SELECTION_ERROR",
        },
        { status: 400 }
      );
    }

    const requestBody = await req.json();
    const { cities } = requestBody;

    if (!cities || !Array.isArray(cities)) {
      return NextResponse.json(
        {
          Message: {
            Code: 400,
            Text: "Data kota/kabupaten tidak valid",
          },
          Data: {
            errors: [
              {
                field: "cities",
                message: "cities must be an array",
              },
            ],
          },
          Type: "UPDATE_AREA_BONGKAR_SELECTION_ERROR",
        },
        { status: 400 }
      );
    }

    const selectedCities = cities.filter((city) => city.isSelected);
    if (selectedCities.length === 0) {
      return NextResponse.json(mockUpdateAreaBongkarError, {
        status: mockUpdateAreaBongkarError.Message.Code,
      });
    }

    const provinceName =
      provinceNameMapping[parseInt(provinsiId)] || "Provinsi";
    const selectedCount = selectedCities.length;
    const totalCount = cities.length;
    const isAllSelected = selectedCount === totalCount;

    const response = {
      ...mockUpdateAreaBongkarSuccess,
      Data: {
        ...mockUpdateAreaBongkarSuccess.Data,
        provinsiId,
        provinsiName: provinceName,
        selectedCount,
        totalCount,
        isAllSelected,
      },
    };

    // Area bongkar selection updated successfully

    return NextResponse.json(response, {
      status: response.Message.Code,
    });
  } catch {
    // Error logged for debugging
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}

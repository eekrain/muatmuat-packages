import { NextResponse } from "next/server";

import {
  errorResponse,
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

    // Parse URL search parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    // Mock validation logic
    if (search && search.length > 0 && search.length < 3) {
      return NextResponse.json(errorResponse, {
        status: errorResponse.Message.Code,
      });
    }

    // Validate status parameter
    const validStatuses = [
      "ACTIVE",
      "NON_ACTIVE",
      "PENDING_VERIFICATION",
      "VERIFICATION_REJECTED",
      "Aktif",
      "Non Aktif",
      "Dalam Verifikasi",
      "Verifikasi Ditolak",
    ];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          ...errorResponse,
          Data: {
            errors: [
              {
                field: "status",
                message: "Status tidak valid",
              },
            ],
          },
        },
        {
          status: errorResponse.Message.Code,
        }
      );
    }

    // Validate page and limit
    if (page < 1 || limit < 1) {
      return NextResponse.json(
        {
          ...errorResponse,
          Data: {
            errors: [
              {
                field: "pagination",
                message: "Page dan limit harus lebih besar dari 0",
              },
            ],
          },
        },
        {
          status: errorResponse.Message.Code,
        }
      );
    }

    // Mock filtering based on search and status
    let filteredTransporters = [...successResponse.Data.transporters];

    if (search) {
      filteredTransporters = filteredTransporters.filter(
        (transporter) =>
          transporter.companyName
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          transporter.picName.toLowerCase().includes(search.toLowerCase()) ||
          transporter.companyEmail.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      // Map UI status to API status for filtering
      const uiToApiStatus = {
        Aktif: "ACTIVE",
        "Non Aktif": "NON_ACTIVE",
        "Dalam Verifikasi": "PENDING_VERIFICATION",
        "Verifikasi Ditolak": "VERIFICATION_REJECTED",
      };

      const apiStatus = uiToApiStatus[status] || status;
      filteredTransporters = filteredTransporters.filter(
        (transporter) => transporter.status === apiStatus
      );
    }

    // Mock sorting
    filteredTransporters.sort((a, b) => {
      let aValue = a[sort];
      let bValue = b[sort];

      if (sort === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (order === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Mock pagination
    const totalItems = filteredTransporters.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransporters = filteredTransporters.slice(
      startIndex,
      endIndex
    );

    // Transform data to match UI expectations
    const transformedTransporters = paginatedTransporters.map((transporter) => {
      // Map API status to UI status
      const statusMapping = {
        ACTIVE: "Aktif",
        NON_ACTIVE: "Non Aktif",
        PENDING_VERIFICATION: "Dalam Verifikasi",
        VERIFICATION_REJECTED: "Verifikasi Ditolak",
      };

      return {
        ...transporter,
        // Map API fields to UI expected fields
        email: transporter.companyEmail,
        address: transporter.companyAddress,
        picPhone: transporter.picPhone, // Return raw phone number
        status: statusMapping[transporter.status] || transporter.status,
      };
    });

    // Create paginated response
    const response = {
      ...successResponse,
      Data: {
        transporters: transformedTransporters,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalItems,
          itemsPerPage: limit,
        },
      },
    };

    return NextResponse.json(response, {
      status: response.Message.Code,
    });
  } catch {
    return NextResponse.json(serverErrorResponse, {
      status: 500,
    });
  }
}

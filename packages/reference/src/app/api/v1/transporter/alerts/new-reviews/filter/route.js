import { NextResponse } from "next/server";

const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export async function POST(req) {
  try {
    if (useMockData) {
      // Simulate network delay
      await new Promise((res) => setTimeout(res, 1000));

      const body = await req.json();
      const { filters } = body;

      // Validate request body
      if (!filters || typeof filters !== "object") {
        return NextResponse.json(
          {
            Message: {
              Code: 400,
              Text: "Invalid request body. Filters object is required",
            },
          },
          { status: 400 }
        );
      }

      const { rating, period, dateFrom, dateTo } = filters;

      // Validate rating filter
      if (rating && !Array.isArray(rating)) {
        return NextResponse.json(
          {
            Message: {
              Code: 400,
              Text: "Invalid rating filter. Must be an array of numbers",
            },
          },
          { status: 400 }
        );
      }

      if (
        rating &&
        rating.some((r) => typeof r !== "number" || r < 1 || r > 5)
      ) {
        return NextResponse.json(
          {
            Message: {
              Code: 400,
              Text: "Invalid rating values. Must be numbers between 1 and 5",
            },
          },
          { status: 400 }
        );
      }

      // Validate period filter
      const validPeriods = ["today", "week", "month", "custom"];
      if (period && !validPeriods.includes(period)) {
        return NextResponse.json(
          {
            Message: {
              Code: 400,
              Text: "Invalid period. Must be today, week, month, or custom",
            },
          },
          { status: 400 }
        );
      }

      // Validate date range for custom period
      if (period === "custom" && (!dateFrom || !dateTo)) {
        return NextResponse.json(
          {
            Message: {
              Code: 400,
              Text: "dateFrom and dateTo are required when period is custom",
            },
          },
          { status: 400 }
        );
      }

      if (dateFrom && dateTo) {
        const startDate = new Date(dateFrom);
        const endDate = new Date(dateTo);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return NextResponse.json(
            {
              Message: {
                Code: 400,
                Text: "Invalid date format. Use YYYY-MM-DD format",
              },
            },
            { status: 400 }
          );
        }

        if (startDate > endDate) {
          return NextResponse.json(
            {
              Message: {
                Code: 400,
                Text: "dateFrom must be before or equal to dateTo",
              },
            },
            { status: 400 }
          );
        }
      }

      // Mock filtered results
      const mockFilteredReviews = [
        {
          id: "rv_001",
          orderNumber: "ORD-2025-001",
          driverName: "Ahmad Santoso",
          rating: 5,
          reviewText: "Driver sangat profesional dan tepat waktu",
          reviewDate: "2025-01-15T10:30:00Z",
          shipperName: "PT. Logistik Prima",
        },
        {
          id: "rv_002",
          orderNumber: "ORD-2025-002",
          driverName: "Budi Hartono",
          rating: 4,
          reviewText: "Pelayanan baik, pengiriman aman",
          reviewDate: "2025-01-20T14:15:00Z",
          shipperName: "CV. Mandiri Jaya",
        },
      ];

      // Build applied filters array
      const appliedFilters = [];

      if (rating && rating.length > 0) {
        appliedFilters.push({
          type: "rating",
          values: rating,
          label:
            rating.length === 1
              ? `Rating ${rating[0]}`
              : `Rating ${rating.sort().join(", ")}`,
          removable: true,
        });
      }

      if (period && period !== "all") {
        let periodLabel = "";
        switch (period) {
          case "today":
            periodLabel = "Hari Ini";
            break;
          case "week":
            periodLabel = "Minggu Ini";
            break;
          case "month":
            periodLabel = "Bulan Ini";
            break;
          case "custom":
            if (dateFrom && dateTo) {
              const startDate = new Date(dateFrom);
              const endDate = new Date(dateTo);
              periodLabel = `${startDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })} - ${endDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}`;
            }
            break;
        }

        if (periodLabel) {
          appliedFilters.push({
            type: "period",
            value: period,
            label: periodLabel,
            removable: true,
          });
        }
      }

      const response = {
        Message: {
          Code: 200,
          Text: "Filter applied successfully",
        },
        Data: {
          reviews: mockFilteredReviews,
          filterState: {
            filtersActive: appliedFilters.length > 0,
            appliedFilters: appliedFilters,
            clearAllFilters: {
              visible: appliedFilters.length > 0,
              text: "Hapus Semua Filter",
            },
          },
        },
        Type: "NEW_REVIEWS_FILTER_FOUND",
      };

      return NextResponse.json(response, { status: 200 });
    }

    // Production API call would go here
    return NextResponse.json(
      {
        Message: {
          Code: 501,
          Text: "Production API not implemented yet",
        },
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        Message: {
          Code: 500,
          Text: "Internal server error",
        },
      },
      { status: 500 }
    );
  }
}

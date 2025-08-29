import { NextResponse } from "next/server";

import mockData from "./mockData";

const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export async function GET(req) {
  try {
    if (useMockData) {
      // Simulate network delay
      await new Promise((res) => setTimeout(res, 1000));

      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const search = searchParams.get("search") || "";
      const rating = searchParams.get("rating") || "all";
      const period = searchParams.get("period") || "all";
      const dateFrom = searchParams.get("dateFrom");
      const dateTo = searchParams.get("dateTo");
      const sort = searchParams.get("sort") || "createdAt";
      const order = searchParams.get("order") || "desc";

      // Validate pagination parameters
      if (page < 1 || limit < 1 || ![10, 20, 40].includes(limit)) {
        return NextResponse.json(
          {
            Message: {
              Code: 400,
              Text: "Invalid pagination parameters. Page must be >= 1 and limit must be 10, 20, or 40",
            },
          },
          { status: 400 }
        );
      }

      // Validate search parameter length
      if (search && search.length < 3) {
        return NextResponse.json(
          {
            Message: {
              Code: 400,
              Text: "Search query must be at least 3 characters",
            },
          },
          { status: 400 }
        );
      }

      // Validate rating parameter
      const validRatings = ["1", "2", "3", "4", "5", "all"];
      if (!validRatings.includes(rating)) {
        return NextResponse.json(
          {
            Message: {
              Code: 400,
              Text: "Invalid rating parameter. Must be 1, 2, 3, 4, 5, or all",
            },
          },
          { status: 400 }
        );
      }

      // Validate period parameter
      const validPeriods = ["today", "week", "month", "all"];
      if (!validPeriods.includes(period)) {
        return NextResponse.json(
          {
            Message: {
              Code: 400,
              Text: "Invalid period parameter. Must be today, week, month, or all",
            },
          },
          { status: 400 }
        );
      }

      // Validate sort parameter
      const validSortFields = ["createdAt", "rating", "driverName"];
      if (!validSortFields.includes(sort)) {
        return NextResponse.json(
          {
            Message: {
              Code: 400,
              Text: "Invalid sort parameter. Must be createdAt, rating, or driverName",
            },
          },
          { status: 400 }
        );
      }

      // Validate order parameter
      if (!["asc", "desc"].includes(order)) {
        return NextResponse.json(
          {
            Message: {
              Code: 400,
              Text: "Invalid order parameter. Must be asc or desc",
            },
          },
          { status: 400 }
        );
      }

      let filteredData = [...mockData.reviews];

      // Apply search filter
      if (search) {
        const lowercasedSearch = search.toLowerCase();
        filteredData = filteredData.filter(
          (review) =>
            review.orderNumber.toLowerCase().includes(lowercasedSearch) ||
            review.driverName.toLowerCase().includes(lowercasedSearch) ||
            review.shipperName.toLowerCase().includes(lowercasedSearch)
        );
      }

      // Apply rating filter
      if (rating !== "all") {
        const ratingValue = parseInt(rating);
        filteredData = filteredData.filter(
          (review) => review.rating === ratingValue
        );
      }

      // Apply period filter
      if (period !== "all" || (dateFrom && dateTo)) {
        const now = new Date();
        let startDate, endDate;

        if (dateFrom && dateTo) {
          startDate = new Date(dateFrom);
          endDate = new Date(dateTo);
          endDate.setHours(23, 59, 59, 999);
        } else {
          switch (period) {
            case "today":
              startDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
              );
              endDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23,
                59,
                59,
                999
              );
              break;
            case "week":
              startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              endDate = now;
              break;
            case "month":
              startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              endDate = now;
              break;
          }
        }

        if (startDate && endDate) {
          filteredData = filteredData.filter((review) => {
            const reviewDate = new Date(review.reviewDate);
            return reviewDate >= startDate && reviewDate <= endDate;
          });
        }
      }

      // Apply sorting
      filteredData.sort((a, b) => {
        let valueA, valueB;

        switch (sort) {
          case "createdAt":
            valueA = new Date(a.reviewDate);
            valueB = new Date(b.reviewDate);
            break;
          case "rating":
            valueA = a.rating;
            valueB = b.rating;
            break;
          case "driverName":
            valueA = a.driverName.toLowerCase();
            valueB = b.driverName.toLowerCase();
            break;
          default:
            valueA = new Date(a.reviewDate);
            valueB = new Date(b.reviewDate);
        }

        if (order === "asc") {
          return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
          return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
      });

      // Calculate pagination
      const totalItems = filteredData.length;
      const totalPages = Math.ceil(totalItems / limit);
      const paginatedData = filteredData.slice(
        (page - 1) * limit,
        page * limit
      );

      // Build response
      const response = {
        Message: {
          Code: 200,
          Text: "New reviews retrieved successfully",
        },
        Data: {
          reviews: paginatedData,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit,
          },
          summary: {
            totalNewReviews: mockData.summary.totalNewReviews,
            averageRating: mockData.summary.averageRating,
            ratingDistribution: mockData.summary.ratingDistribution,
          },
        },
        Type: "NEW_REVIEWS_LIST",
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

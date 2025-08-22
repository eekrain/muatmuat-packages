import { NextResponse } from "next/server";

import { fetcherMuatrans } from "@/lib/axios";

import { baseReviews, successShell } from "./mockData";

const isMockReviews = true;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const rawSearch = searchParams.get("search") || "";
    const rawSort = searchParams.get("sort");
    const order = searchParams.get("order");
    const pageRaw = parseInt(searchParams.get("page") || "1", 10);
    const limitRaw = parseInt(searchParams.get("limit") || "10", 10);
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
    const limit = Number.isFinite(limitRaw)
      ? Math.min(Math.max(limitRaw, 1), 100)
      : 10;
    const ratingFilters = searchParams
      .getAll("ratingFilter")
      .map((n) => Number(n))
      .filter((n) => Number.isFinite(n) && n >= 1 && n <= 5);
    const transporterFilters = searchParams.getAll("transporterFilter");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    if (isMockReviews) {
      let filteredData = [...baseReviews];
      if (dateFrom && dateTo) {
        const startDate = new Date(dateFrom);
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        filteredData = filteredData.filter(
          (item) =>
            new Date(item.date) >= startDate && new Date(item.date) <= endDate
        );
      }
      if (rawSearch) {
        filteredData = filteredData.filter(
          (item) =>
            item.orderNumber.toLowerCase().includes(rawSearch.toLowerCase()) ||
            item.driver.name.toLowerCase().includes(rawSearch.toLowerCase()) ||
            item.transporter.name
              .toLowerCase()
              .includes(rawSearch.toLowerCase())
        );
      }
      if (ratingFilters.length > 0) {
        filteredData = filteredData.filter((item) =>
          ratingFilters.includes(Math.floor(item.rating))
        );
      }
      if (transporterFilters.length > 0) {
        filteredData = filteredData.filter((item) =>
          transporterFilters.includes(item.transporter.id)
        );
      }

      const totalRatingSum = filteredData.reduce(
        (sum, item) => sum + item.rating,
        0
      );
      const averageRating =
        filteredData.length > 0 ? totalRatingSum / filteredData.length : 0;

      const sort = rawSort;
      if (sort && order) {
        filteredData.sort((a, b) => {
          const valA = a[sort];
          const valB = b[sort];
          if (order === "asc") return valA > valB ? 1 : -1;
          return valA < valB ? 1 : -1;
        });
      }

      const totalItems = filteredData.length;
      const paginatedData = filteredData.slice(
        (page - 1) * limit,
        page * limit
      );

      const response = { ...successShell };
      response.Data = {
        reviews: paginatedData,
        summary: {
          averageRating: averageRating.toFixed(1),
          newCount: 0,
          readCount: 0,
        },
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          itemsPerPage: limit,
        },
      };

      if (totalItems === 0) {
        response.Data.emptyState = {
          title: rawSearch ? "Keyword Tidak Ditemukan" : "Data Tidak Ditemukan",
          subtitle: rawSearch ? "" : "Mohon coba hapus beberapa filter",
        };
      }

      return NextResponse.json(response, { status: 200 });
    }

    const backendParams = new URLSearchParams();
    backendParams.append("page", String(page));
    backendParams.append("limit", String(limit));

    //Search transporter filter
    if (rawSearch && rawSearch.trim().length >= 3) {
      backendParams.append("search", rawSearch.trim());
    }

    //Multiple filter combinations
    ratingFilters.forEach((r) => {
      if (!Number.isNaN(r)) backendParams.append("ratingFilter", String(r));
    });
    transporterFilters.forEach((t) => {
      if (t) backendParams.append("transporterFilter", t);
    });

    //Period filter combinations
    if (dateFrom && dateTo) {
      backendParams.append("periodFilter", "custom");
      backendParams.append("startDate", dateFrom);
      backendParams.append("endDate", dateTo);
    } else {
      // Default period per contract: today
      backendParams.append("periodFilter", "today");
    }

    const sortMap = {
      date: "rated_at",
      rating: "rating",
      orderNumber: "order_code",
      transporter: "transporter_name", // Add mapping for transporter sort
    };
    const mappedSort = rawSort ? sortMap[rawSort] || "rated_at" : "rated_at";
    backendParams.append("sort", mappedSort);
    const normalizedOrder =
      order === "asc" || order === "desc" ? order : "desc";
    backendParams.append("order", normalizedOrder);

    const url = `/v1/cs/reviews${backendParams.toString() ? `?${backendParams.toString()}` : ""}`;

    // Forward auth headers from incoming request (if any)
    const incomingAuth = req.headers.get("authorization");
    const config = incomingAuth
      ? { headers: { Authorization: incomingAuth } }
      : undefined;

    const result = await fetcherMuatrans.get(url, config);
    const data = result?.data;

    const apiData = data?.Data || {};
    const apiReviews = Array.isArray(apiData.reviews) ? apiData.reviews : [];
    const mappedReviews = apiReviews.map((item) => {
      const orderInfo = item.orderInfo || {};
      const driver = item.driver || {};
      const transporter = item.transporter || {};
      const fleet = item.fleet || {};
      return {
        id: item.id,
        date: item.ratedAt || item.rated_at || item.date,
        orderNumber:
          orderInfo.orderCode || item.orderCode || orderInfo.order_code,
        transporter: {
          id: transporter.id,
          name: transporter.companyName || transporter.name,
          logo: transporter.logo || "/img/seller-logo.png",
        },
        driver: {
          name: driver.name,
          licensePlate: fleet.licensePlate || driver.licensePlate,
        },
        rating: item.rating,
        review: item.review,
        status: item.status || "new",
      };
    });

    const pagination = apiData.pagination || {};
    const statistics = apiData.statistics || {};

    const response = { ...successShell };
    response.Data = {
      reviews: mappedReviews,
      summary: {
        averageRating: Number(statistics.averageRating || 0).toFixed(1),
        newCount: 0,
        readCount: 0,
      },
      pagination: {
        currentPage: pagination.currentPage || page,
        totalPages: pagination.totalPages || 1,
        totalItems: pagination.totalItems || mappedReviews.length || 0,
        itemsPerPage: pagination.itemsPerPage || limit,
      },
    };

    //Empty state handling for all combinations
    if ((response.Data.pagination.totalItems || 0) === 0) {
      const hasSearch = rawSearch && rawSearch.trim().length >= 3;
      const hasFilters =
        ratingFilters.length > 0 || transporterFilters.length > 0;
      const hasCustomPeriod = dateFrom && dateTo;

      let title = "Data Tidak Ditemukan";
      let subtitle = "Mohon coba hapus beberapa filter";

      if (hasSearch && hasFilters && hasCustomPeriod) {
        //Complex combination empty state
        title = "Kombinasi Filter Kompleks Tidak Ditemukan";
        subtitle = "Coba ubah periode, kata kunci, atau filter yang dipilih";
      } else if (hasSearch && hasCustomPeriod) {
        // Period + search empty state
        title = "Kombinasi Periode & Search Tidak Ditemukan";
        subtitle = "Coba ubah periode atau kata kunci pencarian";
      } else if (hasCustomPeriod) {
        //Period filter empty state
        title = "Periode Diterapkan Tidak Ada Data";
        subtitle = "Coba pilih periode yang berbeda";
      } else if (hasSearch && hasFilters) {
        //Search + filter empty state
        title = "Kombinasi Filter & Search Tidak Ditemukan";
        subtitle = "Coba ubah kata kunci atau filter yang dipilih";
      } else if (hasFilters) {
        //Filter empty state
        title = "Filter Data Tidak Ditemukan";
        subtitle = "Coba ubah filter yang dipilih";
      } else if (hasSearch) {
        // Search empty state
        title = "Keyword Tidak Ditemukan";
        subtitle = "Coba ubah kata kunci pencarian";
      }

      response.Data.emptyState = { title, subtitle };
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const status = error?.response?.status || 500;
    const message =
      error?.response?.data?.Message?.Text ||
      error?.message ||
      "Internal Server Error";
    const code = error?.response?.data?.Message?.Code || status;
    return NextResponse.json(
      { Message: { Code: code, Text: message } },
      { status }
    );
  }
}

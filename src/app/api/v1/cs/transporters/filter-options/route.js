// app/api/v1/cs/transporters/filter-options/route.js
import { NextResponse } from "next/server";

import { fetcherMuatrans } from "@/lib/axios";

const isMockTransporterFilterOptions = true;

const allTransporters = [
  { id: "TPT_001", label: "PT. Logistik Cepat" },
  { id: "TPT_002", label: "PT Global Express Logistics" },
  { id: "TPT_003", label: "PT Nusantara Cargo Solutions" },
  { id: "TPT_004", label: "PT Swift Transport Indonesia" },
  { id: "TPT_005", label: "PT. Solusi Distribusi" },
  { id: "TPT_006", label: "PT Mega Freight Services" },
];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const rawSearch = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    if (isMockTransporterFilterOptions) {
      let filteredData = allTransporters;
      if (rawSearch) {
        filteredData = allTransporters.filter((t) =>
          t.label.toLowerCase().includes(rawSearch.toLowerCase())
        );
      }
      return NextResponse.json(
        { data: filteredData.slice(0, Math.max(1, Math.min(limit, 100))) },
        { status: 200 }
      );
    }

    const backendParams = new URLSearchParams();
    //Transporter search with hover submenu support
    if (rawSearch && rawSearch.trim().length >= 3) {
      backendParams.append("search", rawSearch.trim());
    }
    if (limit) backendParams.append("limit", String(Math.min(limit, 100)));
    backendParams.append("activeOnly", "true");

    const url = `/v1/cs/transporters/filter-options${
      backendParams.toString() ? `?${backendParams.toString()}` : ""
    }`;

    // Forward auth header if present
    const incomingAuth = req.headers.get("authorization");
    const config = incomingAuth
      ? { headers: { Authorization: incomingAuth } }
      : undefined;
    const result = await fetcherMuatrans.get(url, config);
    const data = result?.data;
    const transporters = data?.Data?.transporters || [];
    const mapped = transporters.map((t) => ({
      id: t.id,
      label: t.companyName,
    }));

    //Search not found
    const resultData = mapped.slice(0, Math.max(1, Math.min(limit, 100)));

    return NextResponse.json(
      {
        data: resultData,
        // Add metadata for hover submenu
        metadata: {
          totalCount: mapped.length,
          hasResults: resultData.length > 0,
          searchTerm: rawSearch || null,
        },
      },
      { status: 200 }
    );
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

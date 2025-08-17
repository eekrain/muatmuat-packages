// app/api/v1/cs/transporters/filter-options/route.js
import { NextResponse } from "next/server";

const allTransporters = [
  { id: "TPT_001", label: "PT. Logistik Cepat" },
  { id: "TPT_002", label: "PT Global Express Logistics" },
  { id: "TPT_003", label: "PT Nusantara Cargo Solutions" },
  { id: "TPT_004", label: "PT Swift Transport Indonesia" },
  { id: "TPT_005", label: "PT. Solusi Distribusi" },
  { id: "TPT_006", label: "PT Mega Freight Services" },
];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  let filteredData = allTransporters;
  if (search) {
    filteredData = allTransporters.filter((t) =>
      t.label.toLowerCase().includes(search.toLowerCase())
    );
  }

  return NextResponse.json({ data: filteredData }, { status: 200 });
}

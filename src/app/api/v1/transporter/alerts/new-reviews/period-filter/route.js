import { NextResponse } from "next/server";

const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export async function GET(req) {
  try {
    if (useMockData) {
      // Simulate network delay
      await new Promise((res) => setTimeout(res, 500));

      const response = {
        Message: { Code: 200, Text: "Period filter options retrieved" },
        Data: {
          periodOptions: [
            { value: "today", label: "Hari Ini", selected: false },
            { value: "week", label: "Minggu Ini", selected: false },
            { value: "month", label: "Bulan Ini", selected: false },
            { value: "custom", label: "Pilih Periode", selected: false },
          ],
          customPeriodModal: {
            title: "Pilih Periode",
            startDatePlaceholder: "Pilih tanggal mulai",
            endDatePlaceholder: "Pilih tanggal akhir",
            applyButtonText: "Terapkan",
            cancelButtonText: "Batal",
          },
        },
        Type: "PERIOD_FILTER_OPTIONS",
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

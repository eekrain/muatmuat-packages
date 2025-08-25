import { NextResponse } from "next/server";

import { documentStatusData } from "./mockData";

export async function GET(request, { params }) {
  const { orderId } = params;

  if (!orderId) {
    return NextResponse.json(
      {
        Message: {
          Code: 400,
          Text: "Parameter orderId diperlukan",
        },
        Data: {
          errors: [
            {
              field: "orderId",
              message: "ID pesanan tidak boleh kosong",
            },
          ],
        },
        Type: "DOCUMENT_STATUS_ERROR",
      },
      { status: 400 }
    );
  }

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const data = documentStatusData[orderId];

    if (!data) {
      return NextResponse.json(
        {
          Message: {
            Code: 404,
            Text: "Status dokumen tidak ditemukan",
          },
          Data: {
            errors: [
              {
                field: "orderId",
                message:
                  "ID pesanan tidak valid atau status dokumen tidak ditemukan",
              },
            ],
          },
          Type: "DOCUMENT_STATUS_ERROR",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      Message: {
        Code: 200,
        Text: "Status dokumen berhasil diambil",
      },
      Data: data,
      Type: "DOCUMENT_STATUS_SUCCESS",
    });
  } catch (error) {
    console.error("Error fetching document status:", error);

    return NextResponse.json(
      {
        Message: {
          Code: 500,
          Text: "Terjadi kesalahan internal server",
        },
        Data: {
          errors: [
            {
              field: "system",
              message: "Gagal mengambil status dokumen",
            },
          ],
        },
        Type: "DOCUMENT_STATUS_ERROR",
      },
      { status: 500 }
    );
  }
}

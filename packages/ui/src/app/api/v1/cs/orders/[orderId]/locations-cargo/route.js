import { NextResponse } from "next/server";

import { locationsCargoDData } from "./mockData";

export async function GET(request, { params }) {
  const { orderId } = params;
  const { searchParams } = new URL(request.url);
  const includePhotos = searchParams.get("includePhotos") !== "false"; // default true
  const photoResolution = searchParams.get("photoResolution") || "medium";

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
        Type: "LOCATIONS_CARGO_ERROR",
      },
      { status: 400 }
    );
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const orderData = locationsCargoDData.find(
      (order) => order.orderId === orderId
    );

    if (!orderData) {
      return NextResponse.json(
        {
          Message: {
            Code: 404,
            Text: "Pesanan tidak ditemukan",
          },
          Data: {
            errors: [
              {
                field: "orderId",
                message: "ID pesanan tidak valid atau pesanan tidak ditemukan",
              },
            ],
          },
          Type: "LOCATIONS_CARGO_ERROR",
        },
        { status: 404 }
      );
    }

    // Filter photos based on includePhotos parameter
    const responseData = { ...orderData };
    if (!includePhotos) {
      responseData.cargo = responseData.cargo.map((cargo) => ({
        ...cargo,
        photos: [],
      }));
    } else if (photoResolution === "thumbnail") {
      responseData.cargo = responseData.cargo.map((cargo) => ({
        ...cargo,
        photos: cargo.photos.map((photo) => ({
          ...photo,
          photoUrl: photo.thumbnailUrl,
        })),
      }));
    }

    return NextResponse.json({
      Message: {
        Code: 200,
        Text: "Informasi lokasi dan muatan berhasil diambil",
      },
      Data: responseData,
      Type: "LOCATIONS_CARGO_SUCCESS",
    });
  } catch (error) {
    console.error("Error fetching order locations and cargo:", error);

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
              message: "Gagal mengambil informasi lokasi dan muatan",
            },
          ],
        },
        Type: "LOCATIONS_CARGO_ERROR",
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

import { orderDetailData } from "./mockData";

export async function GET(request, { params }) {
  const { orderId } = params;
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || "direct";

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
        Type: "ORDER_DETAIL_ERROR",
      },
      { status: 400 }
    );
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const orderData = orderDetailData.find(
      (order) => order.orderDetail.orderId === orderId
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
          Type: "ORDER_DETAIL_ERROR",
        },
        { status: 404 }
      );
    }

    const responseData = {
      ...orderData,
      source: source,
    };

    return NextResponse.json({
      Message: {
        Code: 200,
        Text: "Detail pesanan berhasil diambil",
      },
      Data: responseData,
      Type: "ORDER_DETAIL_SUCCESS",
    });
  } catch (error) {
    console.error("Error fetching order detail:", error);

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
              message: "Gagal mengambil detail pesanan",
            },
          ],
        },
        Type: "ORDER_DETAIL_ERROR",
      },
      { status: 500 }
    );
  }
}

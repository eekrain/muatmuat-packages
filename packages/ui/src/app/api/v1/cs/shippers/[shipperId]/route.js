import { NextResponse } from "next/server";

import { successResponse } from "../mockData";

export async function GET(req, { params }) {
  const shipperId = (await params).shipperId;
  const shipper = successResponse.Data.shippers.find((s) => s.id === shipperId);
  if (!shipper) {
    return NextResponse.json({
      Message: { Code: 404, Text: "Shipper tidak ditemukan" },
      Data: { errors: [{ field: "id", message: "Shipper tidak ditemukan" }] },
      Type: "GET_SHIPPER_DETAILS_ERROR",
    });
  }
  const response = {
    Message: {
      Code: 200,
      Text: "Detail shipper berhasil diambil",
    },
    Data: shipper,
    Type: "GET_SHIPPER_DETAILS",
  };
  return NextResponse.json(response);
}

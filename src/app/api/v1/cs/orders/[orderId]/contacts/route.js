import { NextResponse } from "next/server";

import { contactsData } from "./mockData";

export async function GET(request, { params }) {
  const { orderId } = params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";

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
        Type: "CONTACT_INFO_ERROR",
      },
      { status: 400 }
    );
  }

  const validTypes = ["all", "shipper", "transporter"];
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      {
        Message: {
          Code: 400,
          Text: "Parameter type tidak valid",
        },
        Data: {
          errors: [
            {
              field: "type",
              message:
                "Tipe kontak harus berupa: all, shipper, atau transporter",
            },
          ],
        },
        Type: "CONTACT_INFO_ERROR",
      },
      { status: 400 }
    );
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const contactData = contactsData.find(
      (contact) => contact.orderId === orderId
    );

    if (!contactData) {
      return NextResponse.json(
        {
          Message: {
            Code: 404,
            Text: "Informasi kontak pesanan tidak ditemukan",
          },
          Data: {
            errors: [
              {
                field: "orderId",
                message:
                  "ID pesanan tidak valid atau informasi kontak tidak ditemukan",
              },
            ],
          },
          Type: "CONTACT_INFO_ERROR",
        },
        { status: 404 }
      );
    }

    const responseData = {};

    if (type === "all" || type === "shipper") {
      responseData.shipperContact = contactData.shipperContact;
    }

    if (type === "all" || type === "transporter") {
      responseData.transporterContacts = contactData.transporterContacts;
    }

    return NextResponse.json({
      Message: {
        Code: 200,
        Text: "Informasi kontak berhasil diambil",
      },
      Data: responseData,
      Type: "CONTACT_INFO_SUCCESS",
    });
  } catch (error) {
    console.error("Error fetching contact information:", error);

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
              message: "Gagal mengambil informasi kontak",
            },
          ],
        },
        Type: "CONTACT_INFO_ERROR",
      },
      { status: 500 }
    );
  }
}

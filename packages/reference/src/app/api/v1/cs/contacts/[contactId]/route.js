import { NextResponse } from "next/server";

import { contactData } from "./mockData";

export async function GET(request, { params }) {
  const { contactId } = await params;

  const data = contactData[contactId];

  if (!data) {
    return NextResponse.json(
      { Message: { Code: 404, Text: "Contact not found" } },
      { status: 404 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 100));

  return NextResponse.json({
    Message: { Code: 200, Text: "Contact retrieved" },
    Data: data,
  });
}

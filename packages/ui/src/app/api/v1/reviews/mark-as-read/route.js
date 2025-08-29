import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { reviewIds } = body;

    if (!reviewIds || !Array.isArray(reviewIds) || reviewIds.length === 0) {
      return NextResponse.json(
        { Message: { Code: 400, Text: "Bad Request: reviewIds is required." } },
        { status: 400 }
      );
    }
    console.log("Marking reviews as read:", reviewIds);

    await new Promise((res) => setTimeout(res, 500)); // Simulate DB update

    return NextResponse.json(
      { Message: { Code: 200, Text: "Ulasan berhasil ditandai sudah dibaca" } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { Message: { Code: 500, Text: "Internal Server Error" } },
      { status: 500 }
    );
  }
}

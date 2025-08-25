import { NextResponse } from "next/server";

const mockReviewsData = {
  "REV-2025-001": {
    id: "REV-2025-001",
    fullText:
      "Driver sangat profesional dan barang sampai dengan selamat. Terima kasih atas pelayanan yang memuaskan!",
    shortText: "Driver sangat profesional dan barang…",
  },
  "REV-2025-002": {
    id: "REV-2025-002",
    fullText:
      "Pengiriman cepat dan aman, driver ramah dan komunikatif. Sangat puas dengan layanan yang diberikan.",
    shortText: "Pengiriman cepat dan aman, driver ramah…",
  },
};

export async function PUT(req, { params }) {
  try {
    const { reviewId } = params;
    const body = await req.json();
    const { isExpanded } = body;

    if (!reviewId) {
      return NextResponse.json(
        {
          Message: {
            Code: 400,
            Text: "Bad Request: reviewId is required.",
          },
        },
        { status: 400 }
      );
    }

    if (typeof isExpanded !== "boolean") {
      return NextResponse.json(
        {
          Message: {
            Code: 400,
            Text: "Bad Request: isExpanded must be a boolean.",
          },
        },
        { status: 400 }
      );
    }

    await new Promise((res) => setTimeout(res, 300));

    const reviewData = mockReviewsData[reviewId];
    if (!reviewData) {
      return NextResponse.json(
        {
          Message: {
            Code: 404,
            Text: "Review not found.",
          },
        },
        { status: 404 }
      );
    }

    const responseData = {
      reviewId: reviewId,
      isExpanded: isExpanded,
      fullText: reviewData.fullText,
      shortText: reviewData.shortText,
      actionText: isExpanded ? "Sembunyikan" : "Lihat Selengkapnya",
    };

    return NextResponse.json(
      {
        Message: {
          Code: 200,
          Text: "Review text expanded successfully",
        },
        Data: responseData,
        Type: "REVIEW_TEXT_EXPANDED",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        Message: {
          Code: 500,
          Text: "Internal Server Error",
        },
      },
      { status: 500 }
    );
  }
}

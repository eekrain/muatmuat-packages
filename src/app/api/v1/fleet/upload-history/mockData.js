export const successResponse = {
  Message: {
    Code: 200,
    Text: "Upload history retrieved successfully",
  },
  Data: {
    history: [
      {
        id: "12345678-1234-1234-1234-123456789012", // [dbt_mt_fleet_bulk_import.id]
        originalFileName: "Data Armada Januari 2025.xlsx", // [dbt_mt_fleet_bulk_import.originalFileName]
        status: "COMPLETED", // [dbt_mt_fleet_bulk_import.status]
        uploadedAt: "2025-01-15T10:30:00Z", // [dbt_mt_fleet_bulk_import.createdAt]
        uploadBy: "Sutris",
        fileReport:
          "https://s3.amazonaws.com/bucket/reports/fleet-report-12345678.xlsx",
      },
      {
        id: "87654321-4321-4321-4321-210987654321",
        originalFileName: "Data Armada Februari 2025.xlsx",
        status: "COMPLETED",
        uploadedAt: "2025-02-10T14:20:00Z",
        uploadBy: "Ahmad Wijaya",
        fileReport:
          "https://s3.amazonaws.com/bucket/reports/fleet-report-87654321.xlsx",
      },
      {
        id: "11111111-1111-1111-1111-111111111111",
        originalFileName: "Fleet Data Batch 3.xlsx",
        status: "FAILED",
        uploadedAt: "2025-02-08T09:15:00Z",
        uploadBy: "Siti Nurhaliza",
        fileReport:
          "https://s3.amazonaws.com/bucket/reports/fleet-report-11111111.xlsx",
      },
      {
        id: "22222222-2222-2222-2222-222222222222",
        originalFileName: "Armada Update Maret 2025.xlsx",
        status: "FAILED",
        uploadedAt: "2025-03-05T16:45:00Z",
        uploadBy: "Budi Santoso",
        fileReport: null,
      },
      {
        id: "33333333-3333-3333-3333-333333333333",
        originalFileName: "Fleet Registration Q1 2025.xlsx",
        status: "COMPLETED",
        uploadedAt: "2025-01-28T11:00:00Z",
        uploadBy: "Maya Sari",
        fileReport:
          "https://s3.amazonaws.com/bucket/reports/fleet-report-33333333.xlsx",
      },
    ],
    pagination: {
      page: 1,
      limit: 10,
      totalItems: 25,
      totalPages: 3,
      hasNext: true,
      hasPrevious: false,
    },
  },
  Type: "UPLOAD_HISTORY",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Invalid pagination parameters",
  },
  Data: {
    errors: [
      {
        field: "page",
        message: "Page number harus lebih besar dari 0",
      },
    ],
  },
  Type: "INVALID_PAGINATION",
};

export const serverErrorResponse = {
  Message: {
    Code: 500,
    Text: "Internal Server Error",
  },
  Data: {
    errors: [
      {
        field: "general",
        message: "Terjadi kesalahan pada sistem kami",
      },
    ],
  },
  Type: "INTERNAL_SERVER_ERROR",
};

export const emptyHistoryResponse = {
  Message: {
    Code: 200,
    Text: "Upload history retrieved successfully",
  },
  Data: {
    history: [],
    pagination: {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    },
  },
  Type: "UPLOAD_HISTORY",
};

// Mock data generator for upload history
export const mockUploadHistory = {
  // Generate realistic upload history data
  generateHistoryData: (totalItems = 25) => {
    const statuses = ["COMPLETED", "FAILED"];
    const uploaders = [
      "Sutris",
      "Ahmad Wijaya",
      "Siti Nurhaliza",
      "Budi Santoso",
      "Maya Sari",
      "Joko Widodo",
      "Sri Mulyani",
      "Bambang Susilo",
      "Dewi Lestari",
      "Agus Salim",
    ];
    const fileNames = [
      "Data Armada Januari 2025.xlsx",
      "Fleet Registration Q1 2025.xlsx",
      "Armada Update Februari 2025.xlsx",
      "Data Kendaraan Baru.xlsx",
      "Fleet Maintenance Report.xlsx",
      "Daftar Armada Operasional.xlsx",
      "Vehicle Registration Batch.xlsx",
      "Fleet Data Complete.xlsx",
      "Armada Terbaru 2025.xlsx",
      "Vehicle Update List.xlsx",
    ];

    const history = [];
    for (let i = 0; i < totalItems; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const uploadDate = new Date();
      uploadDate.setDate(uploadDate.getDate() - Math.floor(Math.random() * 60)); // Random date within last 60 days

      const historyItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i}`,
        originalFileName:
          fileNames[Math.floor(Math.random() * fileNames.length)],
        status: status,
        uploadedAt: uploadDate.toISOString(),
        uploadBy: uploaders[Math.floor(Math.random() * uploaders.length)],
        fileReport:
          status === "COMPLETED"
            ? null
            : `https://s3.amazonaws.com/bucket/reports/fleet-report-${i + 1}.xlsx`,
      };

      history.push(historyItem);
    }

    // Sort by upload date (newest first)
    history.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    return history;
  },

  // Paginate history data
  paginateHistory: (history, page = 1, limit = 10) => {
    const totalItems = history.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedHistory = history.slice(startIndex, endIndex);

    return {
      history: paginatedHistory,
      pagination: {
        page: page,
        limit: limit,
        totalItems: totalItems,
        totalPages: totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  },
};

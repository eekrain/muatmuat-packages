export const basePenalties = [
  {
    id: "PENALTY_001",
    cancellationDate: "2025-04-13T08:23:00Z",
    orderNumber: "MT25A001A",
    armada: {
      name: "Colt Diesel Engkel",
      carrier: "Box",
      licensePlate: "L 1234 FF",
    },
    reason: "Dibatalkan karena alasan operasional.",
  },
  {
    id: "PENALTY_002",
    cancellationDate: "2025-04-12T08:23:00Z",
    orderNumber: "MT25A002A",
    armada: {
      name: "Tractor head 6 x 4 dan Semi Trailer",
      carrier: "Flatbed Container Jumbo 45 ft (3 As)",
      licensePlate: "L 1234 AA",
    },
    reason: "Dibatalkan karena permintaan Shipper.",
  },
  {
    id: "PENALTY_003",
    cancellationDate: "2025-04-10T08:23:00Z",
    orderNumber: "MT25A003A",
    armada: {
      name: "Tractor head 6 x 4 dan Semi Trailer",
      carrier: "Flatbed Container Jumbo 45 ft (3 As)",
      licensePlate: "L 1234 AA",
    },
    reason: "Dibatalkan karena armada tidak tersedia.",
  },
  {
    id: "PENALTY_004",
    cancellationDate: "2025-03-15T10:00:00Z",
    orderNumber: "MT25B012B",
    armada: {
      name: "Colt Diesel Double",
      carrier: "Bak Terbuka",
      licensePlate: "B 9876 CDE",
    },
    reason: "Dibatalkan karena dokumen tidak lengkap.",
  },
  {
    id: "PENALTY_005",
    cancellationDate: "2025-03-01T14:00:00Z",
    orderNumber: "MT25C015C",
    armada: {
      name: "Colt Diesel Engkel",
      carrier: "Box",
      licensePlate: "D 1122 EFG",
    },
    reason: "Dibatalkan karena alasan teknis.",
  },
];

export const successShell = {
  Message: { Code: 200, Text: "Penalties retrieved successfully" },
  Data: {},
  Type: "PENALTIES_LIST",
};

export const serverErrorResponse = {
  Message: { Code: 500, Text: "Internal Server Error" },
  Data: {
    errors: [{ field: "general", message: "An unexpected error occurred." }],
  },
  Type: "INTERNAL_SERVER_ERROR",
};

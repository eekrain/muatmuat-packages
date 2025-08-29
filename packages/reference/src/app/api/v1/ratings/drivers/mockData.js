export const baseDrivers = [
  {
    id: "DRV-001",
    name: "Noel Gallagher",
    phoneNumber: "081356789012",
    rating: 5.0,
    orderCount: 1,
  },
  {
    id: "DRV-002",
    name: "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra Toldo Sasmita",
    phoneNumber: "081356789012",
    rating: 4.9,
    orderCount: 10,
  },
  {
    id: "DRV-003",
    name: "Wills Gallagher",
    phoneNumber: "081356789012",
    rating: 3.0,
    orderCount: 2,
  },
  {
    id: "DRV-004",
    name: "Devon Lane",
    phoneNumber: "081356789012",
    rating: 4.9,
    orderCount: 2,
  },
  {
    id: "DRV-005",
    name: "Arlene McCoy",
    phoneNumber: "081356789012",
    rating: 4.9,
    orderCount: 2,
  },
  {
    id: "DRV-006",
    name: "Brooklyn Simmons",
    phoneNumber: "081356789012",
    rating: 3.0,
    orderCount: 2,
  },
  {
    id: "DRV-007",
    name: "Jerome Bell",
    phoneNumber: "081356789012",
    rating: 3.0,
    orderCount: 2,
  },
  {
    id: "DRV-008",
    name: "Savannah Nguyen",
    phoneNumber: "081356789012",
    rating: 3.0,
    orderCount: 2,
  },
  {
    id: "DRV-009",
    name: "Esther Howard",
    phoneNumber: "081356789012",
    rating: 3.0,
    orderCount: 2,
  },
  {
    id: "DRV-010",
    name: "Kristin Watson",
    phoneNumber: "081356789012",
    rating: 3.0,
    orderCount: 2,
  },
  {
    id: "DRV-011",
    name: "Annette Black",
    phoneNumber: "081356789012",
    rating: 3.0,
    orderCount: 2,
  },
  {
    id: "DRV-012",
    name: "Liam Gallagher",
    phoneNumber: "081987654321",
    rating: 4.5,
    orderCount: 15,
  },
  {
    id: "DRV-013",
    name: "Damon Albarn",
    phoneNumber: "081212121212",
    rating: 4.2,
    orderCount: 8,
  },
  {
    id: "DRV-014",
    name: "Graham Coxon",
    phoneNumber: "081313131313",
    rating: 4.8,
    orderCount: 5,
  },
  {
    id: "DRV-015",
    name: "Alex James",
    phoneNumber: "081414141414",
    rating: 4.0,
    orderCount: 3,
  },
];

export const successShell = {
  Message: { Code: 200, Text: "Driver ratings retrieved successfully" },
  Data: {},
  Type: "DRIVER_RATINGS_LIST",
};

export const serverErrorResponse = {
  Message: { Code: 500, Text: "Internal Server Error" },
  Data: {
    errors: [{ field: "general", message: "An unexpected error occurred." }],
  },
  Type: "INTERNAL_SERVER_ERROR",
};

export const successResponse = {
  Message: {
    Code: 200,
    Text: "Informasi armada berhasil diambil",
  },
  Data: {
    fleetList: [
      {
        assignmentId: "assign-uuid-1",
        orderStatus: "MENUJU_KE_LOKASI_MUAT",
        vehicleId: "vehicle-uuid-1",
        vehicleInfo: {
          licensePlate: "B 1234 AB",
          vehicleType: "TRUCK",
          carrierType: "OWN",
          imageUrl: "https://via.placeholder.com/240x160.png?text=vehicle-1",
        },
        driverInfo: {
          driverId: "driver-uuid-1",
          driverName: "Andi Saputra",
          phoneNumber: "081234567890",
          licenseNumber: "SIM-123456",
          profileImage: "https://via.placeholder.com/96.png?text=driver-1",
        },
      },
      {
        assignmentId: "assign-uuid-2",
        orderStatus: "MENUNGGU_PENGAMBILAN",
        vehicleId: "vehicle-uuid-2",
        vehicleInfo: {
          licensePlate: "D 9876 ZZ",
          vehicleType: "BOX_TRUCK",
          carrierType: "THIRD_PARTY",
          imageUrl: "https://via.placeholder.com/240x160.png?text=vehicle-2",
        },
        driverInfo: {
          driverId: "driver-uuid-2",
          driverName: "Siti Nur",
          phoneNumber: "082198765432",
          licenseNumber: "SIM-654321",
          profileImage: "https://via.placeholder.com/96.png?text=driver-2",
        },
      },
    ],
    pagination: {
      totalItems: 2,
      totalPages: 1,
      currentPage: 1,
      itemsPerPage: 10,
    },
    summary: {
      totalFleetAssigned: 2,
      activeFleetCount: 2,
    },
  },
  Type: "ORDER_FLEET_INFO",
};

export const errorResponse = {
  Message: {
    Code: 400,
    Text: "Bad Request",
  },
  Data: {
    errors: [
      {
        field: "orderId",
        message: "Invalid orderId",
      },
    ],
  },
};

export const serverErrorResponse = {
  Message: {
    Code: 500,
    Text: "Internal Server Error",
  },
  Data: {},
};

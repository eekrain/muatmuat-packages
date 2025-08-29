export const fleetTrackingData = {
  "95459a4f-5db7-4f30-bc00-6e22c3a1aabd": {
    fleetTracking: [
      {
        transporterId: "95459a4f-5db7-4f30-bc00-6e22c3a1aabd",
        companyName: "PT. Siba Surya",
        companyAddress: "Kec. Tegalsari, Kota Surabaya",
        companyPicture: "https://picsum.photos/100?random=01",
        fleets: [
          {
            fleetId: "uuid-fleet-123",
            licensePlate: "B 1234 XYZ",
            truckImage: "https://picsum.photos/100?random=02",
            driverInfo: {
              driverId: "uuid-driver-456",
              driverName: "Ahmad Suryanto",
              driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
            },
            orderStatus: "LOADING",
            stepStatus: [
              {
                orderStatus: "SCHEDULED_FLEET",
                statusName: "Pesanan Terkonfirmasi",
              },
              {
                orderStatus: "LOADING",
                statusName: "Proses Muat",
              },
              {
                orderStatus: "UNLOADING",
                statusName: "Proses Bongkar",
              },
              {
                orderStatus: "COMPLETED",
                statusName: "Selesai",
              },
            ],
            sosStatus: {
              hasSOS: true,
              sosId: "3c0c2992-d782-4ad6-9f13-f8ac8b2dd577",
              sosDescription: "Kendaraan mengalami kendala teknis di jalan tol",
              sosTime: "2025-08-05T14:30:00Z",
              status: "ACTIVE",
              priorityLevel: "HIGH",
            },
          },
        ],
      },
    ],
  },
  MT25201: {
    fleetTracking: [
      {
        transporterId: "95459a4f-5db7-4f30-bc00-6e22c3a1aabd",
        companyName: "PT. Siba Surya",
        companyAddress: "Kec. Tegalsari, Kota Surabaya",
        companyPicture: "https://picsum.photos/100?random=01",
        fleets: [
          {
            fleetId: "uuid-fleet-123",
            licensePlate: "B 1234 XYZ",
            truckImage: "https://picsum.photos/100?random=02",
            driverInfo: {
              driverId: "uuid-driver-456",
              driverName: "Ahmad Suryanto",
              driverStatus: "MENUJU_KE_LOKASI_MUAT_1",
            },
            orderStatus: "LOADING",
            stepStatus: [
              {
                orderStatus: "SCHEDULED_FLEET",
                statusName: "Pesanan Terkonfirmasi",
              },
              {
                orderStatus: "LOADING",
                statusName: "Proses Muat",
              },
              {
                orderStatus: "UNLOADING",
                statusName: "Proses Bongkar",
              },
              {
                orderStatus: "COMPLETED",
                statusName: "Selesai",
              },
            ],
            sosStatus: {
              hasSOS: true,
              sosId: "3c0c2992-d782-4ad6-9f13-f8ac8b2dd577",
              sosDescription: "Kendaraan mengalami kendala teknis di jalan tol",
              sosTime: "2025-08-05T14:30:00Z",
              status: "ACTIVE",
              priorityLevel: "HIGH",
            },
          },
          {
            fleetId: "uuid-fleet-124",
            licensePlate: "B 5678 ABC",
            truckImage: "https://picsum.photos/100?random=03",
            driverInfo: {
              driverId: "uuid-driver-789",
              driverName: "Budi Santoso",
              driverStatus: "DALAM_PERJALANAN",
            },
            orderStatus: "UNLOADING",
            stepStatus: [
              {
                orderStatus: "SCHEDULED_FLEET",
                statusName: "Pesanan Terkonfirmasi",
              },
              {
                orderStatus: "LOADING",
                statusName: "Proses Muat",
              },
              {
                orderStatus: "UNLOADING",
                statusName: "Proses Bongkar",
              },
              {
                orderStatus: "COMPLETED",
                statusName: "Selesai",
              },
            ],
            sosStatus: {
              hasSOS: false,
              sosId: null,
              sosDescription: null,
              sosTime: null,
              status: "INACTIVE",
              priorityLevel: null,
            },
          },
        ],
      },
    ],
  },
};

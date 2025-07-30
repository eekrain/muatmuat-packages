import useSWR from "swr";

const apiResultActiveDrivers = {
  data: {
    Message: {
      Code: 200,
      Text: "Success",
    },
    Data: {
      drivers: [
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          name: "John Doe Driver",
          phoneNumber: "081234567890",
          profileImage: "/img/mock-armada/driver.png",
          driverStatus: "READY_FOR_ORDER",
          verificationStatus: "VERIFIED",
          fleet: {
            id: "660e8400-e29b-41d4-a716-446655440000",
            licensePlate: "B 1234 ABC",
            truckType: {
              id: "770e8400-e29b-41d4-a716-446655440000",
              name: "CDD Box",
              carrierTruck: {
                name: "Box",
              },
            },
          },
          createdAt: "2025-01-16T10:30:00Z",
          warningDocumentExpired: true,
          pendingUpdateDriver: true,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Jane Smith",
          phoneNumber: "081234567891",
          profileImage:
            "/img/mock-armada/047379f720d4d796e68d0fd7a289a30bd4d2e0ac.jpg",
          driverStatus: "ON_DUTY",
          verificationStatus: "NOT_VERIFIED",
          fleet: {
            id: "660e8400-e29b-41d4-a716-446655440001",
            licensePlate: "B 5678 DEF",
            truckType: {
              id: "770e8400-e29b-41d4-a716-446655440001",
              name: "CDE Box",
              carrierTruck: {
                name: "Box",
              },
            },
          },
          createdAt: "2025-01-15T08:20:00Z",
          warningDocumentExpired: false,
          pendingUpdateDriver: false,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440003",
          name: "Michael Brown",
          phoneNumber: "081234567893",
          profileImage:
            "/img/mock-armada/d6869c8f3993048b066679deb82fe2198af78db3.jpg",
          driverStatus: "WAITING_LOADING_TIME",
          verificationStatus: "NOT_VERIFIED",
          fleet: {
            id: "660e8400-e29b-41d4-a716-446655440002",
            licensePlate: "B 9012 GHI",
            truckType: {
              id: "770e8400-e29b-41d4-a716-446655440002",
              name: "Tronton",
              carrierTruck: {
                name: "Flatbed",
              },
            },
          },
          createdAt: "2025-01-13T11:45:00Z",
          warningDocumentExpired: true,
          pendingUpdateDriver: false,
        },
        // {
        //   id: "550e8400-e29b-41d4-a716-446655440002",
        //   name: "Robert Johnson",
        //   phoneNumber: "081234567892",
        //   profileImage:
        //     "/img/mock-armada/96f3e307242fe2a40610399e1d9d7a279944c89c.jpg",
        //   driverStatus: "NOT_PAIRED",
        //   verificationStatus: "VERIFIED",
        //   fleet: null,
        //   createdAt: "2025-01-14T14:15:00Z",
        //   warningDocumentExpired: false,
        //   pendingUpdateDriver: true,
        // },
        // {
        //   id: "550e8400-e29b-41d4-a716-446655440004",
        //   name: "Sarah Williams",
        //   phoneNumber: "081234567894",
        //   profileImage: "/img/mock-armada/driver.png",
        //   driverStatus: "NON_ACTIVE",
        //   verificationStatus: "VERIFIED",
        //   fleet: {
        //     id: "660e8400-e29b-41d4-a716-446655440003",
        //     licensePlate: "B 3456 JKL",
        //     truckType: {
        //       id: "770e8400-e29b-41d4-a716-446655440003",
        //       name: "Wingbox",
        //       carrierTruck: {
        //         name: "Box",
        //       },
        //     },
        //   },
        //   createdAt: "2025-01-12T09:00:00Z",
        //   warningDocumentExpired: false,
        //   pendingUpdateDriver: false,
        // },
        // {
        //   id: "550e8400-e29b-41d4-a716-446655440005",
        //   name: "David Lee",
        //   phoneNumber: "081249088083",
        //   profileImage:
        //     "/img/mock-armada/96f3e307242fe2a40610399e1d9d7a279944c89c.jpg",
        //   driverStatus: "IN_PROGRESS",
        //   verificationStatus: "VERIFIED",
        //   fleet: null,
        //   createdAt: "2025-01-11T16:30:00Z",
        //   warningDocumentExpired: false,
        //   pendingUpdateDriver: false,
        // },
        // {
        //   id: "550e8400-e29b-41d4-a716-446655440007",
        //   name: "James Wilson",
        //   phoneNumber: "081234567897",
        //   profileImage:
        //     "/img/mock-armada/d6869c8f3993048b066679deb82fe2198af78db3.jpg",
        //   driverStatus: "REJECTED",
        //   verificationStatus: "NOT_VERIFIED",
        //   fleet: null,
        //   createdAt: "2025-01-09T10:15:00Z",
        //   warningDocumentExpired: true,
        //   pendingUpdateDriver: true,
        // },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 3,
        itemsPerPage: 10,
        hasNextPage: true,
        hasPreviousPage: false,
      },
      dataFilter: {
        truckType: [
          { id: "770e8400-e29b-41d4-a716-446655440000", value: "CDD Box" },
          { id: "770e8400-e29b-41d4-a716-446655440001", value: "CDE Box" },
          { id: "770e8400-e29b-41d4-a716-446655440002", value: "Tronton" },
          { id: "770e8400-e29b-41d4-a716-446655440003", value: "Wingbox" },
        ],
        carrierType: [
          { id: "ct-001", value: "Box" },
          { id: "ct-002", value: "Flatbed" },
          { id: "ct-003", value: "Bak" },
          { id: "ct-004", value: "Tangki" },
        ],
        verificationStatus: [
          { id: "VERIFIED", value: "Terverifikasi" },
          { id: "UNVERIFIED", value: "Belum Terverifikasi" },
        ],
        driverStatus: [
          { id: "READY_FOR_ORDER", value: "Siap Menerima Order" },
          { id: "WAITING_LOADING_TIME", value: "Menunggu Jam Muat" },
          { id: "ON_DUTY", value: "Bertugas" },
        ],
      },
    },
    Type: "GET_ACTIVE_DRIVERS",
  },
};

export const fetcherActiveDrivers = async (cacheKey) => {
  // const result = await fetcherMuatrans.get("v1/drivers/active");
  // return result?.data?.Data || {};

  const result = apiResultActiveDrivers;
  return result.data.Data;
};

export const useGetActiveDriversData = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const cacheKey = `active-drivers${queryParams ? `?${queryParams}` : ""}`;

  return useSWR(cacheKey, fetcherActiveDrivers);
};

import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { TransporterInactiveTypeEnum } from "@/lib/constants/Transporter/laporan/transporterInactive.enum";

const useMockData = true;

export const mockTransporterInactiveFleetDetails = {
  data: {
    Message: {
      Code: 200,
      Text: "Detail armada nonaktif berhasil diambil",
    },
    Data: {
      transporterInfo: {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "PT Logistik Prima Express",
        companyName: "PT Logistik Prima Express",
        status: TransporterInactiveTypeEnum.ADMIN_IDLE_DETECTED, // Change to ADMIN_IDLE_DETECTED to test idle status
        contactInfo: {
          phoneNumber: "+6281234567890",
          picName: "Budi Santoso",
        },
      },
      inactiveFleets: [
        {
          id: "fleet-001",
          licensePlate: "B 1234 ABC",
          truckType: "Truk Bak Kayu",
          driverName: "Agus Setiawan",
          status: "INACTIVE",
          inactiveDate: "2024-01-10T15:30:00Z",
          inactiveDuration: 2880, // 2 hari dalam menit
          photos: [
            {
              id: "photo-001",
              photoUrl:
                "https://storage.example.com/fleet-photos/b1234abc-profile.jpg",
              photoType: "PROFILE",
            },
            {
              id: "photo-002",
              photoUrl:
                "https://storage.example.com/fleet-photos/b1234abc-side.jpg",
              photoType: "SIDE",
            },
          ],
          lastActiveDate: "2024-01-10T15:30:00Z",
        },
        {
          id: "fleet-002",
          licensePlate: "B 5678 DEF",
          truckType: "Truk Box",
          driverName: "Budi Prasetyo",
          status: "INACTIVE",
          inactiveDate: "2024-01-12T09:15:00Z",
          inactiveDuration: 4320, // 3 hari dalam menit
          photos: [
            {
              id: "photo-003",
              photoUrl:
                "https://storage.example.com/fleet-photos/b5678def-profile.jpg",
              photoType: "PROFILE",
            },
          ],
          lastActiveDate: "2024-01-12T09:15:00Z",
        },
        {
          id: "fleet-003",
          licensePlate: "B 9012 GHI",
          truckType: "Truk Tangki",
          driverName: "Cecep Sutrisno",
          status: "INACTIVE",
          inactiveDate: "2024-01-08T14:20:00Z",
          inactiveDuration: 1440, // 1 hari dalam menit
          photos: [
            {
              id: "photo-004",
              photoUrl:
                "https://storage.example.com/fleet-photos/b9012ghi-profile.jpg",
              photoType: "PROFILE",
            },
            {
              id: "photo-005",
              photoUrl:
                "https://storage.example.com/fleet-photos/b9012ghi-rear.jpg",
              photoType: "REAR",
            },
          ],
          lastActiveDate: "2024-01-08T14:20:00Z",
        },
        {
          id: "fleet-004",
          licensePlate: "B 3456 JKL",
          truckType: "Truk Engkel Box",
          driverName: "Dedi Kurniawan",
          status: "INACTIVE",
          inactiveDate: "2024-01-05T11:45:00Z",
          inactiveDuration: 7200, // 5 hari dalam menit
          photos: [],
          lastActiveDate: "2024-01-05T11:45:00Z",
        },
        {
          id: "fleet-005",
          licensePlate: "B 7890 MNO",
          truckType: "Truk Fuso",
          driverName: "Eko Wahyudi",
          status: "INACTIVE",
          inactiveDate: "2024-01-15T16:30:00Z",
          inactiveDuration: 720, // 12 jam dalam menit
          photos: [
            {
              id: "photo-006",
              photoUrl:
                "https://storage.example.com/fleet-photos/b7890mno-profile.jpg",
              photoType: "PROFILE",
            },
          ],
          lastActiveDate: "2024-01-15T16:30:00Z",
        },
        {
          id: "fleet-006",
          licensePlate: "B 2468 PQR",
          truckType: "Truk Bak Besi",
          driverName: "Fajar Suhandri",
          status: "INACTIVE",
          inactiveDate: "2024-01-03T08:00:00Z",
          inactiveDuration: 10080, // 7 hari dalam menit
          photos: [
            {
              id: "photo-007",
              photoUrl:
                "https://storage.example.com/fleet-photos/b2468pqr-profile.jpg",
              photoType: "PROFILE",
            },
            {
              id: "photo-008",
              photoUrl:
                "https://storage.example.com/fleet-photos/b2468pqr-side.jpg",
              photoType: "SIDE",
            },
            {
              id: "photo-009",
              photoUrl:
                "https://storage.example.com/fleet-photos/b2468pqr-rear.jpg",
              photoType: "REAR",
            },
          ],
          lastActiveDate: "2024-01-03T08:00:00Z",
        },
        {
          id: "fleet-007",
          licensePlate: "B 1357 STU",
          truckType: "Truk CDD Box",
          driverName: "Gani Raharjo",
          status: "INACTIVE",
          inactiveDate: "2024-01-07T13:25:00Z",
          inactiveDuration: 3600, // 2.5 hari dalam menit
          photos: [
            {
              id: "photo-010",
              photoUrl:
                "https://storage.example.com/fleet-photos/b1357stu-profile.jpg",
              photoType: "PROFILE",
            },
          ],
          lastActiveDate: "2024-01-07T13:25:00Z",
        },
        {
          id: "fleet-008",
          licensePlate: "B 8024 VWX",
          truckType: "Truk Trailer",
          driverName: "Hadi Susanto",
          status: "INACTIVE",
          inactiveDate: "2024-01-09T10:15:00Z",
          inactiveDuration: 1800, // 1.25 hari dalam menit
          photos: [
            {
              id: "photo-011",
              photoUrl:
                "https://storage.example.com/fleet-photos/b8024vwx-profile.jpg",
              photoType: "PROFILE",
            },
            {
              id: "photo-012",
              photoUrl:
                "https://storage.example.com/fleet-photos/b8024vwx-side.jpg",
              photoType: "SIDE",
            },
          ],
          lastActiveDate: "2024-01-09T10:15:00Z",
        },
        {
          id: "fleet-009",
          licensePlate: "B 4680 YZA",
          truckType: "Truk Pickup",
          driverName: "Iman Prabowo",
          status: "INACTIVE",
          inactiveDate: "2024-01-11T12:40:00Z",
          inactiveDuration: 960, // 16 jam dalam menit
          photos: [],
          lastActiveDate: "2024-01-11T12:40:00Z",
        },
        {
          id: "fleet-010",
          licensePlate: "B 1111 BCD",
          truckType: "Truk Box Pendingin",
          driverName: "Joko Widodo",
          status: "INACTIVE",
          inactiveDate: "2024-01-14T07:20:00Z",
          inactiveDuration: 480, // 8 jam dalam menit
          photos: [
            {
              id: "photo-013",
              photoUrl:
                "https://storage.example.com/fleet-photos/b1111bcd-profile.jpg",
              photoType: "PROFILE",
            },
          ],
          lastActiveDate: "2024-01-14T07:20:00Z",
        },
        {
          id: "fleet-011",
          licensePlate: "B 2222 EFG",
          truckType: "Truk Wing Box",
          driverName: "Krisna Murti",
          status: "INACTIVE",
          inactiveDate: "2024-01-06T15:55:00Z",
          inactiveDuration: 5760, // 4 hari dalam menit
          photos: [
            {
              id: "photo-014",
              photoUrl:
                "https://storage.example.com/fleet-photos/b2222efg-profile.jpg",
              photoType: "PROFILE",
            },
            {
              id: "photo-015",
              photoUrl:
                "https://storage.example.com/fleet-photos/b2222efg-interior.jpg",
              photoType: "INTERIOR",
            },
          ],
          lastActiveDate: "2024-01-06T15:55:00Z",
        },
        {
          id: "fleet-012",
          licensePlate: "B 3333 HIJ",
          truckType: "Truk Crane",
          driverName: "Lukman Hakim",
          status: "INACTIVE",
          inactiveDate: "2024-01-04T09:30:00Z",
          inactiveDuration: 8640, // 6 hari dalam menit
          photos: [
            {
              id: "photo-016",
              photoUrl:
                "https://storage.example.com/fleet-photos/b3333hij-profile.jpg",
              photoType: "PROFILE",
            },
          ],
          lastActiveDate: "2024-01-04T09:30:00Z",
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 3,
        totalItems: 25,
        limit: 10,
      },
    },
    Type: "GET_INACTIVE_FLEET_DETAILS",
  },
};

export const getTransporterInactiveFleetDetails = async (params) => {
  let result;

  if (useMockData) {
    // Function to simulate filtering and pagination
    const getFilteredData = (params = {}) => {
      let filteredItems = [
        ...mockTransporterInactiveFleetDetails.data.Data.inactiveFleets,
      ];

      // Apply search filter (license plate)
      if (params.search && params.search.length >= 3) {
        filteredItems = filteredItems.filter((item) =>
          item.licensePlate.toLowerCase().includes(params.search.toLowerCase())
        );
      }

      // Apply sorting
      const sortBy = params.sortBy || "licensePlate";
      const sortOrder = params.sortOrder || "asc";

      filteredItems.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (sortBy === "lastActiveDate") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedItems = filteredItems.slice(startIndex, endIndex);
      const totalItems = filteredItems.length;
      const totalPages = Math.ceil(totalItems / limit);

      return {
        ...mockTransporterInactiveFleetDetails.data,
        Data: {
          ...mockTransporterInactiveFleetDetails.data.Data,
          inactiveFleets: paginatedItems,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems,
            limit,
          },
        },
      };
    };

    // Simulate validation errors
    if (params.search && params.search.length > 0 && params.search.length < 3) {
      return {
        data: {
          Message: {
            Code: 400,
            Text: "Parameter tidak valid",
          },
          Data: {
            errors: [
              {
                field: "search",
                message: "Kata kunci pencarian minimal 3 karakter",
              },
            ],
          },
          Type: "GET_INACTIVE_FLEET_DETAILS_ERROR",
        },
      };
    }

    if (!params.transporterId) {
      return {
        data: {
          Message: {
            Code: 400,
            Text: "Parameter tidak valid",
          },
          Data: {
            errors: [
              {
                field: "transporterId",
                message: "ID transporter wajib diisi",
              },
            ],
          },
          Type: "GET_INACTIVE_FLEET_DETAILS_ERROR",
        },
      };
    }

    result = getFilteredData(params);
  } else {
    result = await fetcherMuatrans.get(
      `/v1/cs/reports/transporter-inactive/details/inactive-fleet`,
      {
        params,
      }
    );
  }

  return {
    data: result,
    raw: result,
  };
};

export const useGetTransporterInactiveFleetDetails = (params) => {
  const { data, error, isLoading } = useSWR(
    params ? [`getTransporterInactiveFleetDetails`, params] : null,
    () => getTransporterInactiveFleetDetails(params)
  );

  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};

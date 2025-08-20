import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockTransporterInactiveList = {
  data: {
    Message: {
      Code: 200,
      Text: "Data laporan berhasil diambil",
    },
    Data: {
      items: [
        {
          id: "uuid-order-001",
          dateCompleted: "2024-01-15T10:30:00Z",
          transporterName: "PT Logistik Prima",
          transporterId: "uuid-transporter-001",
          condition: "INACTIVE_FLEET_TOO_MANY",
          conditionText: "Armada Nonaktif Terlalu Banyak",
          contactInfo: {
            phoneNumber: "+6281234567890",
            picName: "John Doe",
            picPhone: "+6281234567891",
          },
        },
        {
          id: "uuid-order-002",
          dateCompleted: "2024-01-14T14:20:00Z",
          transporterName: "CV Maju Jaya Transport",
          transporterId: "uuid-transporter-002",
          condition: "ADMIN_IDLE_DETECTED",
          conditionText: "Admin Tidak Aktif Terdeteksi",
          contactInfo: {
            phoneNumber: "+6282345678901",
            picName: "Jane Smith",
            picPhone: "+6282345678902",
          },
        },
        {
          id: "uuid-order-003",
          dateCompleted: "2024-01-13T09:15:00Z",
          transporterName: "PT Sentosa Mandiri",
          transporterId: "uuid-transporter-003",
          condition: "TRANSPORTER_INACTIVE",
          conditionText: "Transporter Tidak Aktif",
          contactInfo: {
            phoneNumber: "+6283456789012",
            picName: "Bob Wilson",
            picPhone: "+6283456789013",
          },
        },
        {
          id: "uuid-order-004",
          dateCompleted: "2024-01-12T16:45:00Z",
          transporterName: "CV Berkah Transport",
          transporterId: "uuid-transporter-004",
          condition: "INACTIVE_FLEET_TOO_MANY",
          conditionText: "Armada Nonaktif Terlalu Banyak",
          contactInfo: {
            phoneNumber: "+6284567890123",
            picName: "Alice Johnson",
            picPhone: "+6284567890124",
          },
        },
        {
          id: "uuid-order-005",
          dateCompleted: "2024-01-11T11:30:00Z",
          transporterName: "PT Global Logistics",
          transporterId: "uuid-transporter-005",
          condition: "ADMIN_IDLE_DETECTED",
          conditionText: "Admin Tidak Aktif Terdeteksi",
          contactInfo: {
            phoneNumber: "+6285678901234",
            picName: "Charlie Brown",
            picPhone: "+6285678901235",
          },
        },
        {
          id: "uuid-order-006",
          dateCompleted: "2024-01-10T13:20:00Z",
          transporterName: "CV Nusantara Express",
          transporterId: "uuid-transporter-006",
          condition: "TRANSPORTER_INACTIVE",
          conditionText: "Transporter Tidak Aktif",
          contactInfo: {
            phoneNumber: "+6286789012345",
            picName: "Diana Prince",
            picPhone: "+6286789012346",
          },
        },
        {
          id: "uuid-order-007",
          dateCompleted: "2024-01-09T08:15:00Z",
          transporterName: "PT Sukses Logistik",
          transporterId: "uuid-transporter-007",
          condition: "INACTIVE_FLEET_TOO_MANY",
          conditionText: "Armada Nonaktif Terlalu Banyak",
          contactInfo: {
            phoneNumber: "+6287890123456",
            picName: "Edward Norton",
            picPhone: "+6287890123457",
          },
        },
        {
          id: "uuid-order-008",
          dateCompleted: "2024-01-08T15:40:00Z",
          transporterName: "CV Harmoni Transport",
          transporterId: "uuid-transporter-008",
          condition: "ADMIN_IDLE_DETECTED",
          conditionText: "Admin Tidak Aktif Terdeteksi",
          contactInfo: {
            phoneNumber: "+6288901234567",
            picName: "Fiona Green",
            picPhone: "+6288901234568",
          },
        },
        {
          id: "uuid-order-009",
          dateCompleted: "2024-01-07T12:25:00Z",
          transporterName: "PT Wijaya Transport",
          transporterId: "uuid-transporter-009",
          condition: "TRANSPORTER_INACTIVE",
          conditionText: "Transporter Tidak Aktif",
          contactInfo: {
            phoneNumber: "+6289012345678",
            picName: "George Davis",
            picPhone: "+6289012345679",
          },
        },
        {
          id: "uuid-order-010",
          dateCompleted: "2024-01-06T17:10:00Z",
          transporterName: "CV Prima Transport",
          transporterId: "uuid-transporter-010",
          condition: "INACTIVE_FLEET_TOO_MANY",
          conditionText: "Armada Nonaktif Terlalu Banyak",
          contactInfo: {
            phoneNumber: "+6290123456789",
            picName: "Helen Miller",
            picPhone: "+6290123456790",
          },
        },
        {
          id: "uuid-order-011",
          dateCompleted: "2024-01-06T17:10:00Z",
          transporterName: "CV Prima Transport",
          transporterId: "uuid-transporter-010",
          condition: "INACTIVE_FLEET_TOO_MANY",
          conditionText: "Armada Nonaktif Terlalu Banyak",
          contactInfo: {
            phoneNumber: "+6290123456789",
            picName: "Helen Miller",
            picPhone: "+6290123456790",
          },
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 5,
        totalItems: 47,
        itemsPerPage: 10,
        hasNext: true,
        hasPrevious: false,
      },
    },
    Type: "GET_TRANSPORTER_INACTIVE_REPORTS",
  },
};

export const getTransporterInactiveList = async (params) => {
  let result;

  if (useMockData) {
    // Function to simulate filtering and pagination
    const getFilteredData = (params = {}) => {
      let filteredItems = [...mockTransporterInactiveList.data.Data.items];

      // Apply search filter
      if (params.search && params.search.length >= 3) {
        filteredItems = filteredItems.filter((item) =>
          item.transporterName
            .toLowerCase()
            .includes(params.search.toLowerCase())
        );
      }

      // Apply condition filter
      if (params.condition) {
        filteredItems = filteredItems.filter(
          (item) => item.condition === params.condition
        );
      }

      // Apply date filters
      if (params.startDate) {
        filteredItems = filteredItems.filter(
          (item) => new Date(item.dateCompleted) >= new Date(params.startDate)
        );
      }

      if (params.endDate) {
        filteredItems = filteredItems.filter(
          (item) => new Date(item.dateCompleted) <= new Date(params.endDate)
        );
      }

      // Apply sorting
      const sortBy = params.sortBy || "dateCompleted";
      const sortOrder = params.sortOrder || "desc";

      filteredItems.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (sortBy === "dateCompleted") {
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
        ...mockTransporterInactiveList.data,
        Data: {
          items: paginatedItems,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit,
            hasNext: page < totalPages,
            hasPrevious: page > 1,
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
          Type: "GET_TRANSPORTER_INACTIVE_REPORTS_ERROR",
        },
      };
    }

    result = getFilteredData(params);
  } else {
    result = await fetcherMuatrans.get(`/v1/cs/reports/transporter-inactive`, {
      params,
    });
  }

  return {
    data: result?.Data || {},
    raw: result,
  };
};

export const useGetTransporterInactive = (params) => {
  const { data, error, isLoading } = useSWR(
    params ? [`getTransporterInactiveList`, params] : null,
    () => getTransporterInactiveList(params)
  );

  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};

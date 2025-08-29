import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { TransporterInactiveTypeEnum } from "@/lib/constants/Transporter/laporan/transporterInactive.enum";

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
          condition: TransporterInactiveTypeEnum.INACTIVE_FLEET_TOO_MANY,
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
          condition: TransporterInactiveTypeEnum.ADMIN_IDLE_DETECTED,
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
          condition: TransporterInactiveTypeEnum.TRANSPORTER_INACTIVE,
          conditionText: "Transporter Tidak Aktif",
          contactInfo: {
            phoneNumber: "+6283456789012",
            picName: "Bob Wilson",
            picPhone: "+6283456789013",
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
        filteredItems = filteredItems.filter((item) => {
          // Map the condition parameter to the actual enum value for comparison
          const conditionMap = {
            INACTIVE_FLEET_TOO_MANY:
              TransporterInactiveTypeEnum.INACTIVE_FLEET_TOO_MANY,
            ADMIN_IDLE_DETECTED:
              TransporterInactiveTypeEnum.ADMIN_IDLE_DETECTED,
            TRANSPORTER_INACTIVE:
              TransporterInactiveTypeEnum.TRANSPORTER_INACTIVE,
          };
          return item.condition === conditionMap[params.condition];
        });
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

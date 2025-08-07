import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockDriversList = false;

const apiResultDriversList = {
  data: {
    Message: {
      Code: 200,
      Text: "Daftar driver berhasil diambil",
    },
    Data: {
      drivers: [
        {
          id: "550e8400-e29b-41d4-a716-446655440012",
          fullName: "Raden Cakradana Ardhanurahman Yudhatama",
          whatsappNumber: "082231001231",
          driverPhotoUrl:
            "/img/mock-armada/96f3e307242fe2a40610399e1d9d7a279944c89c.jpg",
          status: "ACTIVE",
          activeStatus: "READY_TO_RECEIVE_ORDER",
          simB2ExpiryDate: "2025-12-31",
          isSimExpiryDate: true,
          currentVehicle: null,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440013",
          fullName: "Dony Pamungkas",
          whatsappNumber: "081276198712",
          driverPhotoUrl:
            "/img/mock-armada/047379f720d4d796e68d0fd7a289a30bd4d2e0ac.jpg",
          status: "ACTIVE",
          activeStatus: "ON_DUTY",
          simB2ExpiryDate: "2025-12-31",
          isSimExpiryDate: true,
          currentVehicle: "L 2312 AL",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440014",
          fullName: "Bejo Sugiantoro",
          whatsappNumber: "082210330123",
          driverPhotoUrl:
            "/img/mock-armada/d6869c8f3993048b066679deb82fe2198af78db3.jpg",
          status: "ACTIVE",
          activeStatus: "READY_TO_RECEIVE_ORDER",
          simB2ExpiryDate: "2025-12-31",
          isSimExpiryDate: false,
          currentVehicle: null,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440015",
          fullName: "Ahmad Maulana",
          whatsappNumber: "082231001231",
          driverPhotoUrl:
            "/img/mock-armada/d6869c8f3993048b066679deb82fe2198af78db3.jpg",
          status: "ACTIVE",
          activeStatus: "READY_TO_RECEIVE_ORDER",
          simB2ExpiryDate: "2025-12-31",
          isSimExpiryDate: false,
          currentVehicle: null,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440016",
          fullName: "Ahmad Maulana",
          whatsappNumber: "082231001231",
          driverPhotoUrl:
            "/img/mock-armada/047379f720d4d796e68d0fd7a289a30bd4d2e0ac.jpg",
          status: "ACTIVE",
          activeStatus: "READY_TO_RECEIVE_ORDER",
          simB2ExpiryDate: "2025-12-31",
          isSimExpiryDate: false,
          currentVehicle: null,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440017",
          fullName: "Ahmad Maulana",
          whatsappNumber: "082231001231",
          driverPhotoUrl:
            "/img/mock-armada/d6869c8f3993048b066679deb82fe2198af78db3.jpg",
          status: "ACTIVE",
          activeStatus: "READY_TO_RECEIVE_ORDER",
          simB2ExpiryDate: "2025-12-31",
          isSimExpiryDate: false,
          currentVehicle: null,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440018",
          fullName: "Ahmad Maulana",
          whatsappNumber: "082231001231",
          driverPhotoUrl:
            "/img/mock-armada/047379f720d4d796e68d0fd7a289a30bd4d2e0ac.jpg",
          status: "ACTIVE",
          activeStatus: "READY_TO_RECEIVE_ORDER",
          simB2ExpiryDate: "2025-12-31",
          isSimExpiryDate: false,
          currentVehicle: null,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440019",
          fullName: "Ahmad Maulana",
          whatsappNumber: "082231001231",
          driverPhotoUrl:
            "/img/mock-armada/047379f720d4d796e68d0fd7a289a30bd4d2e0ac.jpg",
          status: "ACTIVE",
          activeStatus: "READY_TO_RECEIVE_ORDER",
          simB2ExpiryDate: "2025-12-31",
          isSimExpiryDate: false,
          currentVehicle: null,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440020",
          fullName: "Ahmad Maulana",
          whatsappNumber: "082231001231",
          driverPhotoUrl:
            "/img/mock-armada/d6869c8f3993048b066679deb82fe2198af78db3.jpg",
          status: "ACTIVE",
          activeStatus: "READY_TO_RECEIVE_ORDER",
          simB2ExpiryDate: "2025-12-31",
          isSimExpiryDate: false,
          currentVehicle: null,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 15,
        totalPages: 2,
      },
    },
    Type: "DRIVERS_LIST",
  },
};

export const fetcherDriversList = async (_, params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;

  if (isMockDriversList) {
    const result = apiResultDriversList;

    // Simulate search filtering
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      const filteredDrivers = result.data.Data.drivers.filter(
        (driver) =>
          driver.fullName.toLowerCase().includes(searchLower) ||
          driver.whatsappNumber.includes(params.search)
      );

      return {
        drivers: filteredDrivers,
        pagination: {
          ...result.data.Data.pagination,
          totalItems: filteredDrivers.length,
          totalPages: Math.ceil(filteredDrivers.length / params.limit || 10),
        },
      };
    }

    return result.data.Data;
  }

  const result = await fetcherMuatrans.get("v1/drivers", {
    params: {
      page,
      limit,
      search,
    },
  });
  return result?.data?.Data || {};
};

export const useGetDriversList = (params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;
  const cacheKey = ["drivers-list", page, limit, search];

  return useSWR(cacheKey, () => fetcherDriversList(cacheKey, params));
};

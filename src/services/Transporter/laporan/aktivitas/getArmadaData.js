import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

export const mockFleetActivities = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: {
      activities: [
        {
          fleetId: "5b831478-6757-40da-810c-31ccc11f29e6",
          licensePlate: "B 1111 FMI",
          truckType: "Colt Diesel Double",
          truckTypeId: "26ff8b9e-b8cc-40a9-9b9e-a3404752c5fd",
          carrierType: "Bak Terbuka",
          fleetImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/photo-1753166402594.webp",
          currentLocation: "-",
          activeOrderCode: "",
          activeInvoiceNumber: "",
          activeOrderPickupLocation: "",
          activeOrderDropoffLocation: "",
          estimateDistance: 0,
          status: "READY_FOR_ORDER",
          createdAt: "2025-08-01 11:07:02",
        },
        {
          fleetId: "733949ea-80ad-40da-a5e1-212d55365e80",
          licensePlate: "B 1233 ABC",
          truckType: "Colt Diesel Double",
          truckTypeId: "26ff8b9e-b8cc-40a9-9b9e-a3404752c5fd",
          carrierType: "Bak Terbuka",
          fleetImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752811896934.webp",
          currentLocation: "-",
          activeOrderCode: "",
          activeInvoiceNumber: "",
          activeOrderPickupLocation: "",
          activeOrderDropoffLocation: "",
          estimateDistance: 0,
          status: "NOT_PAIRED",
          createdAt: "2025-07-29 17:17:08",
        },
        {
          fleetId: "420aed87-8033-4958-8545-79d5c73c5dd5",
          licensePlate: "B 1234 ABC",
          truckType: "Colt Diesel Double",
          truckTypeId: "26ff8b9e-b8cc-40a9-9b9e-a3404752c5fd",
          carrierType: "Bak Terbuka",
          fleetImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752811896934.webp",
          currentLocation: "-",
          activeOrderCode: "",
          activeInvoiceNumber: "",
          activeOrderPickupLocation: "",
          activeOrderDropoffLocation: "",
          estimateDistance: 0,
          status: "ON_DUTY",
          createdAt: "2025-07-21 15:11:38",
        },
        {
          fleetId: "654ec099-6a83-4350-98bb-93a16ea2c897",
          licensePlate: "B 1234 ABC",
          truckType: "Colt Diesel Double",
          truckTypeId: "26ff8b9e-b8cc-40a9-9b9e-a3404752c5fd",
          carrierType: "Bak Terbuka",
          fleetImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/photo-1753166402594.webp",
          currentLocation: "-",
          activeOrderCode: "MT25AA583",
          activeInvoiceNumber: "INV/MT25AA583",
          activeOrderPickupLocation:
            "Taman - Waru, Taman, Sidoarjo, Jawa Timur, Indonesia",
          activeOrderDropoffLocation:
            "Pacet Hill, Hutan, Padusan, Kabupaten Mojokerto, Jawa Timur, Indonesia",
          estimateDistance: 20.69,
          status: "READY_FOR_ORDER",
          createdAt: "2025-07-22 13:52:48",
        },
        {
          fleetId: "edf88e21-88dc-4830-8068-777c07f68547",
          licensePlate: "B 1234 ABD",
          truckType: "Colt Diesel Double",
          truckTypeId: "26ff8b9e-b8cc-40a9-9b9e-a3404752c5fd",
          carrierType: "Bak Terbuka",
          fleetImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/photo-1753166402594.webp",
          currentLocation: "-",
          activeOrderCode: "MT25AA605",
          activeInvoiceNumber: "INV/MT25AA605",
          activeOrderPickupLocation:
            "Surabaya North Quay, Perak Utara, Surabaya, Jawa Timur, Indonesia",
          activeOrderDropoffLocation:
            "Bandulan Gang V, Bandulan, Kota Malang, Jawa Timur, Indonesia",
          estimateDistance: 88.58,
          status: "READY_FOR_ORDER",
          createdAt: "2025-07-23 09:55:19",
        },
        {
          fleetId: "b5a371b7-b2d9-47d5-9e70-1108ef6573e6",
          licensePlate: "B 1234 RIC",
          truckType: "Colt Diesel Double",
          truckTypeId: "26ff8b9e-b8cc-40a9-9b9e-a3404752c5fd",
          carrierType: "Bak Terbuka",
          fleetImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/photo-1753166402594.webp",
          currentLocation: "-",
          activeOrderCode: "",
          activeInvoiceNumber: "",
          activeOrderPickupLocation: "",
          activeOrderDropoffLocation: "",
          estimateDistance: 0,
          status: "READY_FOR_ORDER",
          createdAt: "2025-08-01 14:11:03",
        },
        {
          fleetId: "45be2b3e-fa6f-45f0-902d-56de90d212e2",
          licensePlate: "B 1235 ABC",
          truckType: "Colt Diesel Double",
          truckTypeId: "26ff8b9e-b8cc-40a9-9b9e-a3404752c5fd",
          carrierType: "Bak Terbuka",
          fleetImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752811896934.webp",
          currentLocation: "-",
          activeOrderCode: "MT25AA605",
          activeInvoiceNumber: "INV/MT25AA605",
          activeOrderPickupLocation:
            "Surabaya North Quay, Perak Utara, Surabaya, Jawa Timur, Indonesia",
          activeOrderDropoffLocation:
            "Bandulan Gang V, Bandulan, Kota Malang, Jawa Timur, Indonesia",
          estimateDistance: 88.58,
          status: "READY_FOR_ORDER",
          createdAt: "2025-07-21 15:11:15",
        },
        {
          fleetId: "b23b5275-f936-4267-8af3-e67e3c6d6826",
          licensePlate: "B 1236 ABC",
          truckType: "Colt Diesel Double",
          truckTypeId: "26ff8b9e-b8cc-40a9-9b9e-a3404752c5fd",
          carrierType: "Bak Terbuka",
          fleetImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752811896934.webp",
          currentLocation: "-",
          activeOrderCode: "MT25AA491",
          activeInvoiceNumber: "INV/MT25AA491",
          activeOrderPickupLocation:
            "muatmuat, Jalan Kedung Doro, RT.001/RW.06, Kedungdoro, Surabaya, Jawa Timur, Indonesia",
          activeOrderDropoffLocation:
            "Jalan Jawa Asri I, Yosowilangun, Gresik, Jawa Timur, Indonesia",
          estimateDistance: 18,
          status: "READY_FOR_ORDER",
          createdAt: "2025-07-29 09:52:25",
        },
        {
          fleetId: "4085d6b2-be92-4e22-92ee-3b3fb8e13c11",
          licensePlate: "B 1464 ABD",
          truckType: "Colt Diesel Double",
          truckTypeId: "26ff8b9e-b8cc-40a9-9b9e-a3404752c5fd",
          carrierType: "Bak Terbuka",
          fleetImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/photo-1753166402594.webp",
          currentLocation: "-",
          activeOrderCode: "MT25AA564",
          activeInvoiceNumber: "INV/MT25AA564",
          activeOrderPickupLocation:
            "muatmuat, Jalan Kedung Doro, RT.001/RW.06, Kedungdoro, Surabaya, Jawa Timur, Indonesia",
          activeOrderDropoffLocation:
            "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
          estimateDistance: 5.69,
          status: "READY_FOR_ORDER",
          createdAt: "2025-07-29 17:47:26",
        },
        {
          fleetId: "740c7aeb-8820-447f-9750-ff034464be72",
          licensePlate: "L 1234 ERD",
          truckType: "Colt Diesel Double",
          truckTypeId: "26ff8b9e-b8cc-40a9-9b9e-a3404752c5fd",
          carrierType: "Bak Terbuka",
          fleetImage:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/photo-1753166402594.webp",
          currentLocation: "-",
          activeOrderCode: "",
          activeInvoiceNumber: "",
          activeOrderPickupLocation: "",
          activeOrderDropoffLocation: "",
          estimateDistance: 0,
          status: null,
          createdAt: "2025-08-13 09:30:35",
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 15,
        totalPages: 2,
      },
    },
    Type: "GET_FLEET_ACTIVITIES",
  },
};

export const getFleetActivities = async (params = {}) => {
  const {
    limit = 10,
    page = 1,
    sort = "licensePlate",
    order = "asc",
    search = "",
    status = "",
    fleetType = "",
    startDate = "",
    endDate = "",
  } = params;

  let result;
  if (useMockData) {
    result = mockFleetActivities;
  } else {
    result = await fetcherMuatrans.get(`/v1/transporter/activities/fleet`, {
      params: {
        limit,
        page,
        sort,
        order,
        search,
        status,
        fleetType,
        startDate,
        endDate,
      },
    });
  }
  return {
    data: result?.data?.Data || {},
    raw: result,
  };
};

export const useGetFleetActivities = (params = {}) => {
  const { data, error, isLoading } = useSWR(
    [`getFleetActivities`, params],
    () => getFleetActivities(params)
  );
  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
  };
};

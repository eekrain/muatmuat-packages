import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { CSOrderStatusEnum } from "@/lib/constants/CS/detailpesanan/detailpesanan-cs.enum";

const useMockData = true;

const mockApiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Detail pesanan berhasil diambil",
    },
    Data: {
      orderDetail: {
        orderId: "dcdaf886-56d6-4d84-89d6-a21ec18d0bc1",
        orderCode: "MT25AA004",
        orderStatus: CSOrderStatusEnum.SCHEDULED_FLEET,
        orderStatusUnit: 1, // dipake kalo ada otherStatus, misal: Proses Bongkar : 1 Unit
        hasSos: false, // dipake di tab Lacak Armada buat nampilin badge SOS
        totalAssignedTruck: 1, // dipake di tab Lacak Armada buat nampilin jumlah truck yang bertugas (mau itu SOS ataupun tidak)
      },
      otherStatus: [
        // {
        //   orderStatus: "UNLOADING",
        //   statusName: "Proses Bongkar",
        //   count: 1,
        // },
        // {
        //   orderStatus: "LOADING",
        //   statusName: "Proses Muat",
        //   count: 1,
        // },
      ],
      orderSummary: {
        truckCount: 1,
        isHalalLogistic: true,
        vehicle: {
          truckTypeId: "62a0f025-3143-4f84-99d3-a1c5ac1b8658",
          truckTypeName: "Medium Truk 4 x 2 (Rigid)",
          vehicleImage: "https://picsum.photos/200?random=123",
        },
        loadTimeStart: "2025-08-05T10:00:00Z", // [dbt_mt_order.loadTimeStart]
        loadTimeEnd: null, // [dbt_mt_order.loadTimeEnd]
        // loadTimeEnd: "2025-08-05T12:00:00Z", // [dbt_mt_order.loadTimeEnd]
        estimatedDistance: 123,
        estimatedDistanceUnit: "km",
        locations: [
          {
            locationId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            locationType: "PICKUP",
            sequence: 1,
            fullAddress:
              "Graha Aero, Jl. Kedungdoro 88, Kedungdoro, Kec Tegalsari, Kota Surabaya, Jawa Timur 60261",
            detailAddress: "Depan Toko Bunga Gunungsari",
            picName: "Agus Raharjo",
          },
          {
            locationId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            locationType: "PICKUP",
            sequence: 2,
            fullAddress:
              "Jalan Cinta, Kec. Semarang Utara, Kota Semarang, Jawa Tengah, 50243",
            detailAddress: "Depan Toko Bunga Gunungsari",
            picName: "Budi Wiranto",
          },
          {
            locationId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            locationType: "DROPOFF",
            sequence: 1,
            fullAddress:
              "Jl. Ambengan No.51, Pacar Keling, Kec. Genteng, Surabaya, Jawa Timur 60272",
            detailAddress: "Depan Toko Bunga Gunungsari",
            picName: "Jajang Surahman",
          },
          {
            locationId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            locationType: "DROPOFF",
            sequence: 2,
            fullAddress:
              "Jalan Bunga, Kec. Semarang Timur, Kota Semarang, Jawa Tengah, 50242",
            detailAddress: "Depan Toko Bunga Gunungsari",
            picName: "Cecep Wijaya",
          },
        ],
        cargo: {
          totalWeight: 500,
          totalWeightUnit: "kg",
          description:
            "tolong kirim muatan dengan hati hati, jangan sampai rusak dan hancur, terimakasih",
          cargos: [
            {
              cargoId: "550e8400-e29b-41d4-a716-446655440004",
              name: "Electronics",
              weight: 500,
              weightUnit: "kg",
              dimensions: null,
              // dimensions: {
              //   // dimeensions or null, karena dimensions optional
              //   length: 2.0,
              //   width: 1.0,
              //   height: 1.5,
              //   unit: "m",
              // },
            },
            // {
            //   cargoId: "550e8400-e29b-41d4-a716-446655440004",
            //   name: "Besi Baja",
            //   weight: 1,
            //   weightUnit: "ton",
            //   dimensions: {
            //     // dimeensions or null, karena dimensions optional
            //     length: 2.0,
            //     width: 1.0,
            //     height: 1.5,
            //     unit: "m",
            //   },
            // },
            // {
            //   cargoId: "550e8400-e29b-41d4-a716-446655440004",
            //   name: "Karet Mentah",
            //   weight: 1,
            //   weightUnit: "ton",
            //   dimensions: {
            //     // dimeensions or null, karena dimensions optional
            //     length: 2.0,
            //     width: 1.0,
            //     height: 1.5,
            //     unit: "m",
            //   },
            // },
          ],
          cargoPhotos: [
            "https://picsum.photos/600/300?random=101",
            "https://picsum.photos/600/300?random=102",
            "https://picsum.photos/600/300?random=103",
            "https://picsum.photos/600/300?random=104",
          ],
        },
        additionalServices: [
          {
            serviceId: "a0f1778f-0ee2-4ec1-8be8-3e7737832fe2",
            serviceName: "Bantuan Tambahan",
          },
          {
            serviceId: "0f678054-8459-4a36-8b1d-662e8de7580c",
            serviceName: "Kirim Berkas",
            isDocumentDelivery: true,
            address: "Jalan Mayjend Soengkono 33A, Denanyar, Jombang",
            addressDetail:
              "Sebelah Kantor Bank BCA Mayjend Soengkono. Gudang warna pink",
            picName: "Ce Siti",
            picPhone: "081239110241",
            expedition: "JNE",
          },
        ],
      },
      shipperInfo: {
        userId: "62a0f025-3143-4f84-99d3-a1c5ac1b8611", // [dbt_mt_order.userID]
        fullName: "PT. Airmas International (AIRI)", // [dbm_mt_user.fullName]
        phoneNumber: "0812-4321-6666", // [dbm_mt_user.phoneNumber]
        location: "Kec. Tegalsari, Kota Surabaya", // [dbm_mt_user.email]
      },
      transporterInfo: {
        transporterId: "62a0f025-3143-4f84-99d3-a1c5ac1b8612", // [dbm_mt_transporter.id]
        companyName: "PT. Siba Surya", // [dbm_mt_transporter.companyName]
        totalUnits: 1, // Count from dbt_mt_order_drivers
        phoneNumber: "0246-5844-60", // [dbm_mt_user.phoneNumber] via userID
        location: "Kec. Tegalsari, Kota Surabaya", // [dbm_mt_user.email]
      },
    },
    Type: "ORDER_DETAIL_SUCCESS",
  },
};

export const getOrderDetailCS = async (cacheKey) => {
  if (useMockData) {
    return mockApiResult.data.Data;
  }
  const result = await fetcherMuatrans.get(cacheKey);
  return result?.data?.Data || {};
};

export const useGetOrderDetailCS = (orderId, params = {}, options = {}) => {
  const queryParams = new URLSearchParams(params).toString();

  const cacheKey = orderId
    ? `/v1/transporter/orders/${orderId}/detail-summary${
        queryParams ? `?${queryParams}` : ""
      }`
    : null;

  return useSWR(cacheKey, getOrderDetailCS, options);
};

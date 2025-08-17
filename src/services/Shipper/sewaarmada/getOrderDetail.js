import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import {
  OrderStatusEnum,
  OrderTypeEnum,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { normalizeOrderDetail } from "@/lib/normalizers/sewaarmada";

const useMockData_getOrderDetail = false;
const useMockData_getAdditionalServices = false;

const apiResultOrderDetail = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: {
      general: {
        orderId: "1c2a62bc-d4ba-46d6-91ff-ecb9c3eab2b3",
        transporterOrderCode: "MT25A085A",
        invoiceNumber: "INV/MT25AA085",
        orderStatus: OrderStatusEnum.LOADING,
        orderTitle: "Menunggu Pembayaran",
        orderType: OrderTypeEnum.INSTANT,
        unitFleetStatus: 0,
        createdAt: "2025-07-21T03:46:11.211Z",
        updatedAt: "2025-07-21T03:46:11.590Z",
      },
      summary: {
        distance: 11.85,
        carrier: {
          carrierId: "550e8400-e29b-41d4-a716-446655440001",
          name: "Bak Terbuka",
          image:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/carrier/colt_diesel_engkel_bak_terbuka.png",
        },
        truckType: {
          truckTypeId: "62a0f025-3143-4f84-99d3-a1c5ac1b8658",
          name: "Medium Truk 4 x 2 (Rigid)",
          image:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/truck/medium-truck-4x2-rigid-bak-terbuka-v2.png",
          totalUnit: 4,
          maxWeight: 12.5,
          weightUnit: "ton",
          dimension: {
            length: 5.5,
            width: 2.4,
            height: 2,
            unit: "m",
          },
        },
        loadTimeStart: "2025-07-23T20:35:00+07:00",
        loadTimeEnd: "2025-07-23T23:43:00+07:00",
        locations: [
          {
            locationId: "d1206df5-7e9d-473d-a93e-ee8544a8ae67",
            locationType: "PICKUP",
            sequence: 1,
            fullAddress:
              "Galaxy Mall 2, Mulyorejo, Surabaya, Jawa Timur, Indonesia",
            detailAddress: "",
            latitude: -7.2741549,
            longitude: 112.7820621,
            district: "Mulyorejo",
            districtId: 357826,
            city: "Kota Surabaya",
            cityId: 3578,
            province: "Jawa Timur",
            provinceId: 35,
            postalCode: "60115",
            picName: "Baba",
            picPhoneNumber: "08124091247091",
            scanStatus: "NOT_SCANNED",
          },
          {
            locationId: "688cb0d2-1594-4aa3-b6bb-5e55722754c4",
            locationType: "PICKUP",
            sequence: 2,
            fullAddress:
              "Atlas Sports Club, Jalan Dharmahusada Indah Barat III, Mojo, Surabaya, Jawa Timur, Indonesia",
            detailAddress: "",
            latitude: -7.274176100000001,
            longitude: 112.771345,
            district: "Gubeng",
            districtId: 357808,
            city: "Kota Surabaya",
            cityId: 3578,
            province: "Jawa Timur",
            provinceId: 35,
            postalCode: "60285",
            picName: "lololo",
            picPhoneNumber: "08129407120947",
            scanStatus: "NOT_SCANNED",
          },
          {
            locationId: "01d182bc-916e-47b6-8b86-3180d8a72b61",
            locationType: "DROPOFF",
            sequence: 1,
            fullAddress:
              "Pakuwon Mall, Jalan Mayjend. Jonosewojo, Babatan, Surabaya, Jawa Timur, Indonesia",
            detailAddress: "",
            latitude: -7.289141399999999,
            longitude: 112.6757233,
            district: "Wiyung",
            districtId: 357820,
            city: "Kota Surabaya",
            cityId: 3578,
            province: "Jawa Timur",
            provinceId: 35,
            postalCode: "60227",
            picName: "Bubu",
            picPhoneNumber: "0819247091274",
            scanStatus: "NOT_SCANNED",
          },
          {
            locationId: "c1022396-38a0-4aec-afcf-575044b2b48d",
            locationType: "DROPOFF",
            sequence: 2,
            fullAddress:
              "Widya Mandala Catholic University, Campus Dinoyo, Jalan Dinoyo, Keputran, Surabaya, Jawa Timur, Indonesia",
            detailAddress: "",
            latitude: -7.280844999999998,
            longitude: 112.744568,
            district: "Tegalsari",
            districtId: 357805,
            city: "Kota Surabaya",
            cityId: 3578,
            province: "Jawa Timur",
            provinceId: 35,
            postalCode: "60265",
            picName: "popopo",
            picPhoneNumber: "08102479127490",
            scanStatus: "NOT_SCANNED",
          },
        ],
        isHalalLogistic: true,
        canReview: false,
        isEdit: false,
        cargo: [
          {
            cargoId: "e41a36a9-3a11-4fd8-89d1-3ed2ee8baf0a",
            cargoTypeName: "Barang Setengah Jadi",
            cargoTypeId: "f483709a-de4c-4541-b29e-6f4d9a912332",
            cargoCategoryName: "Curah",
            cargoCategoryId: "f483709a-de4c-4541-b29e-6f4d9a912333",
            name: "Furniture Kayu",
            weight: 1,
            weightUnit: "ton",
            dimensions: {
              length: 1,
              width: 1,
              height: 1,
              unit: "m",
            },
            sequence: 1,
          },
          {
            cargoId: "c9d2a7d7-7f91-4631-be90-9cd6d20d8cc4",
            cargoTypeName: "Barang Setengah Jadi",
            cargoTypeId: "f483709a-de4c-4541-b29e-6f4d9a912332",
            cargoCategoryName: "Curah",
            cargoCategoryId: "f483709a-de4c-4541-b29e-6f4d9a912333",
            name: "Elektronik Rumah Tangga",
            weight: 2,
            weightUnit: "ton",
            dimensions: {
              length: 1,
              width: 1,
              height: 1,
              unit: "m",
            },
            sequence: 2,
          },
          // {
          //     "cargoId": "2ebc16aa-c2ae-4c63-aad4-84030e340aba",
          //     "cargoTypeName": "Barang Setengah Jadi",
          //     "cargoTypeId": "f483709a-de4c-4541-b29e-6f4d9a912332",
          //     "cargoCategoryName": "Curah",
          //     "cargoCategoryId": "f483709a-de4c-4541-b29e-6f4d9a912333",
          //     "name": "Peralatan dan Kebutuhan Kantor",
          //     "weight": 3,
          //     "weightUnit": "ton",
          //     "dimensions": {
          //         "length": 1,
          //         "width": 1,
          //         "height": 1,
          //         "unit": "m"
          //     },
          //     "sequence": 3
          // }
        ],
        payment: {
          paymentMethodId: "d2aa95f5-6b8e-4272-b922-624234c443a3",
          paymentMethod: "BCA Virtual Account",
          paymentDueDateTime: "2025-07-22T03:46:11.302Z",
          paymentLogo:
            "https://azlogistik.s3.ap-southeast-3.amazonaws.com/dev/file-1736740281046.webp",
        },
        price: {
          totalPrice: 1114472,
          transportFee: 907472,
          insuranceFee: 0,
          additionalServiceFee: [
            {
              name: "Kirim Bukti Fisik Penerimaan Barang",
              price: 7000,
              withShipping: true,
            },
            {
              name: "Bantuan Tambahan",
              price: 100000,
              withShipping: false,
            },
            {
              name: "Troli",
              price: 100000,
              withShipping: false,
            },
          ],
          voucher: null,
          adminFee: 0,
          taxAmount: 0,
        },
        priceChange: {
          additionalCost: 0,
          penaltyFee: 0,
          adminFee: 0,
          taxAmount: 0,
          totalAdjustment: 0,
          requiresPayment: false,
        },
        priceCharge: {
          waitingFee: {
            totalAmount: 0,
            totalDriver: 0,
            totalHour: 0,
          },
          overloadFee: {
            totalAmount: 0,
            totalWeight: 0,
            weightUnit: "kg",
          },
          adminFee: 0,
          totalCharge: 0,
          isPaid: false,
        },
      },
      otherInformation: {
        cargoPhotos: [
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1753069487119.webp",
        ],
        cargoDescription: "Babibu",
        numberDeliveryOrder: ["DO9712409", "DO818264921"],
        cargoTypeId: "f483709a-de4c-4541-b29e-6f4d9a912333",
        cargoCategoryId: "f483709a-de4c-4541-b29e-6f4d9a912333",
      },
      changeCount: 0,
      isChangeable: true,
      isCancellable: true,
      hasCancellationPenalty: false,
      cancellationPenalty: 0,
      drivers: [],
      documents: {
        doNumber: "",
        doUrl: "",
      },
      businessEntity: {
        isBusinessEntity: true,
        name: "PT Lembur Terus",
        taxId: "123456789012345",
      },
      config: {
        toleranceHours: 12,
        hourlyRate: 0,
      },
      otherStatus: [],
      pendingChanges: {
        hasPendingChanges: false,
      },
    },
    Type: "/v1/orders/1c2a62bc-d4ba-46d6-91ff-ecb9c3eab2b3",
  },
};

const apiResultAdditionalServices = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: {
      additionalService: [
        {
          serviceId: "b98a7cc7-54cf-4816-ba77-bb0b410caef0",
          name: "Kirim Bukti Fisik Penerimaan Barang",
          price: 6000,
          isShipping: true,
          addressInformation: {
            recipientName: "Lembur Santoso",
            recipientPhone: "0812937409127",
            fullAddress:
              "Widya Mandala Catholic University, Campus Kalijudan, Jalan Kalijudan, Pacar Kembang, Surabaya, Jawa Timur, Indonesia",
            detailAddress: "Babababa",
            latitude: -7.260551999999999,
            longitude: 112.774403,
            district: "Tambaksari",
            city: "Kota Surabaya",
            province: "Jawa Timur",
            postalCode: "60132",
            courier: "Ninja Xpress",
            insuranceCost: 1000,
            shippingOptionId: "f3d7eea0-1c96-4f99-84ef-cc08c47471d9",
          },
        },
        {
          serviceId: "96a515fe-ee8c-4456-8af2-249bb0b3250b",
          name: "Troli",
          price: 100000,
          isShipping: false,
        },
        {
          serviceId: "66b24c35-8950-4fd3-8ee1-ae14e0cae7c6",
          name: "Bantuan Tambahan",
          price: 100000,
          isShipping: false,
        },
      ],
    },
    Type: "/v1/orders/1c2a62bc-d4ba-46d6-91ff-ecb9c3eab2b3/additional-services",
  },
};

export const fetcherOrderDetail = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];

  let result;

  if (useMockData_getOrderDetail) {
    result = apiResultOrderDetail;
  } else {
    result = await fetcherMuatrans.get(`v1/orders/${orderId}`);
  }

  return result?.data?.Data;
};

export const getAdditionalServices = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];

  let result;

  if (useMockData_getAdditionalServices) {
    result = apiResultAdditionalServices;
  } else {
    result = await fetcherMuatrans.get(
      `v1/orders/${orderId}/additional-services`
    );
  }

  return result?.data?.Data?.additionalService || [];
};

export const getOrderDetail = async (cacheKey) => {
  try {
    const [dataOrderDetail, dataAdditionalServices] = await Promise.all([
      fetcherOrderDetail(cacheKey),
      getAdditionalServices(cacheKey),
    ]);

    let tempShippingOptions = [];

    // Fetch pilih ekspesidi
    const documentDeliveryService = dataAdditionalServices.find(
      (item) => item.isShipping
    );
    if (documentDeliveryService) {
      const result = await fetcherMuatrans.post("v1/orders/shipping-options", {
        lat: documentDeliveryService.addressInformation.latitude,
        long: documentDeliveryService.addressInformation.longitude,
      });
      tempShippingOptions = result?.data?.Data.shippingOptions;
    }
    return {
      orderType: dataOrderDetail?.general.orderType,
      formValues: {
        ...normalizeOrderDetail(
          dataOrderDetail,
          dataAdditionalServices,
          tempShippingOptions
        ),
      },
      orderStatus: dataOrderDetail.general.orderStatus,
    };
  } catch (error) {
    console.error(
      "🚀 ~ file: getDetailPesananData.js:280 ~ fetcher ~ error:",
      error
    );
  }
};

export const useGetOrderDetail = (orderId) =>
  useSWR(`detailPesanan/${orderId}`, getOrderDetail);

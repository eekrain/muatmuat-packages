import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { normalizeOrderDetail } from "@/lib/normalizers/sewaarmada";
import {
  normalizeCargos,
  normalizeLocations,
} from "@/lib/normalizers/sewaarmada/normalizeApiToForm";
import { normalizeFetchTruck } from "@/lib/normalizers/sewaarmada/normalizeFetchTruck";

const useMockData_getOrderDetail = false;
const useMockData_getAdditionalServices = false;

const apiResultOrderDetail = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    general: {
      orderId: "1c2a62bc-d4ba-46d6-91ff-ecb9c3eab2b3",
      transporterOrderCode: "MT25A085A",
      invoiceNumber: "INV/MT25AA085",
      orderStatus: "WAITING_PAYMENT_2",
      orderTitle: "Menunggu Pembayaran",
      orderType: "SCHEDULED",
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
      },
      loadTimeStart: "2025-07-23T13:35:00.000Z",
      loadTimeEnd: "2025-07-23T16:43:00.000Z",
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
      ],
      isHalalLogistic: true,
      canReview: false,
      isEdit: false,
      cargo: [
        {
          cargoId: "fee63fc5-72a3-49df-a38c-fabd4ecd6e6b",
          cargoTypeName: "Cargo Type",
          cargoCategoryName: "Cargo Category",
          name: "Furniture Kayu",
          weight: 22,
          weightUnit: "ton",
          dimensions: {
            length: 2,
            width: 2,
            height: 2,
            unit: "m",
          },
          sequence: 1,
        },
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
            name: "Troli",
            price: 100000,
            withShipping: false,
          },
          {
            name: "Bantuan Tambahan",
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
    },
    changeCount: 0,
    isChangeable: true,
    isCancellable: true,
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
};

const apiResultAdditionalServices = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: {
    additionalService: [
      {
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
        },
      },
      {
        name: "Troli",
        price: 100000,
        isShipping: false,
      },
      {
        name: "Bantuan Tambahan",
        price: 100000,
        isShipping: false,
      },
    ],
  },
  Type: "/v1/orders/1c2a62bc-d4ba-46d6-91ff-ecb9c3eab2b3/additional-services",
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

    // console.log("dataOrderDetail", dataOrderDetail);
    // console.log("dataAdditionalServices", dataAdditionalServices);
    let tempShippingOptions = [];
    let tempTrucks = [];

    // Fetch truck
    const { general, summary } = dataOrderDetail;
    const { orderType } = general;
    const { cargo, carrier, loadTimeStart, loadTimeEnd, locations } = summary;
    const fetchTruckRequestBody = normalizeFetchTruck({
      orderType,
      loadTimeStart,
      ...(loadTimeEnd && { loadTimeEnd, showRangeOption: true }),
      lokasiMuat: normalizeLocations(locations, "PICKUP"),
      lokasiBongkar: normalizeLocations(locations, "DROPOFF"),
      informasiMuatan: normalizeCargos(cargo),
      carrierId: carrier.carrierId,
    });
    const fetchTrucksResult = await fetcherMuatrans.post(
      "v1/orders/trucks/recommended",
      fetchTruckRequestBody
    );
    tempTrucks = fetchTrucksResult?.data?.Data;

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
      orderType: dataOrderDetail.general.orderType, // Use the provided type or default to "INSTANT"
      formValues: {
        ...normalizeOrderDetail(
          dataOrderDetail,
          dataAdditionalServices,
          tempShippingOptions
        ),
        tempTrucks,
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

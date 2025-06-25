// /api/v1/orders/{orderId}/additional-services

const apiResult = {
  Message: {
    Code: 200,
    Text: "Order detail retrieved successfully",
  },
  Data: {
    additionalService: [
      {
        name: "",
        isShipping: true,
        addressInformation: {
          fullAddress: "Jl. Sudirman No. 123, Jakarta Pusat",
          detailAddress: "Gedung ABC Lantai 5",
          latitude: -6.2088,
          longitude: 106.8456,
          district: "Tanah Abang",
          districtId: 2,
          city: "Jakarta Pusat",
          cityId: 213,
          province: "DKI Jakarta",
          provinceId: 35,
          postalCode: "10270",
        },
        courier: "JNE",
        courierPrice: 200000,
        insurancePrice: 10000000000000,
      },
    ],
  },
  Type: "ADDITIONAL_SERVICES_ORDER_DETAIL",
};

export const getAdditionalServices = async (cacheKey) => {
  const result = apiResult;
  return result.Data;
};

export const useGetAdditionalServices = (orderId) =>
  useSWR(orderId ? `additional-services/${orderId}` : null, fetcher);

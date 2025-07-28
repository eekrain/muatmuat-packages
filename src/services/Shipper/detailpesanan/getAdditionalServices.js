// /api/v1/orders/{orderId}/additional-services
import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true; // toggle mock data

const apiResult = {
  data: {
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
          insurancePrice: 10000,
        },
      ],
    },
    Type: "ADDITIONAL_SERVICES_ORDER_DETAIL",
  },
};

export const getAdditionalServices = async (cacheKey) => {
  const orderId = cacheKey.split("/")[1];

  let result;

  if (useMockData) {
    result = apiResult;
  } else {
    result = await fetcherMuatrans.get(
      `v1/orders/${orderId}/additional-services`
    );
  }

  return result?.data?.Data?.additionalService || [];
};

export const useGetAdditionalServices = (orderId) =>
  useSWR(`additional-services/${orderId}`, fetcher);

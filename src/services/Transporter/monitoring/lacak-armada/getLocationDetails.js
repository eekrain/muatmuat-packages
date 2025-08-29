import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const isMockData = true;

const apiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: {
      pickupLocation: [
        {
          sequence: 1,
          fullAddress:
            "Jalan Semarang Indah, Tawangmas, Kota Semarang, Jawa Tengah, Indonesia",
          district: "Semarang Barat",
          city: "Kota Semarang",
          latitude: -6.9656648,
          longitude: 110.3960998,
          picName: "Budiman",
          picPhoneNumber: "08923647234",
        },
      ],
      dropoffLocations: [
        {
          sequence: 1,
          fullAddress:
            "Jalan Tawangmas Baru Gang IV, Tawangmas, Kota Semarang, Jawa Tengah, Indonesia",
          district: "Semarang Barat",
          city: "Kota Semarang",
          latitude: -6.9725021,
          longitude: 110.394486,
          picName: "Tawang",
          picPhoneNumber: "089234243523",
        },
      ],
      fleets: [
        {
          encodedPolyline: "~oifA~i|xSbAcAbBsBfCgDxAgBpBeC",
          plateNumber: "AB 1234 CD",
          hasSos: true,
          status: "ON_DUTY",
          heading: 90,
        },
      ],
    },
    Type: "/v1/transporter/orders/location-details/44019d47-7429-4964-83ef-a586781a3755",
  },
};

export const fetcherLocationDetails = async (orderId) => {
  if (isMockData) {
    const result = apiResult;
    return result.data.Data;
  }

  const result = await fetcherMuatrans.get(
    `/v1/transporter/orders/location-details/${orderId}`
  );
  return result?.data?.Data || {};
};

export const useGetLocationDetails = (orderId) => {
  const cacheKey = orderId ? ["location-details", orderId] : null;

  return useSWR(cacheKey, () => fetcherLocationDetails(orderId), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
};

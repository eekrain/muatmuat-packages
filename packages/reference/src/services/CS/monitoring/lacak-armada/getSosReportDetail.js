import { fetcherMuatransCS } from "@/lib/fetcherBasicAuth";

const useMockData = true;

const apiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS report retrieved successfully",
    },
    Data: {
      category: "Truk/muatan dicuri", // nullable
      description:
        "truk mogok di tengah jalan, lalu segerombolan orang tiba-tiba datang membawa pickup naik keatas truk", // nullable
      licensePlate: "AB 1234 CD",
      truckImage: "https://picsum.photos/100?random=abc",
      reportTime: "2025-01-15T09:30:00+07:00", // [dbt_mt_sos.createdAt]
      images: [
        "https://picsum.photos/200?random=1",
        "https://picsum.photos/200?random=2",
        "https://picsum.photos/200?random=3",
        "https://picsum.photos/200?random=4",
      ],
      vehicleType: "Colt Diesel Double - Bak Terbuka",
      driverName: "Ardian Eka Candra",
      driverPhone: "0823-3123-1290",
      lastLocation: "Kab. Batu",
      orderNumber: "MT25A002A",
      orderStatus: "LOADING",
      pickupLocation: "Kota Surabaya, Kec. Tegalsari", //Lokasi muat pertama
      dropoffLocation: "Kab. Pasuruan, Kec. Klojen", // Lokasi bongkar terakhir

      vehicleId: "uuid", // dipake buat fetching contact
    },
    Type: "SOS_REPORT_DETAILS",
  },
};

export const getSosReportDetail = async (sosId) => {
  if (useMockData) {
    const result = apiResult;
    return result.data.Data;
  }

  const result = await fetcherMuatransCS.get(
    `v1/cs/orders/sos-reports/${sosId}`
  );
  return result?.data?.Data || {};
};

import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

const isMockCreateDriver = false;

const mockCreateDriverResponse = {
  Message: {
    Code: 201,
    Text: "Driver successfully created",
  },
  Data: {
    driverId: "d-987654321",
    name: "John Kok Driver",
    phoneNumber: "081234567823",
    simExpiryDate: "2025-12-31",
    documents: [
      {
        documentType: "KTP",
        documentUrl:
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/photo-1753166402594.webp",
        documentName: "ktp_123456.jpg",
      },
      {
        documentType: "SIM_B2_UMUM",
        documentUrl:
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/photo-1753166402594.webp",
        documentName: "sim_123456.jpg",
      },
    ],
    photos: [
      {
        photoType: "PROFILE",
        photoUrl:
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/photo-1753166402594.webp",
        photoName: "profile_123456.jpg",
      },
    ],
    createdAt: new Date().toISOString(),
  },
  Type: "CREATE_DRIVER",
};

export const createDriver = async (driverData) => {
  if (isMockCreateDriver) {
    return mockCreateDriverResponse;
  }

  const result = await fetcherMuatrans.post("v1/drivers", driverData);
  return result?.data;
};

export const useCreateDriver = () => {
  return useSWRMutation("v1/drivers", (url, { arg }) =>
    fetcherMuatrans.post(url, arg)
  );
};

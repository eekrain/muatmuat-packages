import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

const isMockUpdateDriver = false;

const mockUpdateDriverRequest = {
  name: "John Updated Driver",
  phoneNumber: "081234567891",
  simExpiryDate: "2026-12-31",
  documents: [
    {
      id: "aa0e8400-e29b-41d4-a716-446655440000",
      documentType: "KTP",
      documentUrl:
        "https://storage.muattrans.com/drivers/documents/ktp_updated.jpg",
      documentName: "ktp_updated.jpg",
    },
    {
      documentType: "SIM_B2_UMUM",
      documentUrl:
        "https://storage.muattrans.com/drivers/documents/sim_updated.jpg",
      documentName: "sim_updated.jpg",
      expiryDate: "2026-12-31",
    },
  ],
  photos: [
    {
      id: "cc0e8400-e29b-41d4-a716-446655440000",
      photoType: "PROFILE",
      photoUrl:
        "https://storage.muattrans.com/drivers/photos/profile_updated.jpg",
      photoName: "profile_updated.jpg",
    },
  ],
};

export const updateDriver = async (id, driverData) => {
  if (isMockUpdateDriver) {
    return mockUpdateDriverRequest;
  }

  const result = await fetcherMuatrans.put(`/v1/drivers/${id}`, driverData);
  return result?.data;
};

export const useUpdateDriver = (id) => {
  return useSWRMutation(`/v1/drivers/${id}`, (url, { arg }) =>
    fetcherMuatrans.put(url, arg)
  );
};

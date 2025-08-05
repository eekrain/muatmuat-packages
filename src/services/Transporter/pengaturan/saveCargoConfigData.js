import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

const isMockSaveCargoConfig = true;

const mockSaveCargoConfigResponse = {
  data: {
    Message: {
      Code: 200,
      Text: "Berhasil menyimpan muatan yang dilayani",
    },
    Data: {
      configurationId: "550e8400-e29b-41d4-a716-446655440200",
      totalCargoTypesSaved: 3,
      savedCargoTypes: [
        {
          cargoTypeId: "550e8400-e29b-41d4-a716-446655440010",
          cargoTypeName: "Bahan Mentah",
          isActive: true,
        },
        {
          cargoTypeId: "550e8400-e29b-41d4-a716-446655440011",
          cargoTypeName: "Produk Jadi",
          isActive: true,
        },
        {
          cargoTypeId: "550e8400-e29b-41d4-a716-446655440012",
          cargoTypeName: "Barang Berbahaya",
          isActive: true,
        },
      ],
      savedAt: new Date().toISOString(),
    },
    Type: "CARGO_CONFIG_SAVE_SUCCESS",
  },
};

export const saveTransporterCargoConfig = async (id, payload) => {
  if (isMockSaveCargoConfig) {
    return mockSaveCargoConfigResponse.data;
  }

  const result = await fetcherMuatrans.post(
    `v1/transporter-cargo-config/${id}`,
    payload
  );
  return result?.data;
};

export const useSaveTransporterCargoConfig = (id) => {
  return useSWRMutation(
    `v1/transporter-cargo-config/${id}`,
    async (url, { arg }) => {
      if (isMockSaveCargoConfig) {
        return mockSaveCargoConfigResponse.data.Data;
      }
      const result = await fetcherMuatrans.post(url, arg);
      return result?.data?.Data || {};
    }
  );
};

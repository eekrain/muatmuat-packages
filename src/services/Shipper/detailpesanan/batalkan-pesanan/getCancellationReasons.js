import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false; // mock detailpesanan

const apiResult = {
  data: {
    Message: {
      code: 200,
      text: "Success",
    },
    Data: {
      reasons: [
        { reasonId: "1", reasonName: "Keadaan Darurat / Perubahan Rencana" },
        { reasonId: "2", reasonName: "Ingin Mengganti Armada / Carrier" },
        { reasonId: "3", reasonName: "Perubahan Kebutuhan Pengiriman" },
        { reasonId: "4", reasonName: "Pencarian Armada Terlalu Lama" },
        { reasonId: "5", reasonName: "Alasan Pribadi atau Tidak Dijelaskan" },
        { reasonId: "6", reasonName: "Perubahan Rencana Mendadak" },
        { reasonId: "7", reasonName: "Ketidakpastian atau Perubahan Kondisi" },
      ],
    },
  },
};
export const getCancellationReasons = async (url) => {
  let result;
  if (useMockData) {
    result = apiResult;
  } else {
    result = await fetcherMuatrans.get(url);
  }
  const data = result?.data?.Data?.reasons;
  if (!data) return [];

  return data.map((val) => ({
    value: val?.reasonId,
    label: val?.reasonName,
  }));
};

export const useGetCancellationReasons = () => {
  return useSWR("v1/orders/cancellation-reasons", getCancellationReasons);
};

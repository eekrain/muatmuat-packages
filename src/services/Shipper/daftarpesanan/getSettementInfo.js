import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

// Mock API result for development/testing
export const mockAPIResult = {
  Message: {
    Code: 200,
    Text: "OK",
  },
  Data: [
    {
      orderId: [
        "dcdaf886-56d6-4d84-89d6-a21ec18d0bc1",
        "1c2a62bc-d4ba-46d6-91ff-ecb9c3eab2b3",
        "661e5850-d7fa-482a-ab9e-b76c15e66998",
        "be47fbfb-b9db-42fb-9126-4ea4d20f92bf",
        "28c4c896-5435-41d8-a0a2-1e6cd7c02058",
        "366807f6-cbe8-4754-9c7a-0ff97e924c66",
        "c7415f7f-48f6-4de2-8950-0035e2c61b4d",
      ],
      alertText: "labelAlertInfoMenungguPembayaran",
    },
    {
      orderId: [],
      alertText: "labelAlertInfoMenungguPelunasan",
    },
    {
      orderId: [
        "0a22e45e-25b7-459d-b826-7c618d47250e",
        "c649ee80-8941-41ef-a753-777c329972bc",
        "db2ebc46-2f72-4349-83cd-498cfb4270a7",
        "66e50c08-7612-4b5f-8b29-5a7d67946cdc",
      ],
      alertText: "labelAlertInfoMenungguKonfirmasi",
    },
    {
      orderId: ["2f8d1b39-ae1c-45c0-a1be-326431d64255"],
      alertText: "labelAlertInfoPesananTidakDapatDiproses",
    },
  ],
  Type: "/v1/orders/settlement/alert-info",
};

// Fetcher function for settlement info
export const getSettlementInfo = async (url) => {
  let result;
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(url);
  }
  return result?.data?.Data || [];
};

// SWR mutation hook
export const useGetSettlementInfo = (defaultPage) =>
  useSWR(
    defaultPage ? "v1/orders/settlement/alert-info" : null,
    getSettlementInfo
  );

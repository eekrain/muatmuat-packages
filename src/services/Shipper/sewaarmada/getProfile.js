import useSWR from "swr";

import { fetcherMuatparts } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: {
      profile: {
        id: "2953",
        name: "friday sub user",
        noWA: "081331731770",
        email: "fridayanditars@gmail.com",
        accountTypeID: 1,
        accountType: "Perusahaan",
        refferalCode: null,
        avatar:
          "https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/avatar/profile/2953.png",
        isVerifPhone: 1,
        isVerifEmail: 0,
      },
      storeInformation: {},
      companyData: {},
      legality: {},
    },
    Type: "/v1/muatparts/profile",
  },
};

// Fetcher function for GET /v1/muatparts/profile
export const getProfile = () => fetcherMuatparts.get("/v1/muatparts/profile");

// SWR hook for profile data
export const useGetProfile = () =>
  useSWR("/v1/muatparts/profile", () => getProfile().then((res) => res.data));

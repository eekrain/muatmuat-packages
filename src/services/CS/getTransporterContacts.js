import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false; // mock detailpesanan

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "OK",
    },
    Data: {
      companyName: "PT Backend Sejahterah",
      contacts: [
        {
          name: "John Doe",
          position: "Manager",
          phoneNumber: "628123456788",
        },
      ],
      companyPhone: "02112345678",
      emergency: {
        name: "John Doe",
        position: "Registrant",
        phoneNumber: "628123456788",
      },
    },
    Type: "/v1/cs/transporters/75be429d-16dc-478a-992b-16c8df1c781b/contacts",
  },
};

// Fetcher function
export const getTransporterContacts = async (transporterId) => {
  let result;
  if (useMockData) {
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(
      `/v1/cs/transporters/${transporterId}/contacts`
    );
  }
  return result.data.Data;
};

// SWR hook for GET request
export const useGetTransporterContacts = (transporterId) =>
  useSWR(transporterId ? `transporter-contacts/${transporterId}` : null, () =>
    getTransporterContacts(transporterId)
  );

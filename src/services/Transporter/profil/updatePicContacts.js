import useSWRMutation from "swr/mutation";

import { fetcherMuatrans } from "@/lib/axios";

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "PIC contacts updated successfully",
    },
    Data: {
      picContacts: [
        {
          id: "8543241f-54d0-42f2-a9a7-74b187c31579",
          picOrder: 1,
          picName: "John Doe Updated",
          picPosition: "Senior Operations Manager",
          phoneNumber: "628123456789",
          updatedAt: "2025-08-05T10:35:00Z",
          isActive: true,
        },
        {
          id: "5d66edce-0fb3-4c10-8a97-f3b4c2b28f6a",
          picOrder: 2,
          picName: "Jane Smith Updated",
          picPosition: "Fleet Coordinator",
          phoneNumber: "628987654321",
          updatedAt: "2025-08-05T10:35:00Z",
          isActive: true,
        },
        {
          id: "86028452-1cb6-407b-9d4f-37aadf5d38c3",
          picOrder: 3,
          picName: "Bob Wilson",
          picPosition: "Logistics Supervisor",
          phoneNumber: "628555123456",
          updatedAt: "2025-08-05T10:35:00Z",
          isActive: true,
        },
      ],
      operation: {
        totalUpdated: 3,
        sequentialCheck: "PASSED",
        duplicateCheck: "PASSED",
      },
    },
    Type: "UPDATE_PIC_CONTACTS",
  },
};

/**
 * Update PIC contacts for transporter
 * @param {Object} data - Request body containing picContacts array
 * @returns {Promise} API response
 */
export const updatePicContacts = async (data) => {
  return fetcherMuatrans.put("/v1/transporter/profile/pic", data);
};

/**
 * SWR mutation hook for updating PIC contacts
 * @returns {Object} SWR mutation object with trigger, data, error, isMutating
 */
export const useUpdatePicContacts = () =>
  useSWRMutation("/v1/transporter/profile/pic", (url, { arg }) =>
    fetcherMuatrans.put(url, arg)
  );

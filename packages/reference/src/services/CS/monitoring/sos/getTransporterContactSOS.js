import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockTransporterContacts = {
  data: {
    Message: {
      Code: 200,
      Text: "Transporter contacts retrieved successfully",
    },
    Data: {
      transporter: {
        id: "trans123",
        companyName: "PT ABC Transport",
      },
      company: {
        phoneNumber: "02112345678",
        whatsappBusinessNumber: "628212345678",
      },
      emergency: {
        contactName: "John Smith",
        position: "Direktur Operasional",
        phoneNumber: "08987654321",
        whatsappNumber: "628987654321",
      },
      pics: [
        {
          id: "pic1",
          picName: "Jane Doe",
          position: "Dispatcher",
          phoneNumber: "08123456789",
          whatsappNumber: "628123456789",
          picType: "PIC_1",
          isActive: true,
        },
        {
          id: "pic2",
          picName: "Bob Johnson",
          position: "Manager Operasional",
          phoneNumber: "08234567890",
          whatsappNumber: "628234567890",
          picType: "PIC_2",
          isActive: true,
        },
        {
          id: "pic3",
          picName: "Alice Brown",
          position: "Supervisor",
          phoneNumber: "08345678901",
          whatsappNumber: "628345678901",
          picType: "PIC_3",
          isActive: true,
        },
      ],
    },
    Type: "TRANSPORTER_CONTACTS",
  },
};

export const mockTransporterContactsLarge = {
  data: {
    Message: {
      Code: 200,
      Text: "Transporter contacts retrieved successfully",
    },
    Data: {
      transporter: {
        id: "trans456",
        companyName: "PT XYZ Logistics",
      },
      company: {
        phoneNumber: "02187654321",
        whatsappBusinessNumber: "628287654321",
      },
      emergency: {
        contactName: "Sarah Wilson",
        position: "Direktur Utama",
        phoneNumber: "08765432109",
        whatsappNumber: "628765432109",
      },
      pics: [
        {
          id: "pic4",
          picName: "Michael Chen",
          position: "Senior Dispatcher",
          phoneNumber: "08456789012",
          whatsappNumber: "628456789012",
          picType: "PIC_1",
          isActive: true,
        },
        {
          id: "pic5",
          picName: "Lisa Garcia",
          position: "Operations Manager",
          phoneNumber: "08567890123",
          whatsappNumber: "628567890123",
          picType: "PIC_2",
          isActive: true,
        },
        {
          id: "pic6",
          picName: "David Kim",
          position: "Fleet Supervisor",
          phoneNumber: "08678901234",
          whatsappNumber: "628678901234",
          picType: "PIC_3",
          isActive: true,
        },
        {
          id: "pic7",
          picName: "Emma Davis",
          position: "Customer Service Lead",
          phoneNumber: "08789012345",
          whatsappNumber: "628789012345",
          picType: "PIC_4",
          isActive: true,
        },
        {
          id: "pic8",
          picName: "James Wilson",
          position: "Safety Officer",
          phoneNumber: "08890123456",
          whatsappNumber: "628890123456",
          picType: "PIC_5",
          isActive: false,
        },
      ],
    },
    Type: "TRANSPORTER_CONTACTS",
  },
};

export const mockTransporterContactsSmall = {
  data: {
    Message: {
      Code: 200,
      Text: "Transporter contacts retrieved successfully",
    },
    Data: {
      transporter: {
        id: "trans789",
        companyName: "PT DEF Cargo",
      },
      company: {
        phoneNumber: "02111223344",
        whatsappBusinessNumber: "628211223344",
      },
      emergency: {
        contactName: "Robert Lee",
        position: "Manager",
        phoneNumber: "08666777888",
        whatsappNumber: "628666777888",
      },
      pics: [
        {
          id: "pic9",
          picName: "Maria Santos",
          position: "Coordinator",
          phoneNumber: "08111222333",
          whatsappNumber: "628111222333",
          picType: "PIC_1",
          isActive: true,
        },
      ],
    },
    Type: "TRANSPORTER_CONTACTS",
  },
};

export const mockTransporterContactsNotFound = {
  data: {
    Message: {
      Code: 404,
      Text: "Transporter not found",
    },
    Data: {
      errors: [
        {
          field: "transporterId",
          message: "Transporter with specified ID does not exist",
        },
      ],
    },
    Type: "TRANSPORTER_CONTACTS_ERROR",
  },
};

export const getTransporterContactSOS = async (transporterId, params = {}) => {
  if (!transporterId) {
    return {
      data: {
        Message: {
          Code: 400,
          Text: "Transporter ID is required",
        },
        Data: {
          errors: [
            {
              field: "transporterId",
              message: "Transporter ID parameter is missing",
            },
          ],
        },
        Type: "TRANSPORTER_CONTACTS_ERROR",
      },
      raw: null,
    };
  }

  let result;

  if (useMockData) {
    // Simulate different scenarios based on transporter ID
    if (transporterId === "trans123") {
      result = mockTransporterContacts.data;
    } else if (transporterId === "trans456") {
      result = mockTransporterContactsLarge.data;
    } else if (transporterId === "trans789") {
      result = mockTransporterContactsSmall.data;
    } else {
      result = mockTransporterContactsNotFound.data;
    }
  } else {
    try {
      result = await fetcherMuatrans.get(
        `/v1/cs/sos/transporters/${transporterId}/contacts`,
        { params }
      );
    } catch (error) {
      // Handle error response
      if (error.response?.status === 404) {
        return {
          data: mockTransporterContactsNotFound.data,
          raw: error.response,
        };
      }

      return {
        data: {
          Message: {
            Code: error.response?.status || 500,
            Text:
              error.response?.data?.Message?.Text ||
              "Failed to retrieve transporter contacts",
          },
          Data: {
            errors: [
              {
                field: "system",
                message: "Internal server error occurred",
              },
            ],
          },
          Type: "TRANSPORTER_CONTACTS_ERROR",
        },
        raw: error.response,
      };
    }
  }

  return {
    data: result?.data || {},
    raw: result,
  };
};

export const useGetTransporterContactSOS = (transporterId, params = {}) => {
  const { data, error, isLoading, mutate } = useSWR(
    transporterId ? [`getTransporterContactSOS`, transporterId, params] : null,
    () => getTransporterContactSOS(transporterId, params),
    {
      refreshInterval: 60000, // Refresh every 1 minute for contact updates
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    data: data || {}, // Remove extra .data access
    raw: data?.raw,
    isLoading,
    isError: !!error,
    mutate, // Expose mutate for manual refresh
  };
};
